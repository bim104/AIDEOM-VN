from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import numpy as np
from scipy.optimize import linprog

router = APIRouter(tags=["Bài 12 — Đồ án Tích hợp"])

class IntegratedInput(BaseModel):
    total_national_budget: float = 80000.0  # Tổng ngân sách tài khóa 2026-2030 (tỷ VND)
    cyber_risk_weight: float = 0.25         # Trọng số rủi ro an ninh mạng mạng công nghệ

@router.post("/api/bai12/execute")
def execute_aideom_vn_core(data: IntegratedInput):
    try:
        B_total = data.total_national_budget
        
        # Định nghĩa 5 kịch bản chính sách (S1 -> S5) theo Mục 15 của bài báo nguồn
        scenarios = {
            "S1. Truyền thống":      {"K": 0.70, "D": 0.10, "AI": 0.10, "H": 0.10},
            "S2. Số hóa nhanh":     {"K": 0.25, "D": 0.45, "AI": 0.15, "H": 0.15},
            "S3. AI dẫn dắt":       {"K": 0.20, "D": 0.20, "AI": 0.45, "H": 0.15},
            "S4. Bao trùm số":       {"K": 0.30, "D": 0.20, "AI": 0.10, "H": 0.40},
            "S5. Tối ưu cân bằng":   {"K": 0.35, "D": 0.30, "AI": 0.20, "H": 0.15} # Kết quả giải mẫu từ bộ công cụ AIDEOM
        }
        
        results_summary = {}
        
        # -------------------------------------------------------------
        # VÒNG LẶP ĐIỀU HỢP (ORCHESTRATION LOOP) QUÉT 5 KỊCH BẢN CHÍNH SÁCH
        # -------------------------------------------------------------
        for s_name, alloc in scenarios.items():
            # Phân bổ dòng vốn thực tế dựa trên tỷ trọng cấu hình của kịch bản
            x_K = B_total * alloc["K"]
            x_D = B_total * alloc["D"]
            x_AI = B_total * alloc["AI"]
            x_H = B_total * alloc["H"]

            # MODULE M1: DỰ BÁO KINH TẾ MACRO (Hàm Cobb-Douglas tích hợp từ Bài 1)
            # Trạng thái nền tảng Việt Nam 2026: K_0=27500, L=54.0, D_0=20.3, AI_0=86, H_0=30
            K_2030 = 27500.0 + x_K
            D_2030 = 20.3 + (x_D / 100.0)
            AI_2030 = 86.0 + (x_AI / 20.0)
            H_2030 = 30.0 + (x_H / 200.0)
            
            # Tính toán tăng trưởng GDP (Y) thông qua hằng số co dãn TFP
            Y_2030 = (K_2030**0.33) * (54.0**0.42) * (D_2030**0.10) * (AI_2030**0.08) * (H_2030**0.07)
            gdp_growth_rate = ((Y_2030 - 15600.0) / 15600.0) * 100.0

            # MODULE M2: SẴN SÀNG SỐ & CHỈ SỐ READINESS (Thuật toán TOPSIS từ Bài 6)
            # Giả lập hàm khoảng cách tiệm cận dựa trên phân bổ ngân sách công nghệ thực tế
            digital_readiness_score = 45.0 + (x_D / B_total)*100.0 + (x_AI / B_total)*50.0
            digital_readiness_score = min(98.5, max(10.0, digital_readiness_score))

            # MODULE M4: MÔ PHỎNG LAO ĐỘNG & VIỆC LÀM (Mô hình dịch chuyển NetJob từ Bài 9)
            # Tính toán lượng việc làm mới sinh ra đối chiếu lượng mất việc do tự động hóa AI
            jobs_created = int(x_AI * 0.45 * 12 + x_D * 0.35 * 15)
            jobs_displaced = int(12000 * 0.28 * (1.0 - (x_H / (x_H + 500))))
            net_jobs_flow = jobs_created - jobs_displaced

            # MODULE M5: ĐÁNH GIÁ RỦI RO CHIẾN LƯỢC (Tích hợp Cyber-Risk & Môi trường từ Bài 7, 10)
            cyber_risk = (x_D * 0.03 + x_AI * 0.05) * data.cyber_risk_weight
            environmental_impact = x_K * 0.04 - x_H * 0.01
            
            # Chỉ số rủi ro tích hợp (Integrated Risk Index - IRI)
            risk_index = (cyber_risk + environmental_impact) / 100.0
            risk_index = round(min(10.0, max(1.0, risk_index)), 2)

            # Gom nhóm cấu trúc dữ liệu đầu ra cho từng kịch bản
            results_summary[s_name] = {
                "gdp_growth": round(gdp_growth_rate, 1),
                "digital_readiness": round(digital_readiness_score, 1),
                "net_jobs": net_jobs_flow,
                "risk_index": risk_index,
                "allocation": {
                    "K": int(x_K), "D": int(x_D), "AI": int(x_AI), "H": int(x_H)
                }
            }

        return {
            "success": True,
            "national_budget_analyzed": B_total,
            "scenarios_data": results_summary
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))