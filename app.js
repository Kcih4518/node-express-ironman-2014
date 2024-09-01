import express from "express";
import { create } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

// 設置 Express-Handlebars
const hbs = create({
  defaultLayout: "main",
  extname: ".handlebars",
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// 設置靜態文件夾
app.use(express.static(join(__dirname, "public")));

// 用戶列表
let users = [];

// 路由
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

// Socket.io 連接
io.on("connection", (socket) => {
  console.log("A user connected");

  // 加入聊天室
  socket.on("join", (username) => {
    if (username) {
      socket.username = username;
      users.push(username);
      io.emit("updateUsers", users);
      socket.broadcast.emit("message", {
        user: "System",
        text: `${username} 加入了聊天室`,
      });
    }
  });

  // 發送消息
  socket.on("sendMessage", (message) => {
    if (socket.username && message) {
      io.emit("message", { user: socket.username, text: message });
    }
  });

  // 斷開連接
  socket.on("disconnect", () => {
    if (socket.username) {
      console.log("User disconnected:", socket.username);
      users = users.filter((user) => user !== socket.username);
      io.emit("updateUsers", users);
      socket.broadcast.emit("message", {
        user: "System",
        text: `${socket.username} 離開了聊天室`,
      });
    } else {
      console.log("An unnamed user disconnected");
    }
  });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 啟動服務器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// 優雅關閉
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
