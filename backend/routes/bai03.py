from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os

router = APIRouter(tags=["Bài 3"])

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "vietnam_sectors_2024.csv")

class PriorityParams(BaseModel):
    w_growth: float = 0.15
    w_prod: float = 0.15
    w_spillover: float = 0.20
    w_export: float = 0.15
    w_employment: float = 0.10
    w_ai: float = 0.20
    w_risk: float = 0.15

@router.post("/api/bai3/calculate")
def calculate_priority(params: PriorityParams):
    if not os.path.exists(DATA_PATH):
        return {"success": False, "message": "Không tìm thấy tệp dữ liệu vietnam_sectors_2024.csv!"}
        
    df = pd.read_csv(DATA_PATH)
    
    def norm_good(series):
        return (series - series.min()) / (series.max() - series.min()) if (series.max() - series.min()) != 0 else series
        
    def norm_bad(series):
        return (series.max() - series) / (series.max() - series.min()) if (series.max() - series.min()) != 0 else series

    raw_table = df.to_dict(orient="records")

    df_norm = pd.DataFrame()
    df_norm['growth'] = norm_good(df['growth_rate'])
    df_norm['prod'] = norm_good(df['productivity'])
    df_norm['spillover'] = norm_good(df['spillover'])
    df_norm['export'] = norm_good(df['export'])
    df_norm['employment'] = norm_good(df['employment'])
    df_norm['ai'] = norm_good(df['ai_readiness'])
    df_norm['risk'] = norm_bad(df['automation_risk'])

    w_total = (params.w_growth + params.w_prod + params.w_spillover + 
               params.w_export + params.w_employment + params.w_ai + params.w_risk)
    if w_total == 0: w_total = 1.0
    
    wg = params.w_growth / w_total
    wp = params.w_prod / w_total
    ws = params.w_spillover / w_total
    we = params.w_export / w_total
    wemp = params.w_employment / w_total
    wai = params.w_ai / w_total
    wri = params.w_risk / w_total

    priority_scores = (
        df_norm['growth'] * wg +
        df_norm['prod'] * wp +
        df_norm['spillover'] * ws +
        df_norm['export'] * we +
        df_norm['employment'] * wemp +
        df_norm['ai'] * wai +
        df_norm['risk'] * wri
    )
    
    df['Priority'] = round(priority_scores, 4)
    df_ranked = df.sort_values(by='Priority', ascending=False).reset_index(drop=True)
    df_ranked['rank'] = df_ranked.index + 1

    ranking_results = []
    for i in range(len(df_ranked)):
        ranking_results.append({
            "rank": int(df_ranked['rank'].iloc[i]),
            "sector_name_vi": str(df_ranked['sector_name_vi'].iloc[i]),
            "Priority": float(df_ranked['Priority'].iloc[i])
        })
    
    return {
        "success": True,
        "raw_table": raw_table,
        "ranking_results": ranking_results
    }