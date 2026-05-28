from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Nạp trực tiếp các phân vùng router từ thư mục routes
from routes.bai01 import router as bai01_router
from routes.bai02 import router as bai02_router
from routes.bai03 import router as bai03_router
from routes.bai04 import router as bai04_router
from routes.bai05 import router as bai05_router
from routes.bai06 import router as bai06_router
from routes.bai07 import router as bai07_router
from routes.bai08 import router as bai08_router
from routes.bai09 import router as bai09_router
from routes.bai10 import router as bai10_router
from routes.bai11 import router as bai11_router
from routes.bai12 import router as bai12_router

# Khởi tạo đối tượng app (Nằm ngay sau các lệnh import bắt buộc)
app = FastAPI(title="AIDEOM-VN Multi-Task API Hub")

# Cấu hình CORS liên thông cổng Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Khai báo nạp toàn bộ luồng bài tập vào hệ thống định tuyến chính
app.include_router(bai01_router)
app.include_router(bai02_router)
app.include_router(bai03_router)
app.include_router(bai04_router)
app.include_router(bai05_router)
app.include_router(bai06_router)
app.include_router(bai07_router)
app.include_router(bai08_router)
app.include_router(bai09_router)
app.include_router(bai10_router)
app.include_router(bai11_router)
app.include_router(bai12_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)