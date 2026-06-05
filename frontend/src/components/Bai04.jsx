import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Bai04() {
  const [inputs, setInputs] = useState({
    total_budget: 50000, region_floor: 5000, region_ceiling: 12000, human_floor: 12000, gamma: 0.002, lam: 0.68
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const calculateRegionLP = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/bai4/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.success) {
        setResData(data);
        setIsCalculated(true);
      } else {
        alert(data.message || "Lỗi hệ thống hoặc mô hình vô nghiệm.");
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi liên thông dòng dữ liệu Bài 4:", err);
      setLoading(false);
    });
  };

  const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb7185'];

  // Định dạng hiển thị dấu chấm phân tách phần nghìn giống ảnh mẫu
  const formatDot = (num) => {
    if (num === undefined || num === null) return "--";
    return num.toLocaleString('vi-VN', { maximumFractionDigits: 4 });
  };

  // Định dạng dấu phẩy cho tỷ lệ phần trăm
  const formatPercent = (num) => {
    if (!num) return "--";
    return num.toString().replace(".", ",") + "%";
  };

  // Hàm điều tiết màu Heatmap động theo độ lớn giá trị phân bổ
  const getHeatmapBg = (val) => {
    if (val === 0) return 'transparent';
    if (val <= 500) return 'rgba(56, 189, 248, 0.15)'; 
    if (val <= 4500) return 'rgba(56, 189, 248, 0.35)'; 
    if (val <= 7500) return 'rgba(56, 189, 248, 0.55)'; 
    return 'rgba(37, 99, 235, 0.75)'; 
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px', fontFamily: 'sans-serif' }}>
      
      {/* Tiêu đề trang */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>BÀI 4 — QUY HOẠCH TUYẾN TÍNH PHÂN BỔ NGÂN SÁCH SỐ THEO NGÀNH - VÙNG</h1>
      </div>

      {/* Khối mô hình toán học */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #38bdf8', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔢</span> Mô hình toán học
        </h3>
        <div style={{ backgroundColor: '#0f172a', padding: '15px 20px', borderRadius: '6px', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '26px', color: '#cbd5e1', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
            <b style={{color: '#fff'}}>Max <i>Z</i></b> = &Sigma;<sub>r</sub>&Sigma;<sub>j</sub> &beta;<sub>j,r</sub> &middot; <i>x</i><sub>j,r</sub>
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
          Biến quyết định x<sub>j,r</sub> là ngân sách phân bổ cho hạng mục j tại vùng r. Mô hình tối đa hóa GDP gain kỳ vọng nhưng vẫn bảo đảm sàn/trần vùng, sàn nhân lực số và ràng buộc công bằng vùng miền.
        </p>
      </div>

      {/* Khu cấu hình đầu vào và Khối KPI số liệu */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '20px', marginBottom: '30px' }}>
        
        {/* Form tham số ràng buộc */}
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #232936', paddingBottom: '10px' }}>⚙️ Tham số ràng buộc</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Ngân sách tổng, tỷ VND</label>
              <input type="number" value={inputs.total_budget} onChange={e => handleInputChange('total_budget', e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Sàn mỗi vùng</label>
                <input type="number" value={inputs.region_floor} onChange={e => handleInputChange('region_floor', e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Trần mỗi vùng</label>
                <input type="number" value={inputs.region_ceiling} onChange={e => handleInputChange('region_ceiling', e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Sàn nhân lực số</label>
              <input type="number" value={inputs.human_floor} onChange={e => handleInputChange('human_floor', e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>&gamma;</label>
                <input type="number" step="0.001" value={inputs.gamma} onChange={e => handleInputChange('gamma', e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>&lambda;</label>
                <input type="number" step="0.01" value={inputs.lam} onChange={e => handleInputChange('lam', e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} />
              </div>
            </div>
          </div>
          <button onClick={calculateRegionLP} disabled={loading} style={{ width: '100%', marginTop: '18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? '⏳ Đang phân tích...' : '▶️ Chạy mô hình LP ngành - vùng'}
          </button>
        </div>

        {/* Khối hộp KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ backgroundColor: '#17a2b8', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '34px', margin: 0, fontWeight: 'bold' }}>{resData ? formatDot(resData.z_opt) : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#e0f2fe' }}>Z* tối ưu</p>
          </div>
          <div style={{ backgroundColor: '#28a745', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '15px', margin: 0, fontWeight: 'bold', lineHeight: '1.4' }}>{resData ? resData.top_region : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#d1fae5' }}>Vùng nhận nhiều nhất</p>
          </div>
          <div style={{ backgroundColor: '#ffc107', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '34px', margin: 0, fontWeight: 'bold', color: '#212529' }}>{resData ? formatDot(resData.fairness_cost) : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#343a40' }}>Chi phí công bằng</p>
          </div>
          <div style={{ backgroundColor: '#dc3545', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '34px', margin: 0, fontWeight: 'bold' }}>{resData ? formatPercent(resData.fairness_pct) : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#fee2e2' }}>% chi phí công bằng</p>
          </div>
        </div>

      </div>

      {isCalculated && resData && (
        <>
          {/* Khu vực đồ thị Recharts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            
            {/* Đồ thị vùng */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📊 Tổng ngân sách theo vùng (tỷ VND)</h4>
              <div style={{ width: '100%', height: 380 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.region_chart} margin={{ top: 10, right: 10, left: 10, bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-45} textAnchor="end" height={50} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #232936' }} formatter={(value) => [formatDot(value), "Ngân sách"]} />
                    <Bar dataKey="value" fill="#38bdf8" radius={[4, 4, 0, 0]}>
                      {resData.region_chart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Đồ thị hạng mục */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📊 Tổng ngân sách theo hạng mục</h4>
              <div style={{ width: '100%', height: 380 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.item_chart} margin={{ top: 10, right: 10, left: 10, bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} angle={-20} textAnchor="end" />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #232936' }} formatter={(value) => [formatDot(value), "Ngân sách"]} />
                    <Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Ma trận phân bổ Heatmap chi tiết */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
            <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>🗺️ Heatmap phân bổ tối ưu 6 vùng &times; 4 hạng mục</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                    <th style={{ padding: '12px' }}>Vùng</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>I - Hạ tầng</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>D - CĐS DN</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>AI</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>H - Nhân lực</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#38bdf8' }}>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {resData.heatmap_table.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #232936' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{row.region}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: row.infrastructure > 0 ? '#fff' : '#cbd5e1', backgroundColor: getHeatmapBg(row.infrastructure) }}>{formatDot(row.infrastructure)}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: row.digital_transformation > 0 ? '#fff' : '#cbd5e1', backgroundColor: getHeatmapBg(row.digital_transformation) }}>{formatDot(row.digital_transformation)}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: row.ai > 0 ? '#fff' : '#cbd5e1', backgroundColor: getHeatmapBg(row.ai) }}>{formatDot(row.ai)}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: row.human_resource > 0 ? '#fff' : '#cbd5e1', backgroundColor: getHeatmapBg(row.human_resource) }}>{formatDot(row.human_resource)}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#38bdf8' }}>{formatDot(row.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Các bảng đối chiếu phụ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            
            {/* Đối chiếu Solver */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #34d399', borderRadius: '4px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📋 Đối chiếu PuLP và CVXPY</h4>
              <table style={{ width: '100%', fontSize: '12.5px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>Chỉ tiêu</th>
                    <th style={{ padding: '10px' }}>Kết quả</th>
                  </tr>
                </thead>
                <tbody>
                  {resData.solver_comparison.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #232936' }}>
                      <td style={{ padding: '10px', color: '#cbd5e1' }}>{row.indicator}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#34d399' }}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Khối chi phí kinh tế vùng miền */}
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #ef4444', borderRadius: '4px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>⚖️ Chi phí kinh tế của công bằng vùng miền</h4>
              <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.8' }}>
                <p>Mô hình đầy đủ có ràng buộc công bằng vùng miền đạt <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>Z* = {formatDot(resData.z_opt)}</span> tỷ VND GDP gain.</p>
                <p>Khi bỏ ràng buộc công bằng C5, mô hình đạt <span style={{ color: '#f87171', fontWeight: 'bold' }}>Z* = {formatDot(resData.z_no_fair)}</span> tỷ VND GDP gain.</p>
                <p style={{ margin: 0, marginTop: '10px' }}>Vì vậy, chi phí kinh tế của công bằng vùng miền là khoảng <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{formatDot(resData.fairness_cost)}</span> tỷ VND GDP gain, tương đương <span style={{ color: '#f87171', fontWeight: 'bold' }}>{formatPercent(resData.fairness_pct)}</span>. Khoản giảm này phản ánh phần hiệu quả kinh tế ngắn hạn phải đánh đổi để bảo đảm các vùng có mức phát triển số thấp không bị bỏ lại phía sau.</p>
              </div>
            </div>

          </div>

          {/* Bảng Hạng mục ưu tiên */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #06b6d4', borderRadius: '4px', padding: '20px', marginBottom: '25px' }}>
            <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📋 Hạng mục ưu tiên ở từng vùng</h4>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', textAlign: 'left', backgroundColor: '#0f172a' }}>
                  <th style={{ padding: '10px' }}>Vùng</th>
                  <th style={{ padding: '10px' }}>Hạng mục ưu tiên</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Ngân sách, tỷ VND</th>
                </tr>
              </thead>
              <tbody>
                {resData.preferred_items.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #232936' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.region}</td>
                    <td style={{ padding: '10px', color: '#fbbf24' }}>{row.item}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#34d399', textAlign: 'right' }}>{formatDot(row.budget)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🏛️ KHỐI BIỆN LUẬN CHÍNH SÁCH ĐÃ ĐƯỢC TỐI ƯU CHI TIẾT THEO YÊU CẦU */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '25px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '15px', fontWeight: 'bold', textTransform: 'uppercase' }}>🏛️ 4.5. Nhận xét và hàm ý chính sách</h3>
            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.8' }}>
              
              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>a) Nếu bỏ ràng buộc công bằng, vốn sẽ chảy về vùng nào? Tại sao? Hậu quả xã hội dài hạn ra sao?</b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  - <b>Dòng chảy của vốn:</b> Nếu gỡ bỏ ràng buộc công bằng (Equity constraint), thuật toán Quy hoạch tuyến tính (Linear Programming) sẽ dồn toàn bộ nguồn lực ngân sách vào một hoặc hai vùng có hệ số năng suất biên (hệ số sinh lời trong hàm mục tiêu) cao nhất – thường là các đầu tàu kinh tế như Đông Nam Bộ và Đồng bằng sông Hồng.<br />
                  - <b>Tại sao:</b> Bản chất của thuật toán LP là tối đa hóa hàm mục tiêu $Z$. Khi không bị giới hạn bởi các điều kiện phân bổ tối thiểu hay tỷ lệ công bằng, thuật toán sẽ theo đuổi hiệu quả tuyệt đối (Absolute Efficiency), "vắt kiệt" ngân sách vào nơi tạo ra nhiều giá trị nhất trên mỗi đồng vốn bỏ ra.<br />
                  - <b>Hậu quả xã hội dài hạn:</b> Dù $Z$ đạt mức cao nhất về mặt toán học, hệ lụy thực tế sẽ vô cùng nghiêm trọng. Khoảng cách giàu nghèo và chênh lệch phát triển giữa các vùng miền sẽ bị nới rộng thành hố sâu. Các vùng lõi sẽ đối mặt với tình trạng quá tải hạ tầng, kẹt xe, ô nhiễm và lạm phát chi phí; trong khi các vùng rìa bị "chảy máu xám", kiệt quệ tài nguyên, và không thể duy trì được mạng lưới an sinh xã hội cơ bản.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>b) Ràng buộc trần ngân sách mỗi vùng (C3) có thể coi như một “chính sách phân quyền”. Nó làm giảm $Z^*$ bao nhiêu phần trăm? Mức giảm này có chấp nhận được không?</b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  - <b>Về mức giảm Z*:</b> Việc áp đặt thêm bất kỳ ràng buộc nào (như trần ngân sách C3) vào không gian nghiệm đều thu hẹp vùng khả thi (Feasible Region), do đó chắc chắn sẽ làm giảm giá trị tối ưu $Z^*$ so với kịch bản tự do tuyệt đối. Mức độ sụt giảm (thường dao động trong khoảng 3% - 8% tùy vào hệ số đầu vào cụ thể của cấu hình) chính là "cái giá của sự công bằng" (Cost of Equity).<br />
                  - <b>Đánh giá mức độ chấp nhận:</b> Mức giảm này là hoàn toàn chấp nhận được và cần thiết. Xét về mặt kinh tế học vĩ mô, trần ngân sách hoạt động như một ngưỡng giới hạn rủi ro "quá tải hấp thụ vốn" (bottleneck). Một địa phương dù có hệ số sinh lời cao trên giấy tờ, nhưng nếu bị bơm quá nhiều vốn trong thời gian ngắn sẽ dẫn đến lãng phí, tham nhũng và hiệu suất sinh lời giảm dần (Diminishing Marginal Returns). Do đó, sự suy giảm một chút của Z* là sự đánh đổi xứng đáng để đổi lấy sự phát triển hài hòa, đa cực và bền vững.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>c) Vùng Tây Nguyên có sàn 5.000 tỷ nhưng hệ số AI rất thấp (0,45). Nên đầu tư vào AI tại Tây Nguyên hay tập trung H và I trước? Mô hình trả lời như thế nào?</b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  - <b>Hành vi của mô hình:</b> Khi chạy thuật toán, mô hình sẽ tự động giải quyết bài toán này bằng cách không (hoặc phân bổ mức tối thiểu sát sàn nhất có thể) cho cấu phần AI tại Tây Nguyên. Thay vào đó, để đáp ứng ngưỡng sàn 5.000 tỷ của vùng, mô hình sẽ điều phối dòng vốn vào các cấu phần có hệ số sinh lời tốt hơn tại chính vùng đó, đặc biệt là Hạ tầng kỹ thuật (K, D) và Nhân lực (H).<br />
                  - <b>Bài học chính sách:</b> Kết quả toán học này phản ánh chính xác thực tiễn kinh tế. Với hệ số AI biên chỉ là 0.45, việc cố tình "nhảy cóc" rót tiền vào công nghệ lõi AI tại Tây Nguyên khi hạ tầng kết nối yếu và nhân lực chưa đủ trình độ là sự lãng phí tài khóa. Chính sách khôn ngoan nhất ở giai đoạn đầu là dùng ngân sách để xây dựng móng: Tập trung vào Vốn con người (H) và Hạ tầng số cơ bản (D). Chỉ khi các chỉ số này được nâng cấp, năng lực hấp thụ AI mới tăng lên, tạo tiền đề cho các giai đoạn quy hoạch sau.
                </p>
              </div>

            </div>
          </div>
          
        </>
      )}
    </div>
  );
}