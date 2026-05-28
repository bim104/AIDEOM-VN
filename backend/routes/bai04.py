from fastapi import APIRouter
from pydantic import BaseModel
from scipy.optimize import linprog
import numpy as np

router = APIRouter(tags=["Bài 4"])

# Nhận các tham số kịch bản động từ giao diện Frontend gửi lên
class SectorRegionLPParams(BaseModel):
    total_budget: float = 150.0  # Tổng ngân sách (nghìn tỷ)
    min_industry: float = 60.0   # Sàn tối thiểu cho Công nghiệp công nghệ cao
    min_north: float = 45.0      # Sàn tối thiểu phân bổ cho Vùng Bắc Bộ
    max_south_pct: float = 0.45  # Trần tỷ trọng tối đa cho Vùng Nam Bộ (45%)
    # Hệ số hiệu quả biên (đóng góp GDP trên 1 đơn vị vốn) của 9 ô ma trận
    c_11: float = 1.45  # Công nghiệp - Bắc Bộ
    c_12: float = 1.30  # Công nghiệp - Trung Bộ
    c_13: float = 1.50  # Công nghiệp - Nam Bộ
    c_21: float = 1.10  # Nông nghiệp - Bắc Bộ
    c_22: float = 1.05  # Nông nghiệp - Trung Bộ
    c_23: float = 1.15  # Nông nghiệp - Nam Bộ
    c_31: float = 1.25  # Dịch vụ - Bắc Bộ
    c_32: float = 1.20  # Dịch vụ - Trung Bộ
    c_33: float = 1.35  # Dịch vụ - Nam Bộ

@router.post("/api/bai04/optimize")
def optimize_sector_region(params: SectorRegionLPParams):
    # Biến quyết định vector x gồm 9 phần tử:
    # [x11, x12, x13, x21, x22, x23, x31, x32, x33]
    
    # Hàm mục tiêu: Tìm cực đại GDP tăng thêm -> Đảo dấu hệ số
    c = [
        -params.c_11, -params.c_12, -params.c_13,
        -params.c_21, -params.c_22, -params.c_23,
        -params.c_31, -params.c_32, -params.c_33
    ]
    
    # Thiết lập các ràng buộc bất đẳng thức A_ub * x <= b_ub
    A_ub = []
    b_ub = []
    
    # Ràng buộc 1: Tổng ngân sách đầu tư toàn quốc công lại <= total_budget
    # x11 + x12 + x13 + x21 + x22 + x23 + x31 + x32 + x33 <= total_budget
    A_ub.append([1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0])
    b_ub.append(params.total_budget)
    
    # Ràng buộc 2: Sàn tối thiểu cho Công nghiệp công nghệ cao >= min_industry
    # Đảo dấu thành: -x11 - x12 - x13 <= -min_industry
    A_ub.append([-1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
    b_ub.append(-params.min_industry)
    
    # Ràng buộc 3: Sàn tối thiểu cho Vùng Bắc Bộ >= min_north
    # Đảo dấu thành: -x11 - x21 - x31 <= -min_north
    A_ub.append([-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0])
    b_ub.append(-params.min_north)
    
    # Ràng buộc 4: Trần tỷ trọng tối đa cho Vùng Nam Bộ <= max_south_pct * tổng ngân sách thực tế sử dụng
    # Quy đổi tuyến tính: x13 + x23 + x33 <= max_south_pct * (x11 + ... + x33)
    # <=> -max_south_pct*x11 - max_south_pct*x12 + (1-max_south_pct)*x13 ... <= 0
    p = params.max_south_pct
    A_ub.append([
        -p, -p, 1.0 - p,
        -p, -p, 1.0 - p,
        -p, -p, 1.0 - p
    ])
    b_ub.append(0.0)
    
    # Điều kiện không âm cho 9 biến
    x_bounds = [(0, None)] * 9
    
    # Khởi chạy bộ giải solver HiGHS công nghiệp
    res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=x_bounds, method='highs')
    
    if not res.success:
        return {
            "success": False,
            "message": "Hệ ràng buộc ma trận bất khả thi! Hãy nới rộng Ngân sách tổng hoặc giảm bớt các mức sàn tối thiểu ngành/vùng."
        }
        
    x = res.x
    max_z = -res.fun
    
    # Thống kê phân bổ theo Ngành (Gom dòng)
    g_industry = float(x[0] + x[1] + x[2])
    g_agriculture = float(x[3] + x[4] + x[5])
    g_service = float(x[6] + x[7] + x[8])
    
    # Thống kê phân bổ theo Vùng (Gom cột)
    r_north = float(x[0] + x[3] + x[6])
    r_central = float(x[1] + x[4] + x[7])
    r_south = float(x[2] + x[5] + x[8])
    
    # Phân tích độ nhạy biên kịch bản: Thay đổi Ngân sách tổng B từ B, B+30, B+60
    sensitivity_curve = []
    for budget_step in [params.total_budget, params.total_budget + 30.0, params.total_budget + 60.0]:
        b_ub_step = b_ub.copy()
        b_ub_step[0] = budget_step
        res_step = linprog(c, A_ub=A_ub, b_ub=b_ub_step, bounds=x_bounds, method='highs')
        if res_step.success:
            sensitivity_curve.append({
                "budget": budget_step,
                "gdp_gain": round(-res_step.fun, 2)
            })

    return {
        "success": True,
        "max_gdp_gain": round(max_z, 2),
        "matrix_results": {
            "industry": {"north": round(x[0], 2), "central": round(x[1], 2), "south": round(x[2], 2), "total": round(g_industry, 2)},
            "agriculture": {"north": round(x[3], 2), "central": round(x[4], 2), "south": round(x[5], 2), "total": round(g_agriculture, 2)},
            "service": {"north": round(x[6], 2), "central": round(x[7], 2), "south": round(x[8], 2), "total": round(g_service, 2)},
            "region_totals": {"north": round(r_north, 2), "central": round(r_central, 2), "south": round(r_south, 2)}
        },
        "chart_sector_data": [
            {"name": "CN Công nghệ cao", "value": round(g_industry, 2)},
            {"name": "Nông nghiệp số", "value": round(g_agriculture, 2)},
            {"name": "Dịch vụ số", "value": round(g_service, 2)}
        ],
        "chart_region_data": [
            {"name": "Vùng Bắc Bộ", "value": round(r_north, 2)},
            {"name": "Vùng Trung Bộ", "value": round(r_central, 2)},
            {"name": "Vùng Nam Bộ", "value": round(r_south, 2)}
        ],
        "sensitivity_curve": sensitivity_curve
    }