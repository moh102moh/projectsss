import { Server } from "socket.io";

// حفظ كل الـ sockets حسب الدور (يشمل الأدوار الديناميكية مثل hotel_owner_ID)
const roleSockets = {
    admin: new Set(),
    delivery: new Set(),
    user: new Set(),
};

/**
 * تهيئة Socket.io مع السيرفر
 * @param {http.Server} server 
 */
export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    
    // جعل socket.io متاحاً عالمياً
    global.ioInstance = io;

    io.on("connection", (socket) => {
        console.log("🔌 Socket connected:", socket.id);

        // 💡 تسجيل الدور (ثابت أو ديناميكي مثل: hotel_owner_5)
        socket.on("registerRole", (role) => {
            if (!roleSockets[role]) {
                roleSockets[role] = new Set();
            }
            roleSockets[role].add(socket.id);
            console.log(`🟢 Socket ${socket.id} registered as ${role}`);
        });

        socket.on("testMessage", (msg) => {
            console.log("📨 Test message from socket:", msg);
        });

        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected:", socket.id);
            // إزالة الـ socket من كل الأدوار التي كان مسجلاً بها
            for (const role in roleSockets) {
                roleSockets[role].delete(socket.id);
            }
        });
    });

    console.log("🚀 Socket.io initialized!");
};

/**
 * إرسال رسالة لكل الـ sockets المسجلين بدور محدد
 * @param {string} role - يمكن أن يكون 'admin' أو 'hotel_owner_ID'
 * @param {string} eventName
 * @param {any} data
 */
export const sendToRole = (role, eventName, data) => {
    if (!roleSockets[role]) return;

    const io = global.ioInstance;
    if (!io) {
        console.warn("Socket.io instance not found!");
        return;
    }

    roleSockets[role].forEach((socketId) => {
        io.to(socketId).emit(eventName, data);
    });
};
