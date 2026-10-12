# FinAdmin — Frontend Quản lý tài chính cá nhân

Giao diện admin viết bằng **React 19 + Vite + Material UI 9**, kết nối trực tiếp API backend Express + Sequelize.

## Chạy dự án

```bash
# 1. Cài dependencies (lần đầu)
npm install

# 2. Khởi động backend trước (ở thư mục backend/)
cd ../backend
nodemon index.js

# 3. Chạy frontend (ở thư mục frontend/)
npm run dev
```

Mở trình duyệt tại địa chỉ Vite in ra (mặc định `http://localhost:5173`).

## Đăng nhập

- **Chưa có tài khoản?** Chuyển sang tab **Đăng ký** — hệ thống tạo tài khoản xong tự đăng nhập.
- Đã có tài khoản thì đăng nhập bằng email + mật khẩu đã đăng ký ở backend.

## Cấu trúc thư mục

```
src/
├── api/api.js              # axios + JWT interceptor + các hàm gọi API
├── context/AuthContext.jsx # Quản lý đăng nhập/đăng xuất
├── theme/AppTheme.jsx      # Theme MUI + dark/light mode
├── components/Layout.jsx   # Sidebar + Appbar chung
├── pages/
│   ├── LoginPage.jsx       # Đăng nhập / Đăng ký
│   ├── DashboardPage.jsx   # Tổng quan: thống kê + biểu đồ + tiến độ
│   ├── WalletsPage.jsx     # Ví: CRUD + chuyển tiền
│   ├── TransactionsPage.jsx# Giao dịch: CRUD + lọc theo tháng/loại
│   ├── CategoriesPage.jsx  # Danh mục: CRUD + icon + màu
│   ├── BudgetsPage.jsx     # Ngân sách: CRUD + tiến độ chi tiêu
│   └── GoalsPage.jsx       # Mục tiêu: CRUD + đóng góp tiền
└── utils/format.js         # Định dạng tiền VND, ngày
```

## Cấu hình

Đổi địa chỉ backend trong `src/api/api.js`:

```js
export const API_URL = 'http://localhost:5000/api'
```

## Tính năng chính

- ✅ Đăng nhập JWT (token lưu localStorage, tự gắn vào mọi request, hết hạn tự đá về login)
- ✅ CRUD đầy đủ: ví, giao dịch, danh mục, ngân sách, mục tiêu tiết kiệm
- ✅ Sửa/Xóa đều có dialog riêng, xóa phải xác nhận
- ✅ Chuyển tiền giữa các ví (gọi API transaction của backend, an toàn nguyên tử)
- ✅ Đóng góp tiền vào mục tiêu — tự chuyển "Hoàn thành" khi đạt
- ✅ Dashboard: tổng số dư, thu/chi tháng, biểu đồ 6 tháng, tiến độ ngân sách & mục tiêu
- ✅ Lọc giao dịch theo tháng và loại
- ✅ Dark/Light mode
- ✅ Định dạng tiền VND tiếng Việt
