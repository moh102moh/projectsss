import dotenv from "dotenv";
import http from "http";
import app from "./src/app.js";
import { initSocket } from "./src/socket/index.js";
import { startScheduler } from "./src/cron/scheduler.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

// إنشاء سيرفر HTTP وتركيب socket.io عليه
const server = http.createServer(app);

// تشغيل WebSocket
initSocket(server);

// تشغيل الكرون
startScheduler();

server.listen(PORT, () => {
    console.log(`������ Server running on http://localhost:${PORT}`);
});
