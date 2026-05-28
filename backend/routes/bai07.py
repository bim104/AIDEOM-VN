from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from pymoo.core.problem import ElementwiseProblem
from pymoo.algorithms.moo.nsga2 import NSGA2
from pymoo.optimize import minimize

router = APIRouter(tags=["Bài 7"])

# Nhận trọng số động từ Frontend để chạy câu 7.4.3 động hoàn toàn
class OptimizationParams(BaseModel):
    w_growth: float = 0.40      # Trọng số tăng trưởng (f1)
    w_inclusive: float = 0.25   # Trọng số bao trùm (f2)
    w_env: float = 0.20         # Trọng số môi trường (f3)
    w_security: float = 0.15    # Trọng số an ninh (f4)
    pop_size: int = 100
    n_gen: int = 200

# Câu 7.4.1: Định nghĩa lớp Problem kế thừa từ ElementwiseProblem với 24 biến và 4 mục tiêu
class MacroPolicyProblem(ElementwiseProblem):
    def __init__(self):
        super().__init__(
            n_var=24,   # 24 biến quyết định
            n_obj=4,    # 4 mục tiêu vĩ mô
            n_ieq_constr=2, # 2 ràng buộc bất đẳng thức vĩ mô
            xl=np.zeros(24), # Chặn dưới = 0
            xu=np.ones(24)   # Chặn trên = 1
        )

    def _evaluate(self, x, out, *args, **kwargs):
        # Giả lập ma trận hệ số tác động vĩ mô của 24 biến lên 4 mục tiêu
        # Để trực quan, pymoo mặc định là MINIMIZE, nên ta tìm Max bằng cách đảo dấu (-)
        f1 = -np.sum(x[:6] * 1.5) - np.sum(x[6:12] * 0.8)  # Tăng trưởng
        f2 = -np.sum(x[6:18] * 1.2) - np.sum(x[18:] * 0.5) # Bao trùm
        f3 = -np.sum(x[12:20] * 1.4) + np.sum(x[:6] * 0.4) # Môi trường (Công nghiệp làm hại mt)
        f4 = -np.sum(x[16:] * 1.3) - np.sum(x[:8] * 0.6)   # An ninh

        # Ràng buộc: Tổng nguồn lực phân bổ không vượt quá hạn mức
        g1 = np.sum(x) - 15.0
        g2 = 4.0 - np.sum(x[:8]) # Ép phải đầu tư tối thiểu cho nhóm cốt lõi

        out["F"] = [f1, f2, f3, f4]
        out["G"] = [g1, g2]

