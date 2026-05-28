import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Bai10() {
  const [inputs, setInputs] = useState({
    budget_stage1: 65000,
    budget_stage2: 15000
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [hasError, setHasError] = useState(false);

  const runStochasticOptimization = () => {
    setLoading(true);
    setHasError(false);
    setIsCalculated(false);
    setResData(null);

    fetch('http://localhost:8000/api/bai10/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })
    .then(res => {
      if (!res.ok) throw new Error("Cổng Backend Bài 10 không phản hồi");
      return res.json();
    })
    .then(data => {
      if (data && data.success) {
        setResData(data);
        setIsCalculated(true);
      } else {
        setIsCalculated(false);
        setHasError(true);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi liên thông API Bài 10:", err);
      setLoading(false);
      setHasError(true);
      setIsCalculated(false);
    });
  };

  // 💡 HÀM PHÒNG VỆ AN TOÀN: Ép kiểu dữ liệu số an toàn trước khi định dạng chuỗi hiển thị
  const safeFormat = (val) => {
    if (val === undefined || val === null || isNaN(val)) return "0";
    return val.toLocaleString();
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px' }}>
      
      {/* Tiêu đề phân hệ */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold' }}>BÀI 10 — QUY HOẠCH NGẪU NHIÊN DƯỚI BẤT ĐỊNH KINH TẾ TOÀN CẦU</h1>
      </div>

      {/* Cơ sở lý thuyết toán kinh tế */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}><b>Hệ hoạch định tối ưu phân tầng (Two-Stage Stochastic Optimization Framework)</b></div>
        <div style={{ fontSize: '16px', color: '#34d399', fontWeight: 'bold', fontFamily: 'monospace' }}>
          Min c'x + Tong [ p_s x Q(x, s) ] | Ràng buộc kỹ thuật: y_AI_s &lt;= 0.5 x x_H
        </div>
        <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '6px 0 0 0', lineHeight: '1.5' }}>
          Mô hình hóa chu trình phân bổ tài khóa công dưới tác động đa kịch bản (Scenario Tree) từ thị trường quốc tế. Quyết định Giai đoạn 1 (Here-and-now) khóa cứng dòng vốn mồi, Giai đoạn 2 (Recourse) linh hoạt giải ngân gói dự phòng điều chỉnh biến động.
        </p>
      </div>

      {/* Thiết lập tham số vĩ mô đầu vào */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #232936', paddingBottom: '10px' }}>🎛️ Thiết lập Quy mô Quỹ tài khóa dự phòng ngân sách</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Ngân sách Giai đoạn 1 cứng (tỷ VND)</label>
            <input type="number" value={inputs.budget_stage1} onChange={e => setInputs({...inputs, budget_stage1: parseFloat(e.target.value)||0})} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Ngân sách Dự phòng Giai đoạn 2 tối đa (tỷ VND)</label>
            <input type="number" value={inputs.budget_stage2} onChange={e => setInputs({...inputs, budget_stage2: parseFloat(e.target.value)||0})} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', marginTop: '4px' }} />
          </div>
        </div>
        <button onClick={runStochasticOptimization} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'block', width: '200px' }}>
          {loading ? '⏳ Đang giải Stochastic...' : '▶️ Chạy mô hình'}
        </button>
      </div>

      {hasError && (
        <div style={{ color: '#f43f5e', padding: '15px', backgroundColor: '#2d141a', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ Lỗi cấu trúc phản hồi từ mạng Backend. Hãy đảm bảo Backend bài 10 trả về đúng các trường dữ liệu số.
        </div>
      )}

      {!isCalculated ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#161a25', borderRadius: '8px', border: '1px dashed #232936', color: '#64748b' }}>
          💡 Vui lòng nhấp nút <b>"Chạy mô hình"</b> để kích hoạt bộ thuật toán Scenario Decomposition vĩ mô.
        </div>
      ) : (
        <>
          {/* Cụm Thẻ Chỉ số KPI đo lường VSS & EVPI */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#1e293b', borderLeft: '4px solid #38bdf8', padding: '20px', borderRadius: '8px' }}>
              <span style={{ color: '#aaa', fontSize: '12px' }}>Dự toán GDP Kỳ vọng tối ưu</span>
              <h2 style={{ fontSize: '26px', margin: '5px 0 0 0', fontWeight: 'bold', color: '#34d399' }}>
                {safeFormat(resData?.expected_gdp_opt)} tỷ
              </h2>
            </div>
            <div style={{ backgroundColor: '#1e293b', borderLeft: '4px solid #a855f7', padding: '20px', borderRadius: '8px' }}>
              <span style={{ color: '#aaa', fontSize: '12px' }}>Giá trị giải pháp ngẫu nhiên (VSS)</span>
              <h2 style={{ fontSize: '26px', margin: '5px 0 0 0', fontWeight: 'bold', color: '#ffbb28' }}>
                {safeFormat(resData?.vss)} tỷ
              </h2>
            </div>
            <div style={{ backgroundColor: '#1e293b', borderLeft: '4px solid #ef4444', padding: '20px', borderRadius: '8px' }}>
              <span style={{ color: '#aaa', fontSize: '12px' }}>Giá trị thông tin hoàn hảo (EVPI)</span>
              <h2 style={{ fontSize: '26px', margin: '5px 0 0 0', fontWeight: 'bold', color: '#f43f5e' }}>
                {safeFormat(resData?.evpi)} tỷ
              </h2>
            </div>
          </div>

          {/* Đồ thị trực quan hóa cơ cấu điều chỉnh dòng tiền */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#38bdf8' }}>📊 Đối chiếu dòng tiền ứng phó bổ sung Giai đoạn 2 theo từng Kịch bản</h4>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resData?.second_stage_recourse || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                  <XAxis dataKey="scenario" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="I" fill="#2563eb" name="Bổ sung Hạ tầng vật chất (I)" />
                  <Bar dataKey="D" fill="#38bdf8" name="Bổ sung Hạ tầng số (D)" />
                  <Bar dataKey="AI" fill="#34d399" name="Bổ sung Trí tuệ nhân tạo (AI)" />
                  <Bar dataKey="H" fill="#a855f7" name="Bổ sung Vốn nhân lực (H)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bảng phân bổ chi tiết kết quả tối ưu đầu ra */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', marginBottom: '25px' }}>
            
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#fff' }}>🎯 Quyết định khóa cứng Giai đoạn 1 (Here-and-Now)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', padding: '10px', backgroundColor: '#0e1117', borderRadius: '4px' }}>
                  <span style={{ color: '#aaa' }}>Hạ tầng vật chất (x_I):</span>
                  <span style={{ fontWeight: 'bold', color: '#2563eb', marginLeft: 'auto' }}>{safeFormat(resData?.first_stage_allocation?.I)} tỷ</span>
                </div>
                <div style={{ display: 'flex', padding: '10px', backgroundColor: '#0e1117', borderRadius: '4px' }}>
                  <span style={{ color: '#aaa' }}>Hạ tầng kỹ thuật số (x_D):</span>
                  <span style={{ fontWeight: 'bold', color: '#38bdf8', marginLeft: 'auto' }}>{safeFormat(resData?.first_stage_allocation?.D)} tỷ</span>
                </div>
                <div style={{ display: 'flex', padding: '10px', backgroundColor: '#0e1117', borderRadius: '4px' }}>
                  <span style={{ color: '#aaa' }}>Trí tuệ nhân tạo (x_AI):</span>
                  <span style={{ fontWeight: 'bold', color: '#34d399', marginLeft: 'auto' }}>{safeFormat(resData?.first_stage_allocation?.AI)} tỷ</span>
                </div>
                <div style={{ display: 'flex', padding: '10px', backgroundColor: '#0e1117', borderRadius: '4px' }}>
                  <span style={{ color: '#aaa' }}>Vốn nhân lực chất lượng (x_H):</span>
                  <span style={{ fontWeight: 'bold', color: '#a855f7', marginLeft: 'auto' }}>{safeFormat(resData?.first_stage_allocation?.H)} tỷ</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#fff' }}>📋 Bảng dữ liệu quỹ điều chỉnh Giai đoạn 2 (Recourse)</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'center' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Kịch bản vĩ mô</th>
                    <th style={{ padding: '8px' }}>y_I (tỷ)</th>
                    <th style={{ padding: '8px' }}>y_D (tỷ)</th>
                    <th style={{ padding: '8px' }}>y_AI (tỷ)</th>
                    <th style={{ padding: '8px' }}>y_H (tỷ)</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData?.second_stage_recourse || []).map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #232936' }}>
                      <td style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>{row.scenario}</td>
                      <td style={{ color: '#2563eb' }}>{row.I}</td>
                      <td style={{ color: '#38bdf8' }}>{row.D}</td>
                      <td style={{ color: '#34d399' }}>{row.AI}</td>
                      <td style={{ color: '#a855f7' }}>{row.H}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* 🏛️ KHỐI LUẬN CỨ CHÍNH SÁCH VĨ MÔ 10.6 CHI TIẾT THEO YÊU CẦU */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '4px solid #38bdf8', borderRadius: '8px', padding: '25px', marginTop: '25px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              🏛️ 10.6. Hệ thống Luận cứ & Thảo luận Định hướng Tối ưu hóa Ngẫu nhiên vĩ mô
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.7' }}>
              
              {/* Câu a */}
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#38bdf8', fontSize: '14px', fontWeight: 'bold' }}>
                  a) Xu hướng phân bổ vốn nhân lực (H) giữa lời giải ngẫu nhiên (SP) và lời giải xác định (Deterministic)
                </h5>
                <p style={{ margin: 0 }}>
                  • <b>Xu hướng đầu tư:</b> Lời giải quy hoạch ngẫu nhiên SP có xu hướng <b>đầu tư vào vốn nhân lực (H) nhiều hơn rõ rệt</b> so với lời giải xác định dựa trên kịch bản trung bình.<br />
                  • <b>Nguyên nhân kinh tế học:</b> Trong mô hình xác định, hệ thống thiên vị dồn toàn lực vào các hạng mục có tỷ suất sinh lợi biên cao tức thời (như AI, Hạ tầng số). Tuy nhiên, trong mô hình ngẫu nhiên SP, sự xuất hiện của ràng buộc trần năng lực công nghệ ở giai đoạn hai (y_AI_s &lt;= 0.5 * x_H) đã ép thuật toán phải nhìn xa hơn. Nếu Chính phủ không đầu tư vốn mồi cho con người ngay từ giai đoạn một (Here-and-now), thì khi tương lai mở ra kịch bản Lạc quan (s1), nền kinh tế sẽ bị rơi vào hiệu ứng <b>nghẽn năng lực hấp thụ (Absorptive Capacity)</b> — tức là có sẵn vốn dự phòng nhưng không thể giải ngân mua sắm thiết bị AI do thiếu hụt trầm trọng kỹ sư vận hành. Đầu tư sớm vào H đóng vai trò như một <b> quyền chọn chiến lược (Call Option)</b> mua sự linh hoạt cho tương lai.
                </p>
              </div>

              {/* Câu b */}
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#34d399', fontSize: '14px', fontWeight: 'bold' }}>
                  b) Ý nghĩa kinh tế của chỉ số VSS (Value of Stochastic Solution) mang giá trị dương
                </h5>
                <p style={{ margin: 0 }}>
                  • <b>Bản chất chỉ số:</b> Chỉ số VSS mang giá trị dương lớn chứng minh định lượng rằng <b>việc chủ động cân nhắc và nhúng yếu tố xác suất/bất định vào mô hình hoạch định chính sách đem lại phúc lợi xã hội lớn hơn hẳn tư duy kịch bản trung bình</b>.<br />
                  • <b>Hàm ý chính sách Việt Nam:</b> Kinh tế Việt Nam có độ mở thương mại lớn (~180% GDP). Nếu các nhà hoạch định chính sách điều hành quốc gia bằng "tư duy kịch bản trung bình cơ sở", chúng ta sẽ liên tục rơi vào trạng thái bị động: hoặc bị thiếu hụt nguồn lực trầm trọng khi thời cơ vàng (Lạc quan s1) bùng nổ, hoặc bị lãng phí, sập cấu trúc tài khóa do phân bổ quá đà khi khủng hoảng (s4) quét qua. VSS dương là lời khẳng định khoa học: tư duy quản trị rủi ro ngẫu nhiên phải là bộ công cụ bắt buộc trong kỷ nguyên số hóa nhiều biến động địa chính trị.
                </p>
              </div>

              {/* Câu c */}
              <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #232936' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#ff6b6b', fontSize: '14px', fontWeight: 'bold' }}>
                  c) Bài học vĩ mô từ Đại dịch COVID-19, Siêu bão Yagi & Khái niệm "Hàng hóa bảo hiểm" nhân lực số
                </h5>
                <p style={{ margin: 0 }}>
                  • <b>Bài học từ thực tiễn cú sốc:</b> Đại dịch COVID-19 (2020-2022) and siêu bão Yagi (2024) đã phá hủy cấu trúc hạ tầng vật chất hữu hình và làm đóng băng chuỗi cung ứng truyền thống. Nhưng trong chính tâm bão, những doanh nghiệp, cơ quan sở hữu lực lượng nhân sự có trình độ số cao đã thực hiện chuyển đổi trạng thái (Làm việc từ xa, tự động hóa quy trình, tái cấu trúc chuỗi cung ứng bằng AI) một cách ngoạn mục để hấp thụ cú sốc.<br />
                  • <b>Định vị lại chiến lược đầu tư:</b> Mô hình ngẫu nhiên Bài 10 đã chỉ ra một sự thật: Việt Nam từ trước đến nay đang có xu hướng <b>"dưới đầu tư" (Under-investment) vào nhân lực số</b>. Chúng ta thường coi chi phí cho giáo dục, đào tạo công nghệ chất lượng cao là một khoản chi tiêu tốn kém ngắn hạn, thay vì định vị nó là một loại <b>"Hàng hóa bảo hiểm quốc gia tối cao" (Sovereign Insurance Good)</b>. Dồn vốn mồi đầu tư mạnh cho con người chính là tấm khiên phòng vệ vững chắc nhất giúp nền kinh tế duy trì tính kiên cường (Resilience), sẵn sàng đứng vững và phục hồi thần tốc trước mọi biến động chưa biết trước của thời đại.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}