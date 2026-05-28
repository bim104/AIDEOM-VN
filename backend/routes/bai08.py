from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from scipy.optimize import minimize

router = APIRouter(tags=["Bài 8"])

class DynamicOptimizationParams(BaseModel):
    gamma: float = 1.5           # Hệ số CRRA
    rho: float = 0.97            # Hệ số chiết khấu
    shock_year: int = 2028       # Năm xảy ra cú sốc vĩ mô
    shock_drop_pct: float = 0.08 # Mức sụt giảm GDP do sốc (8%)

@router.post("/api/bai08/optimize")
def run_dynamic_optimization(params: DynamicOptimizationParams):
    T = 10  # Giai đoạn 10 năm từ 2026 đến 2035
    
    # -------------------------------------------------------------
    # 1. THIẾT LẬP THAM SỐ VÀ ĐIỀU KIỆN BAN ĐẦU
    # -------------------------------------------------------------
    K0, L0, D0, AI0, H0, A0 = 27500.0, 53.9, 20.3, 86.0, 30.0, 1.2
    delta_K, delta_D, delta_AI = 0.05, 0.12, 0.15
    theta_H, mu = 0.8, 0.02
    phi1, phi2, phi3 = 0.003, 0.002, 0.004
    
    # Lao động tăng trưởng tự nhiên nhẹ qua các năm
    L = [L0 * (1.005 ** t) for t in range(T)]

    # Hàm thỏa dụng CRRA (Bảo vệ chia cho 0 hoặc log khi gamma=1)
    def utility(c, gamma):
        if c <= 1e-4: return -1e5
        return np.log(c) if gamma == 1.0 else (c ** (1 - gamma)) / (1 - gamma)

    # -------------------------------------------------------------
    # 2. HÀM TỐI ƯU HÓA QUỸ ĐẠO BẰNG SLSQP (KỊCH BẢN BASELINE VÀ SHOCK)
    # -------------------------------------------------------------
    def solve_trajectory(apply_shock=False):
        # Biến quyết định cho mỗi năm t gồm 4 loại đầu tư: [I_K, I_D, I_AI, I_H]
        # Tổng cộng 10 năm x 4 = 40 biến
        init_guess = np.ones(T * 4) * 500.0
        bounds = [(10.0, 10000.0) for _ in range(T * 4)]

        def objective_func(x):
            # Tách mảng biến
            I_K = x[0::4]
            I_D = x[1::4]
            I_AI = x[2::4]
            I_H = x[3::4]

            # Khởi tạo chuỗi trạng thái liên thời gian
            K_t, D_t, AI_t, H_t, A_t = K0, D0, AI0, H0, A0
            total_welfare = 0.0

            for t in range(T):
                # Hàm sản xuất Cobb-Douglas mở rộng vĩ mô
                Y_t = A_t * (K_t**0.33) * (L[t]**0.42) * (D_t**0.10) * (AI_t**0.08) * (H_t**0.07)
                
                # Áp dụng cú sốc vĩ mô câu 8.3.3
                if apply_shock and (2026 + t) == params.shock_year:
                    Y_t *= (1.0 - params.shock_drop_pct)

                # Tiêu dùng là phần còn lại sau đầu tư theo ràng buộc ngân sách
                invest_total = I_K[t] + I_D[t] + I_AI[t] + I_H[t]
                C_t = max(10.0, Y_t - invest_total)

                # Cộng dồn phúc lợi có chiết khấu liên thời gian
                total_welfare += (params.rho ** t) * utility(C_t, params.gamma)

                # Chuyển trạng thái sang năm t+1
                K_t = (1 - delta_K) * K_t + I_K[t]
                D_t = (1 - delta_D) * D_t + I_D[t]
                AI_t = (1 - delta_AI) * AI_t + I_AI[t]
                H_t = H_t + theta_H * I_H[t] - mu * H_t
                A_t = A_t * (1 + phi1 * D_t + phi2 * AI_t + phi3 * H_t)

            return -total_welfare # Đảo dấu để tối đa hóa

        # Ràng buộc ngân sách phi tuyến: Tổng đầu tư không vượt quá gdp Y_t
        def budget_constraint(x):
            I_K = x[0::4]
            I_D = x[1::4]
            I_AI = x[2::4]
            I_H = x[3::4]
            
            K_t, D_t, AI_t, H_t, A_t = K0, D0, AI0, H0, A0
            penalties = []

            for t in range(T):
                Y_t = A_t * (K_t**0.33) * (L[t]**0.42) * (D_t**0.10) * (AI_t**0.08) * (H_t**0.07)
                if apply_shock and (2026 + t) == params.shock_year:
                    Y_t *= (1.0 - params.shock_drop_pct)
                
                invest_total = I_K[t] + I_D[t] + I_AI[t] + I_H[t]
                penalties.append(Y_t - invest_total) # Phải >= 0

                K_t = (1 - delta_K) * K_t + I_K[t]
                D_t = (1 - delta_D) * D_t + I_D[t]
                AI_t = (1 - delta_AI) * AI_t + I_AI[t]
                H_t = H_t + theta_H * I_H[t] - mu * H_t
                A_t = A_t * (1 + phi1 * D_t + phi2 * AI_t + phi3 * H_t)

            return np.array(penalties)

        constraints = {'type': 'ineq', 'fun': budget_constraint}
        res = minimize(objective_func, init_guess, method='SLSQP', bounds=bounds, constraints=constraints)
        
        # Đóng gói kết quả quỹ đạo chi tiết phục vụ vẽ đồ thị câu 8.3.2
        opt_x = res.x
        I_K_opt = opt_x[0::4]
        I_D_opt = opt_x[1::4]
        I_AI_opt = opt_x[2::4]
        I_H_opt = opt_x[3::4]

        trajectory = []
        K_t, D_t, AI_t, H_t, A_t = K0, D0, AI0, H0, A0
        
        for t in range(T):
            Y_t = A_t * (K_t**0.33) * (L[t]**0.42) * (D_t**0.10) * (AI_t**0.08) * (H_t**0.07)
            if apply_shock and (2026 + t) == params.shock_year:
                Y_t *= (1.0 - params.shock_drop_pct)
                
            invest_total = I_K_opt[t] + I_D_opt[t] + I_AI_opt[t] + I_H_opt[t]
            C_t = max(10.0, Y_t - invest_total)

            trajectory.append({
                "year": 2026 + t,
                "K": round(K_t, 1),
                "D": round(D_t, 1),
                "AI": round(AI_t, 1),
                "H": round(H_t, 1),
                "Y": round(Y_t, 1),
                "C": round(C_t, 1),
                "I_AI": round(I_AI_opt[t], 1),
                "I_H": round(I_H_opt[t], 1)
            })

            K_t = (1 - delta_K) * K_t + I_K_opt[t]
            D_t = (1 - delta_D) * D_t + I_D_opt[t]
            AI_t = (1 - delta_AI) * AI_t + I_AI_opt[t]
            H_t = H_t + theta_H * I_H_opt[t] - mu * H_t
            A_t = A_t * (1 + phi1 * D_t + phi2 * AI_t + phi3 * H_t)

        return trajectory, float(-res.fun)

    # -------------------------------------------------------------
    # 3. ĐÁNH GIÁ HAI CHIẾN LƯỢC PHÂN BỔ VỐN (Câu 8.3.4)
    # -------------------------------------------------------------
    def evaluate_fixed_strategy(strategy_type):
        K_t, D_t, AI_t, H_t, A_t = K0, D0, AI0, H0, A0
        welfare = 0.0
        
        for t in range(T):
            Y_t = A_t * (K_t**0.33) * (L[t]**0.42) * (D_t**0.10) * (AI_t**0.08) * (H_t**0.07)
            
            # Cấu hình dòng tiền cố định cho 2 kịch bản chính sách
            if strategy_type == "equal":
                # Chiến lược (i): Đầu tư trải đều mỗi năm bằng nhau
                i_k, i_d, i_ai, i_h = 400.0, 150.0, 100.0, 80.0
            else:
                # Chiến lược (ii): Đầu tư mạnh 3 năm đầu (Front-load) rồi giảm 50%
                factor = 1.4 if t < 3 else 0.7
                i_k, i_d, i_ai, i_h = 400.0 * factor, 150.0 * factor, 100.0 * factor, 80.0 * factor

            C_t = max(10.0, Y_t - (i_k + i_d + i_ai + i_h))
            welfare += (params.rho ** t) * utility(C_t, params.gamma)

            K_t = (1 - delta_K) * K_t + i_k
            D_t = (1 - delta_D) * D_t + i_d
            AI_t = (1 - delta_AI) * AI_t + i_ai
            H_t = H_t + theta_H * i_h - mu * H_t
            A_t = A_t * (1 + phi1 * D_t + phi2 * AI_t + phi3 * H_t)

        return welfare

    # Thực thi tính toán ma trận tối ưu
    baseline_traj, baseline_welfare = solve_trajectory(apply_shock=False)
    shock_traj, shock_welfare = solve_trajectory(apply_shock=True)
    
    welfare_equal = evaluate_fixed_strategy("equal")
    welfare_front = evaluate_fixed_strategy("front")

    return {
        "success": True,
        "baseline_trajectory": baseline_traj,
        "shock_trajectory": shock_traj,
        "welfare_comparison": {
            "baseline_optimal": round(baseline_welfare, 2),
            "strategy_equal": round(welfare_equal, 2),
            "strategy_front_load": round(welfare_front, 2),
            "winner": "Đầu tư mạnh giai đoạn đầu (Front-load)" if welfare_front > welfare_equal else "Đầu tư trải đều"
        }
    }