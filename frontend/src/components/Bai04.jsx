import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Bai04() {
  const [inputs, setInputs] = useState({
    total_budget: 150, min_industry: 60, min_north: 45, max_south_pct: 0.45,
    c_11: 1.45, c_12: 1.30, c_13: 1.50,
    c_21: 1.10, c_22: 1.05, c_23: 1.15,
    c_31: 1.25, c_32: 1.20, c_33: 1.35
  });

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [hasError, setHasError] = useState(false);

  const runMatrixOptimization = () => {
    setLoading(true);
    setHasError(false);
    
    // 💡 BƯỚC KHẮC PHỤC CHÍ MẠNG: Hạ cờ trạng thái xuống false ngay lập tức 
    // để ép React ẩn các đồ thị đi, bảo vệ hệ thống không bị crash khi resData tạm thời bị rỗng.
    setIsCalculated(false); 
    setResData(null);

    // Ép kiểu float an toàn cho tất cả các ô tham số đầu vào ma trận
    const sanitized = {};
    Object.keys(inputs).forEach(key => {
      sanitized[key] = parseFloat(inputs[key]) || 0;
    });

    fetch('http://localhost:8000/api/bai04/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized)
    })
    .then(res => {
      if (!res.ok) throw new Error("Backend sập cổng");
      return res.json();
    })
    .then(data => {
      if (data && data.success) {
        setResData(data);
        setIsCalculated(true); 
      } else {
        setResData(data);
        setIsCalculated(false);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi API Bài 4:", err);
      setLoading(false);
      setHasError(true);
      setIsCalculated(false);
    });
  };

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px' }}>
      
      {/* Tiêu đề */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', fontWeight: 'bold' }}>BÀI 4 — PHÂN BỔ NGÂN SÁCH ĐẦU TƯ SỐ THEO NGÀNH VÀ VÙNG MIỀN MA TRẬN CHÉO</h1>
        
      </div>

      {/* Tóm tắt lý thuyết toán */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}><b>Bài toán Tối ưu hóa ma trận cấu trúc (Linear Programming Grid)</b></div>
        <div style={{ fontSize: '16px', color: '#34d399', fontWeight: 'bold' }}>
          {"Max Z = ∑ (c_ij × x_ij) với i ∈ {Ngành}, j ∈ {Vùng kinh tế}"}
        </div>
        <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '6px 0 0 0', lineHeight: '1.5' }}>
          Mô hình ràng buộc kép: Tổng ngân sách toàn quốc sử dụng ≤ B. Bảo đảm an ninh công nghiệp (Tổng dòng vốn ngành Công nghiệp đạt sàn tối thiểu) và công bằng phát triển địa phương (Vùng Bắc Bộ đạt mức sàn tối thiểu, đồng thời khống chế trần tỷ trọng vốn vùng Nam Bộ không vượt ngưỡng nóng gây lệch pha kinh tế).
        </p>
      </div>

      {/* Form cấu hình đầu vào */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8', borderBottom: '1px solid #232936', paddingBottom: '10px' }}>🎛️ Thiết lập giới hạn kịch bản vĩ mô</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Ngân sách tổng (B)</label>
            <input type="number" value={inputs.total_budget} onChange={e => handleInputChange('total_budget', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box', marginTop: '5px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Sàn vốn Công nghiệp</label>
            <input type="number" value={inputs.min_industry} onChange={e => handleInputChange('min_industry', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box', marginTop: '5px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Sàn vốn Vùng Bắc Bộ</label>
            <input type="number" value={inputs.min_north} onChange={e => handleInputChange('min_north', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box', marginTop: '5px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#aaa' }}>Trần tỷ trọng Nam Bộ (0-1)</label>
            <input type="number" step="0.01" value={inputs.max_south_pct} onChange={e => handleInputChange('max_south_pct', e.target.value)} style={{ width: '100%', backgroundColor: '#0e1117', color: '#fff', border: '1px solid #232936', padding: '8px', borderRadius: '4px', boxSizing: 'border-box', marginTop: '5px' }} />
          </div>
        </div>

        <button onClick={runMatrixOptimization} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'block', width: '200px' }}>
          {loading ? '⏳ Đang phân tích...' : '▶️ Chạy mô hình'}
        </button>
      </div>

      {hasError && (
        <div style={{ color: '#f43f5e', padding: '15px', backgroundColor: '#2d141a', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ Không thể nhận diện phản hồi từ Backend. Vui lòng dọn sạch cache Docker Compose.
        </div>
      )}

      {resData && resData.success === false && (
        <div style={{ color: '#f43f5e', padding: '20px', backgroundColor: '#2d141a', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}>
          ⚠️ {resData.message}
        </div>
      )}

      {/* Điều kiện chỉ xuất hiện khi kích nút */}
      {!isCalculated ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#161a25', borderRadius: '8px', border: '1px dashed #232936', color: '#64748b' }}>
          💡 Vui lòng cấu hình ma trận ràng buộc liên ngành - liên vùng và nhấp nút <b>"Chạy mô hình"</b> để hiển thị kết quả.
        </div>
      ) : (
        <>
          {/* Thẻ KPI đỉnh GDP gain thu về */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#2a9d8f', padding: '25px', borderRadius: '8px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '42px', margin: 0, fontWeight: 'bold' }}>{resData?.max_gdp_gain?.toLocaleString()} Nghìn tỷ</h2>
              <p style={{ margin: '8px 0 0 0', color: '#e6f4f1', fontSize: '14px' }}>Tổng lượng giá trị GDP gia tăng tối ưu toàn cục (Z*)</p>
            </div>
          </div>

          {/* Ma trận bảng kết quả chéo */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px', overflowX: 'auto' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#38bdf8' }}>📊 Ma trận phân bổ vốn tối ưu liên ngành - liên vùng (Đơn vị: Nghìn tỷ VND)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'center' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Phân nhóm Chiến lược</th>
                  <th style={{ padding: '12px' }}>Vùng Bắc Bộ</th>
                  <th style={{ padding: '12px' }}>Vùng Trung Bộ</th>
                  <th style={{ padding: '12px' }}>Vùng Nam Bộ</th>
                  <th style={{ padding: '12px', backgroundColor: '#1e293b', color: '#fff' }}>Tổng theo Ngành</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #232936' }}>
                  <td style={{ padding: '14px', textAlign: 'left', fontWeight: 'bold' }}>Công nghiệp công nghệ cao</td>
                  <td style={{ color: '#38bdf8' }}>{resData.matrix_results.industry.north}</td>
                  <td style={{ color: '#38bdf8' }}>{resData.matrix_results.industry.central}</td>
                  <td style={{ color: '#38bdf8' }}>{resData.matrix_results.industry.south}</td>
                  <td style={{ fontWeight: 'bold', backgroundColor: '#1e293b', color: '#34d399' }}>{resData.matrix_results.industry.total}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #232936' }}>
                  <td style={{ padding: '14px', textAlign: 'left', fontWeight: 'bold' }}>Nông nghiệp số</td>
                  <td style={{ color: '#38bdf8' }}>{resData.matrix_results.agriculture.north}</td>
                  <td style={{ color: '#38bdf8' }}>{resData.matrix_results.agriculture.central}</td>
                  <td style={{ color: '#38bdf8' }}>{resData.matrix_results.agriculture.south}</td>
                  <td style={{ fontWeight: 'bold', backgroundColor: '#1e293b', color: '#34d399' }}>{resData.matrix_results.agriculture.total}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #232936' }}>
                  <td style={{ padding: '14px', textAlign: 'left', fontWeight: 'bold' }}>Dịch vụ số thương mại</td>
                  <td style={{ color: '#38bdf8' }}>{resData.matrix_results.service.north}</td>
                  <td style={{ color: '#38bdf8' }}>{resData.matrix_results.service.central}</td>
                  <td style={{ color: '#38bdf8' }}>{resData.matrix_results.service.south}</td>
                  <td style={{ fontWeight: 'bold', backgroundColor: '#1e293b', color: '#34d399' }}>{resData.matrix_results.service.total}</td>
                </tr>
                <tr style={{ fontWeight: 'bold', backgroundColor: '#1e293b' }}>
                  <td style={{ padding: '14px', textAlign: 'left', color: '#fff' }}>Tổng theo Vùng địa phương</td>
                  <td style={{ color: '#ffbb28' }}>{resData.matrix_results.region_totals.north}</td>
                  <td style={{ color: '#ffbb28' }}>{resData.matrix_results.region_totals.central}</td>
                  <td style={{ color: '#ffbb28' }}>{resData.matrix_results.region_totals.south}</td>
                  <td style={{ backgroundColor: '#ff4b4b', color: '#fff' }}>{inputs.total_budget}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Đồ thị trực quan hóa cơ cấu */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>📊 Phân bổ dòng vốn đầu tư theo cấu trúc Ngành</h4>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.chart_sector_data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" unit="T" />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]} name="Vốn phân bổ" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>📈 Phân tích độ nhạy biên: Tăng trưởng phúc lợi Z*(B)</h4>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <LineChart data={resData.sensitivity_curve}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                    <XAxis dataKey="budget" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Line type="monotone" dataKey="gdp_gain" stroke="#ffb703" strokeWidth={3} dot={{ fill: '#ffb703', r: 5 }} name="GDP Gain tối ưu" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Khối nhận xét chính sách */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '4px solid #2a9d8f', borderRadius: '8px', padding: '25px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff' }}>💡 Diễn giải & Hàm ý chính sách Regional Economics</h3>
            <div style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.7' }}>
              <p><b>1. Bản chất phân bổ dòng vốn tối ưu ma trận:</b><br />
              Thuật toán quy hoạch tuyến tính đa biến đã giải bài toán bằng cách ưu tiên dồn tối đa lượng vốn công nghệ dư thừa đổ về ô ma trận có hệ số sinh lợi biên cao nhất là <b>Công nghiệp công nghệ cao tại Vùng Nam Bộ ($c_{13} = 1.50$)</b> và <b>Vùng Bắc Bộ ($c_{11} = 1.45$)</b>. Việc này hoàn toàn đồng điệu với thực tiễn phân bổ kinh tế: Nam Bộ và Bắc Bộ đóng vai trò hai đầu tàu công nghệ dẫn dắt, thu hút hạ tầng và startup cực lớn.</p>
              
              <p style={{ marginTop: '15px' }}><b>2. Cân bằng không gian phát triển địa phương:</b><br />
              Để ngăn chặn kịch bản nền kinh tế rơi vào bẫy "phát triển lệch pha cực đoan" (vốn chỉ chảy về hai đầu tàu, làm kiệt quệ dòng vốn ở miền Trung), ràng buộc sàn tối thiểu vùng Bắc Bộ (45 nghìn tỷ) và ràng buộc trần khống chế Nam Bộ (45%) đã hoạt động như một van điều tiết vĩ mô tự động, ép một lượng dòng tiền số hóa chảy về thúc đẩy phát triển <b>Dịch vụ số thương mại vùng Trung Bộ</b>, đảm bảo tính hài hòa lãnh thổ.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}