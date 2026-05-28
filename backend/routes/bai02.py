from fastapi import APIRouter
from pydantic import BaseModel
from scipy.optimize import linprog
import numpy as np

router = APIRouter(prefix="/api/bai2", tags=["Bài 2"])

class LPParams(BaseModel):
    total_budget: float = 100.0  
    min_x1: float = 25.0         
    min_x2: float = 15.0         
    min_x3: float = 20.0         
    min_x4: float = 10.0         
    c1: float = 0.85             
    c2: float = 1.20             
    c3: float = 0.95             
    c4: float = 1.35             
    strategic_ratio: float = 0.35 

@router.post("/optimize")
def optimize_budget(params: LPParams):
    # Tìm cực đại GDP tăng thêm thông qua đảo dấu hệ số hàm mục tiêu
    c = [-params.c1, -params.c2, -params.c3, -params.c4]
    
    # Ma trận ràng buộc bất đẳng thức A_ub * x <= b_ub
    # Dòng cuối tương đương: strategic_ratio*x1 - (1-strategic_ratio)*x2 + strategic_ratio*x3 - (1-strategic_ratio)*x4 <= 0
    A_ub = [
        [1.0, 1.0, 1.0, 1.0],
        [-1.0, 0.0, 0.0, 0.0],
        [0.0, -1.0, 0.0, 0.0],
        [0.0, 0.0, -1.0, 0.0],
        [0.0, 0.0, 0.0, -1.0],
        [params.strategic_ratio, params.strategic_ratio - 1.0, params.strategic_ratio, params.strategic_ratio - 1.0]
    ]
    
    b_ub = [
        params.total_budget,
        -params.min_x1,
        -params.min_x2,
        -params.min_x3,
        -params.min_x4,
        0.0
    ]
    
    x_bounds = [(0, None)] * 4
    
    # Giải quy hoạch tuyến tính bằng phương pháp highs
    res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=x_bounds, method='highs')
    
    if not res.success:
        return {"success": False, "message": "Bài toán không tìm được phương án tối ưu khả thi!"}
    
    x1, x2, x3, x4 = res.x
    max_z = -res.fun
    
    # Phân tích độ nhạy biến đổi Ngân sách tổng (B, B+20, B+40) để vẽ đồ thị
    sensitivity_data = []
    for budget_step in [params.total_budget, params.total_budget + 20.0, params.total_budget + 40.0]:
        b_ub_step = b_ub.copy()
        b_ub_step[0] = budget_step
        res_step = linprog(c, A_ub=A_ub, b_ub=b_ub_step, bounds=x_bounds, method='highs')
        if res_step.success:
            sensitivity_data.append({
                "budget": budget_step,
                "gdp_gain": round(-res_step.fun, 2)
            })
            
    # Tính toán xấp xỉ Giá đối ngẫu (Shadow Price) cho biên ngân sách
    b_ub_shadow = b_ub.copy()
    b_ub_shadow[0] = params.total_budget + 1.0
    res_shadow = linprog(c, A_ub=A_ub, b_ub=b_ub_shadow, bounds=x_bounds, method='highs')
    shadow_price_budget = (-res_shadow.fun - max_z) if res_shadow.success else 0.0
    
    return {
        "success": True,
        "max_gdp_gain": round(max_z, 2),
        "allocation": {
            "x1_infrastructure": round(x1, 2),
            "x2_ai_data": round(x2, 2),
            "x3_human_resources": round(x3, 2),
            "x4_rd_tech": round(x4, 2)
        },
        "shadow_price_budget": round(shadow_price_budget, 3),
        "sensitivity_curve": sensitivity_data
    }