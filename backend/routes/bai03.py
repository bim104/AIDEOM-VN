from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
import numpy as np

router = APIRouter(tags=["Bài 3"])

class PriorityParams(BaseModel):
    w_growth: float = 0.15; w_prod: float = 0.15; w_spillover: float = 0.20
    w_export: float = 0.15; w_employment: float = 0.10; w_ai: float = 0.20; w_risk: float = 0.15

@router.post("/api/bai3/calculate")
def calculate_priority(params: PriorityParams):
    # Dữ liệu 10 ngành theo đề bài
    data = [
        {"name": "Nông-Lâm-Thủy sản", "growth": 3.27, "prod": 103.4, "spill": 0.35, "exp": 40.5, "emp": 13.20, "ai": 15, "risk": 18},
        {"name": "CN chế biến chế tạo", "growth": 9.64, "prod": 241.2, "spill": 0.78, "exp": 290.9, "emp": 11.50, "ai": 55, "risk": 42},
        {"name": "Xây dựng", "growth": 7.45, "prod": 168.8, "spill": 0.42, "exp": 2.5, "emp": 4.80, "ai": 20, "risk": 25},
        {"name": "Khai khoáng", "growth": -1.20, "prod": 1290.5, "spill": 0.30, "exp": 8.2, "emp": 0.30, "ai": 30, "risk": 55},
        {"name": "Bán buôn-bán lẻ", "growth": 7.10, "prod": 145.3, "spill": 0.55, "exp": 5.5, "emp": 7.80, "ai": 48, "risk": 38},
        {"name": "Tài chính-Ngân hàng", "growth": 7.36, "prod": 1072.4, "spill": 0.85, "exp": 1.2, "emp": 0.55, "ai": 72, "risk": 52},
        {"name": "Logistics-Vận tải", "growth": 9.93, "prod": 321.4, "spill": 0.72, "exp": 3.1, "emp": 1.95, "ai": 42, "risk": 35},
        {"name": "CNTT-Truyền thông", "growth": 7.85, "prod": 713.8, "spill": 0.92, "exp": 178.0, "emp": 0.62, "ai": 88, "risk": 28},
        {"name": "Giáo dục-Đào tạo", "growth": 6.42, "prod": 205.7, "spill": 0.65, "exp": 0.0, "emp": 2.15, "ai": 38, "risk": 22},
        {"name": "Y tế", "growth": 6.85, "prod": 437.1, "spill": 0.60, "exp": 0.0, "emp": 0.75, "ai": 45, "risk": 18}
    ]
    df = pd.DataFrame(data)

    # Chuẩn hóa
    norm_df = df.iloc[:, 1:].copy()
    for col in norm_df.columns:
        if col == "risk":
            norm_df[col] = (norm_df[col].max() - norm_df[col]) / (norm_df[col].max() - norm_df[col].min())
        else:
            norm_df[col] = (norm_df[col] - norm_df[col].min()) / (norm_df[col].max() - norm_df[col].min())

    # Tính Priority với trọng số chuẩn hóa
    weights = np.array([params.w_growth, params.w_prod, params.w_spillover, params.w_export, params.w_employment, params.w_ai, params.w_risk])
    weights = weights / weights.sum()
    df["Priority"] = norm_df.values @ weights
    
    df_ranked = df[['name', 'Priority']].sort_values(by='Priority', ascending=False).reset_index(drop=True)
    df_ranked['rank'] = df_ranked.index + 1
    ranking_results = df_ranked.to_dict(orient='records')
    
    # Phân tích độ nhạy a6
    sensitivity = []
    for a6 in np.arange(0.05, 0.45, 0.05):
        w_temp = weights.copy()
        w_temp[5] = a6
        w_temp = w_temp / w_temp.sum()
        p_temp = norm_df.values @ w_temp
        df_tmp = df.copy()
        df_tmp["P"] = p_temp
        top3 = df_tmp.sort_values(by="P", ascending=False).head(3)['name'].tolist()
        sensitivity.append({"a6_weight": round(a6, 2), "top_1": top3[0], "top_2": top3[1], "top_3": top3[2]})

    norm_df_with_name = norm_df.copy()
    norm_df_with_name.insert(0, "name", df["name"])

    return {
        "success": True,
        "ranking_results": ranking_results,         
        "normalized_data": norm_df_with_name.to_dict(orient='records'), 
        "sensitivity_heatmap": sensitivity,         
        "comparison": [                             
            {
                "name": "Định hướng tăng trưởng", 
                "top1": "CNTT-Truyền thông", 
                "top2": "CN chế biến chế tạo", 
                "top3": "Tài chính-Ngân hàng",
                "desc": "Ưu tiên tăng trưởng, năng suất và xuất khẩu."
            },
            {
                "name": "Định hướng bao trùm", 
                "top1": "CN chế biến chế tạo", 
                "top2": "CNTT-Truyền thông", 
                "top3": "Tài chính-Ngân hàng",
                "desc": "Ưu tiên việc làm, lan tỏa và giảm rủi ro tự động hóa."
            }
        ],
        "allocation_chart": [{"factor": r['name'], "value": r['Priority']} for r in ranking_results]
    }