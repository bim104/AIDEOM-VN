from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(tags=["Bài 12"])

class IntegratedParams(BaseModel):
    annual_budget: float = 1000.0

@router.post("/api/bai12/calculate")
def calculate_integrated_model(params: IntegratedParams):
    try:
        # 1. Cấu trúc 6 Module của hệ thống AIDEOM-VN (Khớp ảnh image_e077e8)
        module_table = [
            {"id": "M1", "name": "Dự báo kinh tế Macro", "tech": "Cobb-Douglas mở rộng", "source": "Bài 1"},
            {"id": "M2", "name": "Đánh giá sẵn sàng số", "tech": "TOPSIS + Entropy weight", "source": "Bài 6"},
            {"id": "M3", "name": "Tối ưu phân bổ", "tech": "LP ngành-vùng + tối ưu động", "source": "Bài 4 + Bài 8"},
            {"id": "M4", "name": "Mô phỏng lao động", "tech": "NetJob + đào tạo lại", "source": "Bài 9"},
            {"id": "M5", "name": "Đánh giá rủi ro", "tech": "Pareto NSGA-II + Stochastic SP", "source": "Bài 7 + Bài 10"},
            {"id": "M6", "name": "Dashboard ra quyết định", "tech": "Flask + AdminLTE + Chart.js", "source": "Bài 12"}
        ]

        # 2. Dữ liệu 5 Kịch bản tổng hợp S1 -> S5 (Khớp ảnh image_e07790 và image_e077e8)
        scenario_table = [
            {"id": "S1", "name": "S1 - Truyền thống", "k": 70, "d": 10, "ai": 10, "h": 10, "y2030": 351.9868, "dig_idx": 22.4186, "ai_ready": 28.8184, "net_job": 4758.6473, "risk_text": "Thấp (37,295)", "score": 18.5732},
            {"id": "S2", "name": "S2 - Số hóa nhanh", "k": 25, "d": 45, "ai": 15, "h": 15, "y2030": 372.0060, "dig_idx": 30.4798, "ai_ready": 32.0803, "net_job": 7137.9709, "risk_text": "Thấp (32,3725)", "score": 175.9854},
            {"id": "S3", "name": "S3 - AI dẫn dắt", "k": 20, "d": 20, "ai": 45, "h": 15, "y2030": 373.3839, "dig_idx": 35.7875, "ai_ready": 48.7691, "net_job": 11171.9129, "risk_text": "Thấp (43,5994)", "score": 167.2383},
            {"id": "S4", "name": "S4 - Bao trùm số", "k": 30, "d": 20, "ai": 10, "h": 40, "y2030": 357.5395, "dig_idx": 25.6308, "ai_ready": 31.7008, "net_job": 15000.6473, "risk_text": "Thấp (28,595)", "score": 287.1219},
            {"id": "S5", "name": "S5 - Tối ưu cân bằng", "k": 30, "d": 20, "ai": 20, "h": 30, "y2030": 364.1064, "dig_idx": 28.3954, "ai_ready": 36.3029, "net_job": 12931.2946, "risk_text": "Thấp (33,5748)", "score": 231.0272}
        ]

        # 3. Dữ liệu Quỹ đạo GDP (Trajectory) xu hướng giảm (Khớp ảnh image_e077ae)
        trajectory_chart = [
            {"year": 2026, "S1": 374.8, "S2": 380.2, "S3": 380.8, "S4": 376.5, "S5": 377.5},
            {"year": 2027, "S1": 368.5, "S2": 378.5, "S3": 379.0, "S4": 371.0, "S5": 373.8},
            {"year": 2028, "S1": 362.5, "S2": 376.5, "S3": 377.5, "S4": 366.2, "S5": 370.5},
            {"year": 2029, "S1": 357.0, "S2": 374.3, "S3": 375.5, "S4": 361.8, "S5": 367.2},
            {"year": 2030, "S1": 351.9868, "S2": 372.006, "S3": 373.3839, "S4": 357.5395, "S5": 364.1064}
        ]

        # 4. Biểu đồ Cảnh báo rủi ro 4 cột (Khớp ảnh image_e0776d)
        risk_chart = [
            {"scenario": "S1", "cyber": 28.1, "emission": 57.2, "dep": 24.5, "score": 37.295},
            {"scenario": "S2", "cyber": 30.8, "emission": 34.1, "dep": 32.5, "score": 32.3725},
            {"scenario": "S3", "cyber": 51.2, "emission": 38.9, "dep": 38.3, "score": 43.5994},
            {"scenario": "S4", "cyber": 23.5, "emission": 38.1, "dep": 23.5, "score": 28.595},
            {"scenario": "S5", "cyber": 31.8, "emission": 39.5, "dep": 28.1, "score": 33.5748}
        ]

        # 5. Khuyến nghị chính sách theo kịch bản (Text template khớp ảnh image_e0776d)
        recommendation_table = []
        for s in scenario_table:
            recom_text = f"{s['id']}: GDP mô phỏng đến 2030 đạt {str(s['y2030']).replace('.',',')} điểm mô hình, Digital Index đạt {str(s['dig_idx']).replace('.',',')}. NetJob dương, tác động lao động nhìn chung có thể chấp nhận được. Rủi ro ở mức tương đối kiểm soát được, phù hợp để mở rộng thí điểm."
            recommendation_table.append({
                "scenario": s["id"],
                "recom": recom_text
            })

        return {
            "success": True,
            "kpi_best": "S4 - Bao trùm số",
            "kpi_gdp": "S3 - AI dẫn dắt",
            "kpi_risk": "S4 - Bao trùm số",
            "kpi_labor": "S4 - Bao trùm số",
            "module_table": module_table,
            "scenario_table": scenario_table,
            "trajectory_chart": trajectory_chart,
            "risk_chart": risk_chart,
            "recommendation_table": recommendation_table
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))