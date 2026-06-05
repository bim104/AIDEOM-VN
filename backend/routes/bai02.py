from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from scipy.optimize import linprog
import numpy as np

router = APIRouter(tags=["Bài 2"])

class LPParams(BaseModel):
    total_budget: float = 100.0
    min_i: float = 25.0
    min_ai: float = 15.0
    min_h: float = 20.0
    min_rd: float = 10.0
    strategic_ratio: float = 0.35

@router.post("/api/bai2/calculate")
def calculate_lp(params: LPParams):
    try:
        c = [-0.85, -1.20, -0.95, -1.35]
        A_ub = [[1, 1, 1, 1], [0, -1, 0, -1]]
        
        def solve(b, min_i, min_ai, min_h, min_rd, strat):
            b_ub = [b, -strat * b]
            bounds = [(min_i, None), (min_ai, None), (min_h, None), (min_rd, None)]
            return linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=bounds, method='highs')

        # 1. Giải bài toán gốc
        res = solve(params.total_budget, params.min_i, params.min_ai, params.min_h, params.min_rd, params.strategic_ratio)
        
        if not res.success:
            return {"success": False, "status": "Vô nghiệm", "message": "Không tìm thấy phương án tối ưu."}
            
        z_opt = -res.fun
        x = res.x
        
        allocation_chart = [
            {"factor": "Hạ tầng (x₁)", "value": round(x[0], 2)},
            {"factor": "AI & Dữ liệu (x₂)", "value": round(x[1], 2)},
            {"factor": "Nhân lực (x₃)", "value": round(x[2], 2)},
            {"factor": "R&D (x₄)", "value": round(x[3], 2)}
        ]

        # 2. Tính Shadow Price (Nhiễu 1 đơn vị)
        def get_z(b, i, ai, h, rd, strat):
            r = solve(b, i, ai, h, rd, strat)
            return -r.fun if r.success else z_opt

        sp_budget = get_z(params.total_budget + 1, params.min_i, params.min_ai, params.min_h, params.min_rd, params.strategic_ratio) - z_opt
        sp_i = get_z(params.total_budget, params.min_i + 1, params.min_ai, params.min_h, params.min_rd, params.strategic_ratio) - z_opt
        sp_ai = get_z(params.total_budget, params.min_i, params.min_ai + 1, params.min_h, params.min_rd, params.strategic_ratio) - z_opt
        sp_h = get_z(params.total_budget, params.min_i, params.min_ai, params.min_h + 1, params.min_rd, params.strategic_ratio) - z_opt
        sp_rd = get_z(params.total_budget, params.min_i, params.min_ai, params.min_h, params.min_rd + 1, params.strategic_ratio) - z_opt

        # Tính Slack (Theo đúng công thức hiển thị trên ảnh)
        slack_budget = sum(x) - params.total_budget
        slack_i = params.min_i - x[0]
        slack_ai = params.min_ai - x[1]
        slack_h = params.min_h - x[2]
        slack_rd = params.min_rd - x[3]
        slack_strat = (params.strategic_ratio * params.total_budget) - (x[1] + x[3])
        
        shadow_table = [
            {"constraint": "Ngân sách tổng", "shadow_price": round(sp_budget, 2), "slack": round(slack_budget, 2)},
            {"constraint": "Hạ tầng số tối thiểu", "shadow_price": round(sp_i, 2), "slack": round(slack_i, 2)},
            {"constraint": "AI và dữ liệu tối thiểu", "shadow_price": round(sp_ai, 2), "slack": round(slack_ai, 2)},
            {"constraint": "Nhân lực số tối thiểu", "shadow_price": round(sp_h, 2), "slack": round(slack_h, 2)},
            {"constraint": "R&D tối thiểu", "shadow_price": round(sp_rd, 2), "slack": round(slack_rd, 2)},
            {"constraint": "Tỷ trọng công nghệ chiến lược", "shadow_price": 0, "slack": round(slack_strat, 2)}
        ]

        # 3. Kịch bản x3 >= 30
        res_scen = solve(params.total_budget, params.min_i, params.min_ai, 30.0, params.min_rd, params.strategic_ratio)
        z_scen = round(-res_scen.fun, 2) if res_scen.success else 0

        # Phân tích độ nhạy biên (Biểu đồ đường)
        sensitivity_chart = []
        for b in range(max(50, int(params.total_budget) - 20), int(params.total_budget) + 21, 10):
            r_s = solve(b, params.min_i, params.min_ai, params.min_h, params.min_rd, params.strategic_ratio)
            if r_s.success:
                sensitivity_chart.append({"budget": b, "z": round(-r_s.fun, 2)})

        return {
            "success": True,
            "status": "Tối ưu",
            "z_opt": round(z_opt, 2),
            "z_scen": z_scen,
            "allocation_chart": allocation_chart,
            "shadow_table": shadow_table,
            "sensitivity_chart": sensitivity_chart
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))