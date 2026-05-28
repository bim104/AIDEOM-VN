from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np

router = APIRouter(tags=["Bài 11"])

class QLearningParams(BaseModel):
    episodes: int = 10000
    alpha: float = 0.1
    gamma: float = 0.95

# -------------------------------------------------------------
# LỚP MÔI TRƯỜNG GIẢ LẬP KINH TẾ VIỆT NAM (Gymnasium Concept)
# -------------------------------------------------------------
class VietnamEconomyEnv:
    def __init__(self):
        self.action_space_size = 5
        self.T = 10
        self.allocation = {
            0: np.array([0.70, 0.10, 0.10, 0.10]),  # Truyền thống
            1: np.array([0.40, 0.25, 0.15, 0.20]),  # Cân bằng
            2: np.array([0.25, 0.45, 0.15, 0.15]),  # Số hóa nhanh
            3: np.array([0.20, 0.20, 0.45, 0.15]),  # AI dẫn dắt
            4: np.array([0.30, 0.20, 0.10, 0.40])   # Bao trùm
        }
        self.w = np.array([0.40, 0.25, 0.20, 0.15]) # Hệ số trọng số welfare

    def reset(self):
        self.t = 0
        # Tài sản cơ sở ban đầu kế thừa từ Bài 1
        self.K = 27500.0
        self.D = 20.3
        self.AI = 86.0
        self.H = 30.0
        return self._get_discrete_state()

    def _get_discrete_state(self):
        # Hàm rời rạc hóa trạng thái vĩ mô thành 3 mức (0: Thấp, 1: Trung bình, 2: Cao)
        gdp_level = 1 if self.K < 32000 else (2 if self.K >= 40000 else 1)
        d_level = 0 if self.D < 25 else (1 if self.D < 35 else 2)
        ai_level = 0 if self.AI < 150 else (1 if self.AI < 300 else 2)
        u_level = 1 if self.H > 35 else (0 if self.H >= 45 else 1) # H càng cao thất nghiệp càng thấp
        return (gdp_level, d_level, ai_level, u_level)

    def step(self, action):
        a = self.allocation[action]
        budget = 1500.0 # Ngân sách hàng năm (nghìn tỷ VND)
        
        # Phương trình chuyển đổi động học tài sản vĩ mô Cobb-Douglas
        old_Y = (self.K**0.33) * (54.0**0.42) * (self.D**0.10) * (self.AI**0.08) * (self.H**0.07)
        
        self.K += a[0] * budget
        self.D += (a[1] * budget) / 100.0
        self.AI += (a[2] * budget) / 20.0
        self.H += (a[3] * budget) / 200.0
        
        new_Y = (self.K**0.33) * (54.0**0.42) * (self.D**0.10) * (self.AI**0.08) * (self.H**0.07)
        
        # Tính toán biến động để quy đổi điểm thưởng Welfare
        delta_gdp = (new_Y - old_Y) / old_Y
        delta_unemploy = 0.05 - (self.H * 0.001)
        cyber_risk = 0.02 * self.D + 0.03 * self.AI
        emission = 0.04 * self.K - 0.01 * self.H
        
        # Hàm phần thưởng tổng hợp R_t
        reward = self.w[0]*delta_gdp*100 - self.w[1]*delta_unemploy*10 - self.w[2]*cyber_risk - self.w[3]*emission
        
        self.t += 1
        done = self.t >= self.T
        next_state = self._get_discrete_state()
        
        return next_state, float(reward), done

# -------------------------------------------------------------
# CHẠY CHIẾN LƯỢC RULE-BASED ĐỂ ĐỐI CHIẾU SỢI DÂY SO SÁNH
# -------------------------------------------------------------
def run_rule_based(env, strategy_type):
    state = env.reset()
    total_r = 0.0
    done = False
    while not done:
        if strategy_type == "a1_fixed":
            a = 1
        elif strategy_type == "a3_fixed":
            a = 3
        else:
            a = np.random.randint(0, 5) # Random
        state, r, done = env.step(a)
        total_r += r
    return total_r

