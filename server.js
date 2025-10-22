require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

// 🔗 Kết nối MongoDB Atlas
connectDB();

// ✅ Cấu hình CORS cho frontend
app.use(
  cors({
    origin: ["http://localhost:5500", "https://test-app-f96w.onrender.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", true);

// ✅ Đường dẫn thư mục public
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// ✅ Middleware kiểm tra nếu đã đăng nhập → chặn truy cập login/register
function checkNotLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    return res.redirect("/menu");
  }
  next();
}

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));

// ✅ Route frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/login", checkNotLoggedIn, (req, res) => {
  res.sendFile(path.join(publicPath, "pages/login.html"));
});

app.get("/register", checkNotLoggedIn, (req, res) => {
  res.sendFile(path.join(publicPath, "pages/register.html"));
});

app.get("/menu", (req, res) => {
  res.sendFile(path.join(publicPath, "pages/menu.html"));
});

// 🔥 Render sẽ tự set biến PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server đang chạy tại cổng ${PORT}`));
