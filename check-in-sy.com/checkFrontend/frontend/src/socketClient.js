// src/socketClient.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://app.check-in-sy.com"; // ← بدل localhost
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  path: "/socket.io",
  transports: ["websocket", "polling"], // fallback
});

export const connectSocket = (role = "user") => {
  if (socket.connected) {
    socket.emit("registerRole", role);
    return;
  }
  socket.connect();
  const onConnect = () => {
    socket.emit("registerRole", role);
    socket.off("connect", onConnect);
  };
  socket.on("connect", onConnect);
};

export const disconnectSocket = () => {
  socket.off("connect");
  socket.disconnect();
};
