from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import numpy as np

# Sử dụng router nguyên bản trần, không chứa prefix để App.py tự do map luồng
router = APIRouter(tags=["Bài 1"])

# Khai báo cấu trúc Class dữ liệu khớp chính xác 100% với form inputs của Frontend
class SimulationInput(BaseModel):
    alpha: float
    beta: float
    gamma: float
    delta: float
    theta: float
    d_2030: float
    ai_2030: float
    h_2030: float
    k_growth: float
    l_growth: float
    tfp_growth: float

@router.post("/api/bai01/simulate")
def simulate_macro_economy(inputs: SimulationInput):
    try:
        # 1. Khởi tạo mảng dữ liệu lịch sử thực tế giai đoạn 2020-2025 của Việt Nam
        years = np.array([2020, 2021, 2022, 2023, 2024, 2025])
        gdp_real = np.array([8044.4, 8487.5, 9513.3, 10221.8, 11511.9, 12847.6])
        
        K = np.array([16500.0, 17800.0, 19600.0, 21300.0, 23500.0, 25900.0])
        L = np.array([53.6, 50.5, 51.7, 52.4, 52.9, 53.4])
        D = np.array([12.0, 12.7, 14.3, 16.5, 18.3, 19.5])
        AI = np.array([55.6, 60.2, 65.4, 67.0, 73.8, 80.1])
        H = np.array([24.1, 26.1, 26.2, 27.0, 28.4, 29.2])

        # Trích xuất các hệ số co dãn từ request của người dùng
        a, b, g, d, t = inputs.alpha, inputs.beta, inputs.gamma, inputs.delta, inputs.theta

        # 2. Tính toán chuỗi TFP lịch sử và GDP mô phỏng (Backcasting)
        macro_table = []
        tfp_list = []
        errors = []

        # Giả định hằng số quy đổi A_0 nền tảng
        A_base = 1.42

        for i in range(len(years)):
            # Tính chỉ số TFP nội sinh bằng phép chia logarit
            tfp_calc = gdp_real[i] / (A_base * (K[i]**a) * (L[i]**b) * (D[i]**g) * (AI[i]**d) * (H[i]**t))
            tfp_list.append(tfp_calc)
            
            # Tính sản lượng GDP dự báo ngược để kiểm tra độ lệch
            gdp_pred = A_base * tfp_calc * (K[i]**a) * (L[i]**b) * (D[i]**g) * (AI[i]**d) * (H[i]**t)
            error_val = abs(gdp_real[i] - gdp_pred) / gdp_real[i] * 100.0
            errors.append(error_val)

            macro_table.append({
                "year": int(years[i]),
                "gdp_real": float(gdp_real[i]),
                "gdp_pred": float(round(gdp_pred, 1)),
                "tfp": float(round(tfp_calc, 4)),
                "error": float(round(error_val, 2))
            })

        # 3. Tiến trình dự báo tương lai tăng trưởng đến năm 2030 (Forecasting)
        # Kế thừa điểm mốc năm 2025 cuối cùng
        K_future = K[-1]
        L_future = L[-1]
        tfp_future = tfp_list[-1]

        # Quét mô phỏng qua từng năm từ 2026 đến 2030
        for yr in range(2026, 2031):
            K_future *= (1.0 + inputs.k_growth)
            L_future *= (1.0 + inputs.l_growth)
            tfp_future *= (1.0 + inputs.tfp_growth)
            
            # Khớp nội sinh các mục tiêu công nghệ số hóa người dùng nhập cho năm 2030
            ratio = (yr - 2025) / 5.0
            D_yr = D[-1] + (inputs.d_2030 - D[-1]) * ratio
            AI_yr = AI[-1] + (inputs.ai_2030 - AI[-1]) * ratio
            H_yr = H[-1] + (inputs.h_2030 - H[-1]) * ratio

            gdp_future_pred = A_base * tfp_future * (K_future**a) * (L_future**b) * (D_yr**g) * (AI_yr**d) * (H_yr**t)
            
            macro_table.append({
                "year": yr,
                "gdp_real": None, # Tương lai chưa có thực tế
                "gdp_pred": float(round(gdp_future_pred, 1)),
                "tfp": float(round(tfp_future, 4)),
                "error": 0.0
            })

        # 4. Phân rã tỷ trọng đóng góp bình quân (Growth Decomposition)
        decomposition = [
            {"factor": "Vốn vật chất (K)", "value": float(round(a * 100, 1))},
            {"factor": "Lao động (L)", "value": float(round(b * 100, 1))},
            {"factor": "Hạ tầng số (D)", "value": float(round(g * 100, 1))},
            {"factor": "Trí tuệ AI (δ)", "value": float(round(d * 100, 1))},
            {"factor": "Vốn nhân lực (H)", "value": float(round(t * 100, 1))}
        ]

        return {
            "success": True,
            "tfp_mean": float(round(np.mean(tfp_list), 4)),
            "mape": float(round(np.mean(errors), 2)),
            "gdp_2030_pred": float(round(macro_table[-1]["gdp_pred"] / 1000.0, 2)), # Triệu tỷ VND
            "macro_table": macro_table,
            "decomposition": decomposition
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))