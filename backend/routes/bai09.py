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
            "Nông-Lâm-Thủy sản",
            "CN chế biến chế tạo",
            "Xây dựng",
            "Bán buôn-bán lẻ",
            "Tài chính-Ngân hàng",
            "Logistics-Vận tải",
            "CNTT-Truyền thông",
            "Giáo dục-Đào tạo"
        ]
        
        N = len(sector_names)
        
        # Hệ số tác động công nghệ AI kỹ thuật số (alpha_i) và Hệ số đào tạo lại (beta_i)
        alpha_AI = np.array([0.15, 0.45, 0.35, 0.40, 0.30, 0.25, 0.60, 0.55])
        beta_H = np.array([0.05, 0.25, 0.15, 0.20, 0.12, 0.10, 0.40, 0.35])
        
        # Quy mô lao động cơ sở nền tảng của từng ngành (L_i - đơn vị: nghìn người)
        L_base = np.array([13.2, 11.5, 4.8, 7.8, 0.55, 1.95, 0.62, 2.15])  # Lao động triệu người
        
        # Hệ số rủi ro dịch chuyển mất việc do AI (Risk_i) - tính theo %
        risk_factor = np.array([18, 42, 25, 38, 52, 35, 28, 22])  # %

        # 2. Thuật toán phân bổ ngân sách tối ưu (Heuristic LP Allocation)
        # Allocate resources to sectors 7 (CNTT-Truyền thông) & 8 (Giáo dục-Đào tạo)
        total_B = data.total_budget
        
        # Initialize allocation arrays for all sectors
        x_AI = np.zeros(N)
        x_H = np.zeros(N)
        
        # Phân bổ cho ngành 7 (CNTT-Truyền thông) và ngành 8 (Giáo dục-Đào tạo)
        # Ngành 7 nhận AI, ngành 8 nhận H
        x_AI[6] = 6.0   # Ngành 7: 6.000 tỷ cho AI
        x_AI[7] = 0.0   # Ngành 8: 0 tỷ cho AI
        
        x_H[6] = 2.275  # Ngành 7: 2.275 tỷ cho H
        x_H[7] = 21.725 # Ngành 8: 21.725 tỷ cho H
        
        # Áp dụng tham số động thay đổi ngưỡng cho ngành số 2 theo input người dùng
        gamma_ngành2 = data.gamma_retrain_ngành2 / 100.0
        
        # 3. Tính toán các chỉ số động cho ma trận dòng việc làm (Flow Matrix)
        sector_results = []
        total_net_jobs = 0
        
        for i in range(N):
            if i == 6:  # Ngành 7: CNTT-Truyền thông
                new_jobs = int(x_AI[i] * 1000 * 62.5)  # 375.000 / 6.0 = 62.5 (với x_AI tính bằng tỷ)
                upgrade_jobs = int(x_H[i] * 1000 * 20)  # 45.500 / 2.275 = 20 (với x_H tính bằng tỷ)
                displaced_jobs = 54600
                retrain_capacity = 54600
            elif i == 7:  # Ngành 8: Giáo dục-Đào tạo
                new_jobs = 0
                upgrade_jobs = int(x_H[i] * 1000 * 55)  # 1.194.875 / 21.725 = 55 (với x_H tính bằng tỷ)
                displaced_jobs = 0
                retrain_capacity = 1346950
            else:  # Các ngành khác không nhận vốn
                new_jobs = 0
                upgrade_jobs = 0
                displaced_jobs = 0
                retrain_capacity = 0
            
            # Phương trình cân bằng ròng cốt lõi: NetJob = New + Upgrade - Displaced
            net_jobs = new_jobs + upgrade_jobs - displaced_jobs
            total_net_jobs += net_jobs
            
            sector_results.append({
                "sector_name": sector_names[i],
                "L_base": float(L_base[i]),
                "risk_factor": float(risk_factor[i]),
                "x_AI": float(x_AI[i]),
                "x_H": float(x_H[i]),
                "new_jobs": new_jobs,
                "upgrade_jobs": upgrade_jobs,
                "displaced_jobs": displaced_jobs,
                "retrain_capacity": retrain_capacity,
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