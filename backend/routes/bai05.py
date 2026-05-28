from fastapi import APIRouter
from pydantic import BaseModel
from scipy.optimize import milp, Bounds, LinearConstraint
import numpy as np

router = APIRouter(tags=["Bài 5"])

# Nhận các tham số kịch bản động từ Frontend
class MIPParams(BaseModel):
    total_budget: float = 250.0  # Tổng ngân sách cấp cho 15 dự án (tỷ VND)
    min_impact_score: float = 50.0 # Yêu cầu tổng điểm tác động tối thiểu phải đạt

@router.post("/api/bai05/optimize")
def optimize_projects(params: MIPParams):
    # Định nghĩa dữ liệu tĩnh của 15 dự án số hóa (Chi phí đầu tư và Điểm tác động thu về)
    # Số liệu mô phỏng dựa trên danh mục đầu tư công nghệ thực tế
    costs = np.array([30, 45, 20, 50, 15, 60, 25, 40, 35, 10, 55, 30, 20, 45, 25], dtype=float)
    benefits = np.array([12, 18, 10, 22,  7, 28, 11, 15, 14,  4, 25, 13,  9, 17, 11], dtype=float)
    
    project_names = [
        "P01. Hạ tầng trục mạng 5G quốc gia", "P02. Trung tâm Dữ liệu lớn vĩ mô", 
        "P03. Hệ thống Định danh số công dân", "P04. Trục tích hợp dữ liệu liên thông LGSP",
        "P05. Cổng dịch vụ công trực tuyến quốc gia", "P06. Hệ thống siêu máy tính tính toán hiệu năng cao",
        "P07. Nền tảng Cloud Chính phủ điện tử", "P08. Trung tâm Đổi mới sáng tạo & AI Quốc gia",
        "P09. Hạ tầng IoT giám sát giao thông đô thị", "P10. Hệ thống cảnh báo thiên tai số",
        "P11. Nền tảng Số hóa hồ sơ Y tế quốc gia", "P12. Trục học liệu số giáo dục đại học",
        "P13. Nền tảng Blockchain truy xuất nguồn gốc nông sản", "P14. Hệ thống Giám sát an ninh mạng SOC",
        "P15. Nền tảng Thương mại điện tử nông thôn"
    ]

    num_projects = len(costs)
    
    # Hàm mục tiêu: Tối đa hóa lợi ích thu về -> Đảo dấu hệ số để milp tìm cực tiểu
    c = -benefits
    
    # 1. Ràng buộc giới hạn ngân sách tổng: ∑ (cost_i * x_i) <= total_budget
    # 2. Ràng buộc điều kiện loại trừ (Logic): Dự án P01 và P02 không được chọn cùng nhau: x_0 + x_1 <= 1
    # 3. Ràng buộc bổ trợ: Dự án P06 (Siêu máy tính) chỉ được chọn nếu đã chọn P02 (Trung tâm dữ liệu): x_5 <= x_1 <=> -x_1 + x_5 <= 0
    
    A = np.zeros((3, num_projects))
    A[0, :] = costs       # Dòng 1: Ngân sách
    A[1, 0] = 1.0; A[1, 1] = 1.0  # Dòng 2: Loại trừ P01 và P02
    A[2, 1] = -1.0; A[2, 5] = 1.0 # Dòng 3: Điều kiện phụ thuộc P06 vào P02
    
    # Ngưỡng chặn dưới và chặn trên cho các ràng buộc tuyến tính
    lb_constraints = np.array([-np.inf, -np.inf, -np.inf])
    ub_constraints = np.array([params.total_budget, 1.0, 0.0])
    
    constraints = LinearConstraint(A, lb_constraints, ub_constraints)
    
    # Ràng buộc biến nhị phân: Toàn bộ 15 biến thuộc tập {0, 1}
    integrality = np.ones(num_projects) # 1 đại diện cho biến nguyên/nhị phân
    bounds = Bounds(0, 1)
    
    # Kích hoạt bộ giải MIP
    res = milp(c=c, constraints=constraints, integrality=integrality, bounds=bounds)
    
    if not res.success:
        return {
            "success": False,
            "message": "Không tìm thấy phương án phân bổ khả thi! Hãy tăng thêm Ngân sách tổng để đáp ứng các ràng buộc phụ thuộc kỹ thuật."
        }
        
    x_optimal = np.round(res.x)
    max_benefit = -res.fun
    
    # Đóng gói danh sách dự án kèm trạng thái được chọn
    project_list_results = []
    total_spent_budget = 0.0
    
    for i in range(num_projects):
        status = int(x_optimal[i])
        if status == 1:
            total_spent_budget += costs[i]
            
        project_list_results.append({
            "id": f"P{str(i+1).zfill(2)}",
            "name": project_names[i],
            "cost": float(costs[i]),
            "benefit": float(benefits[i]),
            "status": "ĐƯỢC CHỌN" if status == 1 else "BỎ QUA",
            "statusCode": status
        })
        
    # Phân tích độ nhạy biên (Sensitivity Analysis) theo 3 hạn mức ngân sách: B, B+40, B+80
    sensitivity_data = []
    for budget_step in [params.total_budget, params.total_budget + 40.0, params.total_budget + 80.0]:
        ub_step = ub_constraints.copy()
        ub_step[0] = budget_step
        constraints_step = LinearConstraint(A, lb_constraints, ub_step)
        res_step = milp(c=c, constraints=constraints_step, integrality=integrality, bounds=bounds)
        if res_step.success:
            sensitivity_data.append({
                "budget": budget_step,
                "benefit": float(-res_step.fun)
            })

    return {
        "success": True,
        "max_benefit_score": round(max_benefit, 2),
        "total_spent": round(total_spent_budget, 2),
        "project_table": project_list_results,
        "sensitivity_curve": sensitivity_data
    }