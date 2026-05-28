import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cấu hình Vite chuẩn hợp nhất giữa Docker và Trình tối ưu Plotly 3D
export default defineConfig({
  plugins: [react()],
  
  // 💡 GIỮ NGUYÊN CŨ VÀ BỔ SUNG ĐOẠN NÀY: Giúp Vite pre-bundle Plotly không bị lỗi màn hình đen
  optimizeDeps: {
    include: ['react-plotly.js', 'plotly.js-dist-min']
  },

  // 💡 GIỮ NGUYÊN CẤU HÌNH DOCKER THẦN THÁNH CỦA ĐẠT:
  server: {
    watch: {
      usePolling: true, // Nhận diện thay đổi code từ máy thật đồng bộ vào Docker
    },
    host: '0.0.0.0', // Lắng nghe mọi kết nối trong mạng nội bộ Docker
    port: 5173
  }
})