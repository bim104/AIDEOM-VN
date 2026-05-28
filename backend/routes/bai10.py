from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from scipy.optimize import linprog

# Sử dụng router nguyên bản không chứa tiền tố trùng lặp
router = APIRouter(tags=["Bài 10"])

class StochasticParams(BaseModel):
    budget_stage1: float = 65000.0  # Hạn mức giai đoạn 1
    budget_stage2: float = 15000.0  # Quỹ dự phòng giai đoạn 2

# Khai báo đường dẫn URL tường minh trùng khớp với Frontend fetch
@router.post("/api/bai10/optimize")
def optimize_stochastic_programming(params: StochasticParams):
    categories = ['I', 'D', 'AI', 'H']
    scenarios = ['s1', 's2', 's3', 's4']
    probabilities = np.array([0.30, 0.45, 0.20, 0.05])
    
    beta_1 = np.array([1.00, 1.10, 1.25, 0.95])
    beta_2 = np.array([
        [1.25, 1.35, 1.55, 1.05],  # s1
        [1.00, 1.10, 1.25, 0.95],  # s2
        [0.75, 0.85, 0.90, 1.00],  # s3
        [0.40, 0.50, 0.55, 1.10]   # s4
    ])

    # 20 biến số: x(4) + y_s1(4) + y_s2(4) + y_s3(4) + y_s4(4)
    c_target = np.zeros(20)
    c_target[0:4] = -beta_1
    
    for s_idx in range(4):
        p_s = probabilities[s_idx]
        c_target[4 + s_idx*4 : 4 + (s_idx+1)*4] = -p_s * beta_2[s_idx]

    A_ub = []
    b_ub = []

    # Ngân sách giai đoạn 1
    r1 = np.zeros(20)
    r1[0:4] = 1.0
    A_ub.append(r1)
    b_ub.append(params.budget_stage1)

    # Ngân sách giai đoạn 2 cho từng kịch bản
    for s_idx in range(4):
        r2 = np.zeros(20)
        r2[4 + s_idx*4 : 4 + (s_idx+1)*4] = 1.0
        A_ub.append(r2)
        b_ub.append(params.budget_stage2)

    # Ràng buộc trần công nghệ AI: y_AI^s <= 0.5 * x_H
    for s_idx in range(4):
        r3 = np.zeros(20)
        r3[3] = -0.5
        r3[4 + s_idx*4 + 2] = 1.0
        A_ub.append(r3)
        b_ub.append(0.0)

    res_sp = linprog(c_target, A_ub=np.array(A_ub), b_ub=np.array(b_ub), bounds=[(0, None)]*20, method='highs')
    val_sp = -res_sp.fun

    x_opt = res_sp.x[0:4]
    y_opt = res_sp.x[4:].reshape(4, 4)

    # Tính toán EVPI
    gdp_perfect_information = 0.0
    for s_idx in range(4):
        c_det = np.zeros(8)
        c_det[0:4] = -beta_1
        c_det[4:8] = -beta_2[s_idx]
        A_det = [
            [1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1],
            [0, 0, 0, -0.5, 0, 0, 1, 0]
        ]
        b_det = [params.budget_stage1, params.budget_stage2, 0.0]
        res_det = linprog(c_det, A_ub=np.array(A_det), b_ub=b_det, bounds=[(0, None)]*8, method='highs')
        gdp_perfect_information += probabilities[s_idx] * (-res_det.fun)

    evpi = gdp_perfect_information - val_sp

    # Tính toán VSS
    beta_2_avg = np.dot(probabilities, beta_2)
    c_ee = np.zeros(8)
    c_ee[0:4] = -beta_1
    c_ee[4:8] = -beta_2_avg
    res_ee = linprog(c_ee, A_ub=np.array(A_det), b_ub=b_det, bounds=[(0, None)]*8, method='highs')
    x_ee = res_ee.x[0:4]

    A_vss = []
    b_vss = []
    c_vss = np.zeros(16)
    gdp_fix_x = np.sum(beta_1 * x_ee)
    
    for s_idx in range(4):
        c_vss[s_idx*4 : (s_idx+1)*4] = -probabilities[s_idx] * beta_2[s_idx]
        r_b = np.zeros(16)
        r_b[s_idx*4 : (s_idx+1)*4] = 1.0
        A_vss.append(r_b)
        b_vss.append(params.budget_stage2)
        r_ai = np.zeros(16)
        r_ai[s_idx*4 + 2] = 1.0
        A_vss.append(r_ai)
        b_vss.append(0.5 * x_ee[3])

    res_vss = linprog(c_vss, A_ub=np.array(A_vss), b_ub=b_vss, bounds=[(0, None)]*16, method='highs')
    val_eev = gdp_fix_x - res_vss.fun
    vss = val_sp - val_eev

    return {
        "success": True,
        "expected_gdp_opt": round(val_sp, 1),
        "vss": round(max(0.0, vss), 1),
        "evpi": round(max(0.0, evpi), 1),
        "first_stage_allocation": {
            "I": round(x_opt[0], 1), "D": round(x_opt[1], 1), "AI": round(x_opt[2], 1), "H": round(x_opt[3], 1)
        },
        "second_stage_recourse": [
            {"scenario": "s1. Lạc quan", "I": round(y_opt[0, 0], 1), "D": round(y_opt[0, 1], 1), "AI": round(y_opt[0, 2], 1), "H": round(y_opt[0, 3], 1)},
            {"scenario": "s2. Cơ sở", "I": round(y_opt[1, 0], 1), "D": round(y_opt[1, 1], 1), "AI": round(y_opt[1, 2], 1), "H": round(y_opt[1, 3], 1)},
            {"scenario": "s3. Bi quan", "I": round(y_opt[2, 0], 1), "D": round(y_opt[2, 1], 1), "AI": round(y_opt[2, 2], 1), "H": round(y_opt[2, 3], 1)},
            {"scenario": "s4. Khủng hoảng", "I": round(y_opt[3, 0], 1), "D": round(y_opt[3, 1], 1), "AI": round(y_opt[3, 2], 1), "H": round(y_opt[3, 3], 1)}
        ]
    }