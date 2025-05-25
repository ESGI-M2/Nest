import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket && typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
    });

    console.log("Connecting to socket...", token);

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      socket = null; // Reset socket on error
    });

    socket.on("disconnect", () => {
      console.warn("Socket disconnected");
      socket = null; // Reset socket on disconnect
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnecting... Attempt #${attempt}`);
    });

    socket.on("reconnect_failed", () => {
      console.error("Reconnection failed");
      socket = null; // Reset socket on failed reconnection
    });

    socket.on("reconnect", (attempt) => {
      console.log(`Reconnected successfully after ${attempt} attempts`);
    });
  }
  return socket as Socket;
};