@router.post("/api/bai11/train")
def train_reinforcement_learning(params: QLearningParams):
    env = VietnamEconomyEnv()
    
    # Khởi tạo ma trận Tabular Q-Table 5 chiều: Q[GDP, D, AI, U, Action]
    Q = np.zeros((3, 3, 3, 3, 5))
    learning_curve = []
    
    # 1. TIẾN TRÌNH HUẤN LUYỆN AGENT Q-LEARNING (10,000 EPISODES)
    for ep in range(params.episodes):
        s = env.reset()
        ep_reward = 0.0
        done = False
        
        # Chiến lược Epsilon Decay giảm dần từ 1.0 xuống 0.05
        eps = max(0.05, 1.0 - ep / (params.episodes * 0.6))
        
        while not done:
            if np.random.rand() < eps:
                a = np.random.randint(0, 5)
            else:
                a = int(np.argmax(Q[s]))
                
            next_s, r, done = env.step(a)
            ep_reward += r
            
            # Cập nhật phương trình Bellman đệ quy vi phân cho Q-Table
            old_q = Q[s][a]
            max_next_q = np.max(Q[next_s])
            Q[s][a] = old_q + params.alpha * (r + params.gamma * max_next_q - old_q)
            s = next_s
            
        # Gom nhóm 100 episodes lấy trung bình để đồ thị mượt mà
        if ep % 100 == 0:
            learning_curve.append({
                "episode": ep,
                "reward": round(float(ep_reward), 2)
            })

    # 2. ĐÁNH GIÁ ĐỐI CHIẾU CHÍNH SÁCH SAU HUẤN LUYỆN
    welfare_opt = run_rule_based(env, "optimal_q") # Sẽ chạy bằng argmax Q
    
    # Chạy chính sách tối ưu dựa trên Q-Table đã hội tụ
    s_test = env.reset()
    done = False
    q_welfare_total = 0.0
    while not done:
        a_opt = int(np.argmax(Q[s_test]))
        s_test, r, done = env.step(a_opt)
        q_welfare_total += r

    welfare_a1 = np.mean([run_rule_based(env, "a1_fixed") for _ in range(50)])
    welfare_a3 = np.mean([run_rule_based(env, "a3_fixed") for _ in range(50)])
    welfare_rand = np.mean([run_rule_based(env, "random") for _ in range(50)])

    # 3. TRÍCH XUẤT CHÍNH SÁCH CHO CÁC TRẠNG THÁI KHỞI ĐẦU KHÁC NHAU (Câu 11.3.3)
    action_mapping = {
        0: "a0: Truyền thống", 1: "a1: Cân bằng", 2: "a2: Số hóa nhanh",
        3: "a3: AI dẫn dắt", 4: "a4: Bao trùm"
    }
    
    # Trạng thái 1: Việt Nam 2026 thực tế [1, 1, 0, 1]
    act_vn_2026 = action_mapping[int(np.argmax(Q[(1, 1, 0, 1)]))]
    # Trạng thái 2: Khủng hoảng, suy thoái, thất nghiệp cao [0, 0, 0, 2] -> Kỳ vọng chọn Bao trùm (a4) hoặc Cân bằng (a1)
    act_crisis = action_mapping[int(np.argmax(Q[(0, 0, 0, 2)]))]
    # Trạng thái 3: Nền tảng số cực cao, sẵn bứt phá [2, 2, 1, 0] -> Kỳ vọng chọn AI dẫn dắt (a3)
    act_boom = action_mapping[int(np.argmax(Q[(2, 2, 1, 0)]))]

    return {
        "success": True,
        "learning_curve": learning_curve,
        "comparison": {
            "q_learning": round(q_welfare_total, 1),
            "rule_fixed_a1": round(welfare_a1, 1),
            "rule_fixed_a3": round(welfare_a3, 1),
            "rule_random": round(welfare_rand, 1)
        },
        "policy_report": {
            "vn_2026_actual": act_vn_2026,
            "crisis_state": act_crisis,
            "boom_state": act_boom
        }
    }