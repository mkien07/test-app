require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

// 🔗 Kết nối MongoDB Atlas
connectDB();

// ✅ Cấu hình CORS cho domain frontend
app.use(
  cors({
    origin: ["http://localhost:5500", "https://test-app-f96w.onrender.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ API Routes

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));

// ✅ Serve static files (frontend)
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// ✅ Khi user vào "/" hoặc bất kỳ đường dẫn frontend nào → trả về index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// (Tùy chọn) Nếu bạn có route riêng cho menu.html
app.get("/menu", (req, res) => {
  res.sendFile(path.join(publicPath, "menu.html"));
});


// 🔥 Render sẽ tự set biến PORT, không nên cố định 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server đang chạy tại cổng ${PORT}`));