@router.post("/api/bai07/optimize")
def run_macro_optimization(params: OptimizationParams):
    # Khởi tạo bài toán và thuật toán NSGA-II
    problem = MacroPolicyProblem()
    algorithm = NSGA2(pop_size=params.pop_size)
    
    # Kích hoạt tiến hóa tìm tập nghiệm Pareto
    res = minimize(problem, algorithm, seed=42, termination=('n_gen', params.n_gen))
    
    if res.F is None or len(res.F) == 0:
        return {"success": False, "message": "Thuật toán không tìm thấy tập nghiệm Pareto khả thi!"}
        
    # Chuyển đổi hàm mục tiêu về dạng CỰC ĐẠI (+) để hiển thị giao diện và chạy TOPSIS
    gdp_gains = -res.F[:, 0]
    inclusive_scores = -res.F[:, 1]
    env_scores = -res.F[:, 2]
    sec_scores = -res.F[:, 3]
    
    pareto_front = np.column_stack([gdp_gains, inclusive_scores, env_scores, sec_scores])
    num_solutions = len(pareto_front)
    
    # -------------------------------------------------------------
    # Câu 7.4.3: Áp dụng thuật toán TOPSIS lên tập Pareto để tìm nghiệm thỏa hiệp
    # -------------------------------------------------------------
    # Chuẩn hóa ma trận vector TOPSIS
    norm_matrix = pareto_front / np.sqrt(np.sum(pareto_front**2, axis=0))
    
    # Cân bằng trọng số người dùng nhập
    w_total = params.w_growth + params.w_inclusive + params.w_env + params.w_security
    weights = np.array([
        params.w_growth / w_total, params.w_inclusive / w_total,
        params.w_env / w_total, params.w_security / w_total
    ])
    
    weighted_matrix = norm_matrix * weights
    
    # Tìm điểm lý tưởng dương (Max) và âm (Min) vì cả 4 mục tiêu đều đang ở dạng Cực đại
    ideal_pos = np.max(weighted_matrix, axis=0)
    ideal_neg = np.min(weighted_matrix, axis=0)
    
    s_pos = np.sqrt(np.sum((weighted_matrix - ideal_pos)**2, axis=1))
    s_neg = np.sqrt(np.sum((weighted_matrix - ideal_neg)**2, axis=1))
    
    c_star = s_neg / (s_pos + s_neg)
    best_idx = int(np.argmax(c_star)) # Nghiệm thỏa hiệp sở hữu điểm TOPSIS cao nhất
    
    topsis_solution = {
        "f1_growth": round(float(pareto_front[best_idx, 0]), 2),
        "f2_inclusive": round(float(pareto_front[best_idx, 1]), 2),
        "f3_env": round(float(pareto_front[best_idx, 2]), 2),
        "f4_security": round(float(pareto_front[best_idx, 3]), 2)
    }
    
    # -------------------------------------------------------------
    # Câu 7.4.4: Phân tích "Chi phí cơ hội" so với nghiệm Tăng trưởng cao nhất
    # -------------------------------------------------------------
    max_growth_idx = int(np.argmax(gdp_gains))
    max_growth_solution = {
        "f1_growth": round(float(pareto_front[max_growth_idx, 0]), 2),
        "f2_inclusive": round(float(pareto_front[max_growth_idx, 1]), 2),
        "f3_env": round(float(pareto_front[max_growth_idx, 2]), 2),
        "f4_security": round(float(pareto_front[max_growth_idx, 3]), 2)
    }
    
    # Tính toán mức độ hi sinh (%) của nghiệm Max Growth so với nghiệm thỏa hiệp TOPSIS
    # % hi sinh = (Điểm Thỏa Hiệp - Điểm Max Growth) / Điểm Thỏa Hiệp * 100
    drop_inclusive = 0.0
    if topsis_solution["f2_inclusive"] > 0:
        drop_inclusive = ((topsis_solution["f2_inclusive"] - max_growth_solution["f2_inclusive"]) / topsis_solution["f2_inclusive"]) * 100
        
    drop_env = 0.0
    if topsis_solution["f3_env"] > 0:
        drop_env = ((topsis_solution["f3_env"] - max_growth_solution["f3_env"]) / topsis_solution["f3_env"]) * 100

    # Gom danh sách tập Pareto rút gọn (lấy tối đa 30 nghiệm đại diện) để vẽ biểu đồ Frontend
    scatter_data = []
    step = max(1, num_solutions // 30)
    for i in range(0, num_solutions, step):
        scatter_data.append({
            "index": i + 1,
            "f1": round(float(pareto_front[i, 0]), 2),
            "f2": round(float(pareto_front[i, 1]), 2),
            "f3": round(float(pareto_front[i, 2]), 2),
            "f4": round(float(pareto_front[i, 3]), 2),
            "is_topsis": 1 if i == best_idx else 0
        })

    return {
        "success": True,
        "num_pareto_solutions": num_solutions,
        "topsis_solution": topsis_solution,
        "max_growth_solution": max_growth_solution,
        "opportunity_cost": {
            "drop_inclusive_pct": round(float(drop_inclusive), 2),
            "drop_env_pct": round(float(drop_env), 2)
        },
        "scatter_data": scatter_data
      }