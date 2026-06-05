import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Bai06() {
  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const calculateTOPSIS = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/bai6/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.success) {
        setResData(data);
        setIsCalculated(true);
      } else {
        alert("Lỗi không thể khởi chạy thuật toán TOPSIS.");
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi liên thông luồng dữ liệu Bài 6:", err);
      setLoading(false);
    });
  };

  const formatComma = (num, digits = 4) => {
    if (num === undefined || num === null) return "--";
    return typeof num === 'number' ? num.toFixed(digits).replace('.', ',') : num;
  };

  const getRankBadgeClass = (rank) => {
    const val = Number(rank);
    if (val === 1) return { backgroundColor: '#198754', color: '#ffffff', textAlign: 'center', fontWeight: 'bold', padding: '6px' };
    if (val === 2) return { backgroundColor: '#20c997', color: '#ffffff', textAlign: 'center', fontWeight: 'bold', padding: '6px' };
    if (val === 3) return { backgroundColor: '#ffc107', color: '#111827', textAlign: 'center', fontWeight: 'bold', padding: '6px' };
    return { backgroundColor: '#334155', color: '#cbd5e1', textAlign: 'center', fontWeight: 'bold', padding: '6px' };
  };

  return (
    <div style={{ color: '#ffffff', maxWidth: '1400px', margin: '0 auto', paddingBottom: '30px', fontFamily: 'sans-serif' }}>
      
      {/* Tiêu đề */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>BÀI 6 - TOPSIS XẾP HẠNG 6 VÙNG KINH TẾ THEO MỨC ĐỘ ƯU TIÊN ĐẦU TƯ AI</h1>
      </div>

      {/* Mô hình toán học */}
      <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderTop: '3px solid #38bdf8', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔢</span> Mô hình toán học
        </h3>
        <div style={{ backgroundColor: '#0f172a', padding: '15px 20px', borderRadius: '6px', overflowX: 'auto', marginBottom: '12px' }}>
          <p style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '26px', color: '#cbd5e1', margin: 0, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
            <b style={{color: '#fff'}}><i>C</i><sub>i</sub><sup>*</sup></b> = <i>S</i><sub>i</sub><sup>-</sup> / (<i>S</i><sub>i</sub><sup>+</sup> + <i>S</i><sub>i</sub><sup>-</sup>)
          </p>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
          TOPSIS xếp hạng các vùng theo mức độ gần với phương án lý tưởng dương và xa phương án lý tưởng âm. Gini được xem là tiêu chí chi phí, các tiêu chí còn lại là tiêu chí lợi ích.
        </p>
      </div>

      {/* Điều khiển & KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#38bdf8' }}>🎛️ Bộ trọng số chuyên gia</h3>
          <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '20px' }}>
            w = [0.10, 0.10, 0.15, 0.20, 0.15, 0.15, 0.05, 0.10]
          </p>
          <button onClick={calculateTOPSIS} style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            ▶️ Chạy mô hình TOPSIS
          </button>
        </div>

        {/* Khối KPI - Khớp chuẩn ảnh mẫu */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ backgroundColor: '#17a2b8', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '20px', margin: 0, fontWeight: 'bold', lineHeight: '1.3' }}>{resData ? resData.top_expert : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#e0f2fe' }}>Top 1 trọng số chuyên gia</p>
          </div>
          <div style={{ backgroundColor: '#28a745', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>{resData ? formatComma(resData.max_score) : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#d1fae5' }}>Điểm TOPSIS cao nhất</p>
          </div>
          <div style={{ backgroundColor: '#ffc107', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '20px', margin: 0, fontWeight: 'bold', color: '#212529', lineHeight: '1.3' }}>{resData ? resData.top_entropy : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#343a40' }}>Top 1 Entropy</p>
          </div>
          <div style={{ backgroundColor: '#dc3545', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
            <h2 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold' }}>{resData ? resData.stability : '--'}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#fee2e2' }}>Ổn định Top-3</p>
          </div>
        </div>
      </div>

      {isCalculated && resData && (
        <>
          {/* Đồ thị thanh chắn dọc và Bảng trọng số tiêu chí */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📊 Xếp hạng TOPSIS theo trọng số chuyên gia</h4>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.expert_ranking || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" domain={[0, 1]} />
                    <YAxis dataKey="region" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff', border: '1px solid #232936' }} formatter={(value) => [value ? value.toString().replace('.', ',') : '', 'Điểm C*']} />
                    <Bar dataKey="c_star" fill="#38bdf8" radius={[0, 4, 4, 0]} barSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📊 Trọng số tiêu chí</h4>
              <div style={{ overflowY: 'auto', maxHeight: '280px' }}>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                      <th style={{ padding: '8px' }}>Tiêu chí</th>
                      <th style={{ padding: '8px' }}>Loại</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Expert</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Entropy</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>AHP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resData.criteria_weights || []).map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #232936' }}>
                        <td style={{ padding: '8px', color: '#fff' }}>{row.criterion}</td>
                        <td style={{ padding: '8px', color: row.type === 'Cost' ? '#f87171' : '#34d399' }}>{row.type}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{typeof row.expert === 'number' ? row.expert.toString().replace('.', ',') : row.expert}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{typeof row.entropy === 'number' ? row.entropy.toString().replace('.', ',') : row.entropy}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{typeof row.ahp === 'number' ? row.ahp.toString().replace('.', ',') : row.ahp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bảng xếp hạng chi tiết */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '4px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📋 Bảng xếp hạng trọng số chuyên gia</h4>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                    <th style={{ padding: '8px' }}>Rank</th>
                    <th style={{ padding: '8px' }}>Vùng</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Cᵢ*</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>S+</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>S-</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.expert_ranking || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #232936' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold', color: '#38bdf8' }}>{row.rank}</td>
                      <td style={{ padding: '8px' }}>{row.region}</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: '#34d399', fontWeight: 'bold' }}>{formatComma(row.c_star)}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>{formatComma(row.s_plus)}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>{formatComma(row.s_minus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '4px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📋 So sánh với trọng số Entropy</h4>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                    <th style={{ padding: '8px' }}>Vùng</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Rank Expert</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Rank Entropy</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Thay đổi</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.method_comparison || []).map((row, i) => {
                    const changeStr = String(row.change || '');
                    const color = changeStr.includes('-') ? '#f87171' : changeStr === '0' ? '#94a3b8' : '#34d399';
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #232936' }}>
                        <td style={{ padding: '8px' }}>{row.region}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{row.rank_expert}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{row.rank_entropy}</td>
                        <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', color: color }}>{row.change}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Phân tích độ nhạy & Heatmap thứ hạng */}
          <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
            <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '10px' }}>📈 Phân tích độ nhạy theo trọng số AI Readiness</h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '15px' }}>
              w_AI thay đổi từ 0,10 đến 0,40. Các trọng số còn lại được chuẩn hóa lại để tổng bằng 1.
            </p>
            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '25px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                  <th style={{ padding: '8px' }}>w_AI</th>
                  <th style={{ padding: '8px' }}>Top 1</th>
                  <th style={{ padding: '8px' }}>Top 2</th>
                  <th style={{ padding: '8px' }}>Top 3</th>
                </tr>
              </thead>
              <tbody>
                {(resData.sensitivity_data || []).map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #232936' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold', color: '#fbbf24' }}>{typeof row.w_ai === 'number' ? row.w_ai.toFixed(2).replace('.', ',') : row.w_ai}</td>
                    <td style={{ padding: '8px' }}>{row.top_1}</td>
                    <td style={{ padding: '8px' }}>{row.top_2}</td>
                    <td style={{ padding: '8px', color: '#38bdf8' }}>{row.top_3}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h5 style={{ fontSize: '13px', color: '#fff', marginBottom: '12px', fontWeight: 'bold' }}>Heatmap thứ hạng theo w_AI</h5>
            <div style={{ overflowX: 'auto', marginBottom: '15px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0f172a', borderBottom: '2px solid #232936', color: '#94a3b8' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Vùng kinh tế</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>w_AI=0,1</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>w_AI=0,15</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>w_AI=0,2</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>w_AI=0,25</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>w_AI=0,3</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>w_AI=0,35</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>w_AI=0,4</th>
                  </tr>
                </thead>
                <tbody>
                  {(resData.heatmap_matrix || []).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #232936' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.region}</td>
                      <td style={getRankBadgeClass(row.r1)}>{row.r1}</td>
                      <td style={getRankBadgeClass(row.r2)}>{row.r2}</td>
                      <td style={getRankBadgeClass(row.r3)}>{row.r3}</td>
                      <td style={getRankBadgeClass(row.r4)}>{row.r4}</td>
                      <td style={getRankBadgeClass(row.r5)}>{row.r5}</td>
                      <td style={getRankBadgeClass(row.r6)}>{row.r6}</td>
                      <td style={getRankBadgeClass(row.r7)}>{row.r7}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
              Top-3 ổn định khi thay đổi trọng số AI Readiness, cho thấy nhóm vùng dẫn đầu có nền tảng tương đối vững.
            </p>
          </div>

          {/* Đồ thị tích hợp đa phương pháp (Chỉ lọc Top-3 theo mẫu ảnh) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '15px' }}>📊 So sánh TOPSIS - Entropy - AHP</h4>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={resData.chart_data || []} margin={{ bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232936" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} label={{ value: "Top-3 theo trọng số chuyên gia", position: "insideBottom", offset: -5, fill: "#94a3b8" }} />
                    <YAxis stroke="#94a3b8" domain={[0, 1.0]} label={{ value: "Điểm TOPSIS", angle: -90, position: "insideLeft", fill: "#94a3b8" }} />
                    <Tooltip contentStyle={{ backgroundColor: '#161a25', color: '#fff' }} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="Expert" fill="#7dd3fc" name="Expert" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="Entropy" fill="#f472b6" name="Entropy" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="AHP" fill="#fbcfe8" name="AHP" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: '#161a25', border: '1px solid #232936', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '12px' }}>📋 Kết quả AHP đơn giản</h4>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #232936', color: '#94a3b8', backgroundColor: '#0f172a' }}>
                      <th style={{ padding: '6px' }}>Rank</th>
                      <th style={{ padding: '6px' }}>Vùng</th>
                      <th style={{ padding: '6px', textAlign: 'right' }}>Điểm TOPSIS-AHP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resData.ahp_table || []).map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #232936' }}>
                        <td style={{ padding: '6px', fontWeight: 'bold', color: '#38bdf8' }}>{row.rank}</td>
                        <td style={{ padding: '6px' }}>{row.region}</td>
                        <td style={{ padding: '6px', textAlign: 'right', fontWeight: '500', color: '#34d399' }}>{formatComma(row.score, 3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #232936', paddingTop: '10px', marginTop: '10px' }}>
                Consistency Ratio AHP: <span style={{ color: '#f87171', fontWeight: 'bold' }}>{resData.ahp_cr}</span>
              </div>
            </div>
          </div>

          {/* 6.5 Nhận xét và hàm ý chính sách */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '25px', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              🏛️ 6.5. Nhận xét và Hàm ý chính sách (Đánh giá Đa tiêu chí)
            </h3>
            
            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.8' }}>
              
              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  a) Vùng nào dẫn đầu theo TOPSIS với trọng số chuyên gia? Đây có phải vùng nên triển khai trung tâm AI quốc gia đầu tiên không?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Kết quả TOPSIS:</b> Hai vùng <b>Đông Nam Bộ</b> (hạt nhân TP.HCM) và <b>Đồng bằng sông Hồng</b> (hạt nhân Hà Nội) luôn dẫn đầu tuyệt đối do vượt trội về hạ tầng dữ liệu và nguồn nhân lực công nghệ cao.<br />
                  <b>Hàm ý triển khai:</b> Đây <b>chắc chắn là nơi phải đặt trung tâm AI quốc gia đầu tiên</b>. Dưới góc độ kinh tế học đô thị, ngành AI đòi hỏi <i>Lợi thế tích tụ (Agglomeration Economies)</i> cực kỳ lớn. Triển khai AI ở những vùng dẫn đầu này giúp tận dụng tối đa hệ sinh thái khởi nghiệp sẵn có, chuỗi cung ứng linh kiện và viện nghiên cứu máy tính lõi, từ đó thu được tỷ suất hoàn vốn (ROI) nhanh nhất và giảm thiểu rủi ro thất bại của dự án tiên phong.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  b) Khi dùng trọng số Entropy, vùng nào có sự thay đổi xếp hạng lớn nhất? Vì sao?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Sự thay đổi:</b> Các vùng có xuất phát điểm thấp như <b>Tây Nguyên</b> hoặc <b>ĐBSCL</b> thường bị rớt hạng mạnh nhất khi chuyển từ trọng số chuyên gia sang trọng số Entropy.<br />
                  <b>Bản chất thuật toán:</b> Phương pháp Entropy cấp trọng số cực kỳ lớn cho những tiêu chí có độ phân tán (variance) cao giữa các vùng (ví dụ: Số lượng bằng sáng chế AI, Lượng vốn FDI công nghệ cao). Vì Tây Nguyên và ĐBSCL có các chỉ số này gần như bằng 0 (tạo ra khoảng cách khổng lồ so với Đông Nam Bộ), thuật toán Entropy sẽ trừng phạt rất nặng sự yếu kém này, làm điểm khoảng cách tới giải pháp lý tưởng âm (Negative Ideal Solution) của họ ngắn lại, dẫn đến rớt hạng thê thảm.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  c) TOPSIS giả định độc lập tuyến tính. Thực tế AI Readiness và Internet penetration tương quan cao. Ảnh hưởng thế nào và cách xử lý?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify' }}>
                  <b>Hệ lụy của Đa cộng tuyến (Multi-collinearity):</b> Khi hai tiêu chí có tương quan thuận quá mạnh, việc đưa cả hai vào TOPSIS sẽ gây ra hiện tượng <i>"Tính đúp" (Double Counting)</i> đối với một nhân tố ẩn chung (ví dụ: nền tảng công nghệ cơ bản). Điều này làm thiên lệch kết quả, bơm phồng điểm số một cách giả tạo cho các vùng vốn đã mạnh về hạ tầng mạng, khiến các nỗ lực ở các tiêu chí khác bị lu mờ.<br />
                  <b>Đề xuất xử lý:</b> Về mặt toán học, có hai giải pháp triệt để: <br />
                  1. Chạy thuật toán <b>Phân tích thành phần chính (PCA - Principal Component Analysis)</b> để nén các biến tương quan cao thành một trục nhân tố trực giao (độc lập) trước khi đưa vào TOPSIS.<br />
                  2. Thay thế khoảng cách rễ bình phương (Euclidean distance) truyền thống trong TOPSIS bằng <b>Khoảng cách Mahalanobis</b>, bởi công thức Mahalanobis đã tự động tích hợp ma trận hiệp phương sai để triệt tiêu sự tương quan giữa các biến.
                </p>
              </div>

              <div>
                <b style={{ color: '#fff', fontSize: '14.5px', display: 'block', marginBottom: '6px' }}>
                  d) Dựa trên TOPSIS và Quyết định 127/QĐ-TTg, chọn 3 vùng xây trung tâm AI. Có cần điều chỉnh tiêu chí địa - chính trị không?
                </b>
                <p style={{ marginTop: '5px', textAlign: 'justify', marginBottom: 0 }}>
                  <b>Lựa chọn theo TOPSIS:</b> Mô hình định lượng sẽ ưu tiên 3 vùng: Đông Nam Bộ (Nam), Đồng bằng Sông Hồng (Bắc) và Duyên hải miền Trung (Đà Nẵng).<br />
                  <b>Góc độ Địa - Chính trị:</b> Sự điều chỉnh hệ số địa - chính trị và an ninh quốc gia là <b>bắt buộc</b>. Nếu chỉ tuân theo toán học tối ưu, các nguồn lực công nghệ cao sẽ bị hút cạn về hai đầu đất nước, gây ra hiện tượng <i>"Chảy máu chất xám" (Brain Drain)</i> cục bộ. Việc chủ đích đặt 1 trong 3 trung tâm AI lớn tại miền Trung (Đà Nẵng) dù điểm TOPSIS có thể thua kém một chút so với vùng lân cận TP.HCM, là nhằm tạo ra một <i>Hiệu ứng lan tỏa không gian (Spatial Spillover Effect)</i>, đảm bảo phát triển kinh tế đa cực, dự phòng rủi ro an ninh mạng phân tán và bảo vệ cấu trúc công bằng xã hội.
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}