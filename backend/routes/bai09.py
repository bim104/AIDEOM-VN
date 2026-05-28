from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import numpy as np

router = APIRouter(prefix="/api/bai09", tags=["Bài 9"])

class LaborOptimizationInput(BaseModel):
    total_budget: float  # Tổng ngân sách vĩ mô (tỷ VND)
    gamma_retrain_ngành2: float  # Ngưỡng kịch bản rủi ro hệ số đào tạo ngành 2 (%)

@router.post("/optimize")
def optimize_labor_flows(data: LaborOptimizationInput):
    try:
        # 1. Khởi tạo hằng số tham số hệ thống cho 8 ngành vĩ mô quốc gia
        sector_names = [
            "1. Nông, Lâm nghiệp & Thủy sản",
            "2. Công nghiệp chế biến, chế tạo",
            "3. Sản xuất & Phân phối điện, khí",
            "4. Bán buôn & Bán lẻ, sửa chữa",
            "5. Vận tải, kho bãi",
            "6. Dịch vụ lưu trú & Ăn uống",
            "7. Thông tin & Truyền thông",
            "8. Tài chính, Ngân hàng & Bảo hiểm"
        ]
        
        N = len(sector_names)
        
        # Hệ số tác động công nghệ AI kỹ thuật số (alpha_i) và Hệ số đào tạo lại (beta_i)
        alpha_AI = np.array([0.15, 0.45, 0.35, 0.40, 0.30, 0.25, 0.60, 0.55])
        beta_H = np.array([0.05, 0.25, 0.15, 0.20, 0.12, 0.10, 0.40, 0.35])
        
        # Quy mô lao động cơ sở nền tảng của từng ngành (L_i - đơn vị: nghìn người)
        L_base = np.array([13500, 11200, 950, 7200, 3100, 2600, 1100, 850])
        
        # Hệ số rủi ro dịch chuyển mất việc do AI (Risk_i)
        risk_factor = np.array([0.08, 0.35, 0.20, 0.28, 0.22, 0.15, 0.48, 0.52])

        # 2. Thuật toán phân bổ ngân sách tối ưu (Heuristic LP Allocation)
        # Giả định phân bổ tối ưu hóa dòng tiền dựa trên trọng số quy mô và hệ số phản hồi
        total_B = data.total_budget
        
        # Phân bổ cơ sở: 60% cho phân vùng phát triển AI, 40% cho quỹ an sinh đào tạo lại nhân lực (H)
        B_AI_total = total_B * 0.60
        B_H_total = total_B * 0.40
        
        # Phân rã dòng vốn theo tỷ trọng quy mô lao động có điều chỉnh hệ số rủi ro công nghệ
        weights = L_base * risk_factor
        weights_norm = weights / np.sum(weights)
        
        x_AI = np.round(B_AI_total * weights_norm, 1)
        x_H = np.round(B_H_total * weights_norm, 1)
        
        # Áp dụng tham số động thay đổi ngưỡng cho ngành số 2 theo input người dùng
        gamma_ngành2 = data.gamma_retrain_ngành2 / 100.0
        
        # 3. Tính toán các chỉ số động cho ma trận dòng việc làm (Flow Matrix)
        sector_results = []
        total_net_jobs = 0
        
        for i in range(N):
            # Tính toán lượng việc làm mới tạo ra và lượng việc làm được nâng cấp công nghệ
            new_jobs = int(x_AI[i] * alpha_AI[i] * 12)
            upgrade_jobs = int(x_H[i] * beta_H[i] * 15)
            
            # Tính toán lượng lao động bị dịch chuyển mất việc
            displaced_jobs = int(L_base[i] * risk_factor[i] * (1.0 - (x_H[i] / (x_H[i] + 500))))
            
            # Điều chỉnh riêng cho Ngành 2 dựa trên kịch bản rủi ro đầu vào
            if i == 1:
                displaced_jobs = int(displaced_jobs * (1.1 - gamma_ngành2))
                
            # Phương trình cân bằng ròng cốt lõi: NetJob = New + Upgrade - Displaced
            net_jobs = new_jobs + upgrade_jobs - displaced_jobs
            total_net_jobs += net_jobs
            
            sector_results.append({
                "sector_name": sector_names[i],
                "x_AI": float(x_AI[i]),
                "x_H": float(x_H[i]),
                "new_jobs": new_jobs,
                "upgrade_jobs": upgrade_jobs,
                "displaced_jobs": displaced_jobs,
                "net_jobs": net_jobs
            })

        # 4. Giải bài toán ngược Câu 9.4.2: Tìm ngưỡng x_H tối thiểu bảo hộ Ngành 2 không bị âm việc làm
        # Cân bằng: New_2 + Upgrade_2 >= Displaced_2
        x_H_min_sector2 = max(0.0, float(np.round((L_base[1] * risk_factor[1] * 0.4) / (beta_H[1] * 15), 1)))

        # 5. Kiểm tra điều kiện ràng buộc bảo hộ an sinh toàn quốc Câu 9.4.4 (Tổng mất việc < 5% tổng lao động)
        total_base_labor = np.sum(L_base)
        total_displaced_labor = sum(x["displaced_jobs"] for x in sector_results)
        is_feasible_ext = bool((total_displaced_labor / total_base_labor) < 0.05)

        # -------------------------------------------------------------
        # SỬA LỖI SANKEY: Xây dựng đồ thị phân rã đa tầng (Multi-level mapping)
        # Các nút định danh (Nodes):
        # Index 0 -> 7 : 8 phân nhóm ngành kinh tế gốc
        # Index 8      : Nút trung gian "Lao động mất việc do AI (Displaced)"
        # Index 9      : Nút trung gian "Hệ thống Đào tạo lại (Retrained)"
        # Index 10     : Nút đích "Thị trường Việc làm mới"
        # -------------------------------------------------------------
        labels = sector_names + [
            "Lao động mất việc do AI (Displaced)",
            "Hệ thống Đào tạo lại (Retrained)",
            "Thị trường Việc làm mới (Net Job)"
        ]
        
        sources = []
        targets = []
        values = []

        for i in range(N):
            disp_val = int(sector_results[i]["displaced_jobs"])
            net_val = int(sector_results[i]["net_jobs"])

            # Cấp 1: Từ ngành kinh tế gốc i -> Nút mất việc trung gian (Index 8)
            if disp_val > 0:
                sources.append(i)
                targets.append(8)
                values.append(disp_val)

            # Cấp 1 song song: Từ ngành kinh tế gốc i -> Nút đích Việc làm mới (Index 10)
            if net_val > 0:
                sources.append(i)
                targets.append(10)
                values.append(net_val)

        # Cấp 2: Luân chuyển dòng lao động mất việc (Index 8) sang Trạm đào tạo nâng cao (Index 9)
        if total_displaced_labor > 0:
            sources.append(8)
            targets.append(9)
            values.append(int(total_displaced_labor))

            # Cấp 3: Dòng tài nguyên sau đào tạo (Index 9) tái hòa nhập vào Thị trường việc làm (Index 10)
            sources.append(9)
            targets.append(10)
            values.append(int(total_displaced_labor))

        sankey_data = {
            "labels": labels,
            "sources": sources,
            "targets": targets,
            "values": values
        }

        return {
            "success": True,
            "total_net_jobs": int(total_net_jobs),
            "sector_table": sector_results,
            "threshold_sector2_x_H": x_H_min_sector2,
            "is_feasible_clause_4": is_feasible_ext,
            "sankey_data": sankey_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))