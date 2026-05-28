from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os

router = APIRouter(tags=["Bài 6"])

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "vietnam_regions_2024.csv")

class TOPSISParams(BaseModel):
    w_grdp: float = 0.15
    w_fdi: float = 0.10
    w_digital: float = 0.15
    w_ai: float = 0.15
    w_labor: float = 0.10
    w_rd: float = 0.15
    w_internet: float = 0.10
    w_gini: float = 0.10

@router.post("/api/bai06/topsis")
def calculate_topsis(params: TOPSISParams):
    if not os.path.exists(DATA_PATH):
        return {"success": False, "message": "Không tìm thấy tệp dữ liệu vị trí kinh tế vùng miền!"}
        
    df = pd.read_csv(DATA_PATH)
    raw_table = df.to_dict(orient="records")
    
    # Trích xuất ma trận dữ liệu 6 vùng x 8 tiêu chí
    cols = ['grdp_per_capita', 'fdi', 'digital_index', 'ai_readiness', 'labor_trained', 'rd_grdp', 'internet', 'gini']
    matrix = df[cols].values
    
    # 1. Chuẩn hóa vector
    norm_matrix = matrix / np.sqrt(np.sum(matrix**2, axis=0))
    
    # Cân bằng tổng trọng số về 1.0
    w_total = (params.w_grdp + params.w_fdi + params.w_digital + params.w_ai + 
               params.w_labor + params.w_rd + params.w_internet + params.w_gini)
    
    weights = np.array([
        params.w_grdp / w_total, params.w_fdi / w_total, params.w_digital / w_total, params.w_ai / w_total,
        params.w_labor / w_total, params.w_rd / w_total, params.w_internet / w_total, params.w_gini / w_total
    ])
    
    # 2. Tính ma trận nhân trọng số
    weighted_matrix = norm_matrix * weights
    
    # 3. Xác định Giải pháp lý tưởng dương (A+) và âm (A-)
    ideal_positive = np.zeros(8)
    ideal_negative = np.zeros(8)
    
    for j in range(8):
        if cols[j] == 'gini':
            # Chỉ số Gini: Càng thấp càng tốt
            ideal_positive[j] = np.min(weighted_matrix[:, j])
            ideal_negative[j] = np.max(weighted_matrix[:, j])
        else:
            # 7 chỉ số còn lại: Càng cao càng tốt
            ideal_positive[j] = np.max(weighted_matrix[:, j])
            ideal_negative[j] = np.min(weighted_matrix[:, j])
            
    # 4. Tính khoảng cách Euclide S+ và S-
    s_positive = np.sqrt(np.sum((weighted_matrix - ideal_positive)**2, axis=1))
    s_negative = np.sqrt(np.sum((weighted_matrix - ideal_negative)**2, axis=1))
    
    # 5. Tính Closeness C*
    c_star = s_negative / (s_positive + s_negative)
    
    df['Closeness'] = [round(float(v), 4) for v in c_star]
    df['S_Positive'] = [round(float(v), 4) for v in s_positive]
    df['S_Negative'] = [round(float(v), 4) for v in s_negative]
    
    df_ranked = df.sort_values(by='Closeness', ascending=False).reset_index(drop=True)
    df_ranked['rank'] = df_ranked.index + 1
    
    ranking_results = []
    for i in range(len(df_ranked)):
        ranking_results.append({
            "rank": int(df_ranked['rank'].iloc[i]),
            "region_name_vi": str(df_ranked['region_name_vi'].iloc[i]),
            "closeness": float(df_ranked['Closeness'].iloc[i]),
            "s_pos": float(df_ranked['S_Positive'].iloc[i]),
            "s_neg": float(df_ranked['S_Negative'].iloc[i])
        })
        
    return {
        "success": True,
        "raw_table": raw_table,
        "ranking_results": ranking_results
    }