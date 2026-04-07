import io from "socket.io";
import http from "http";
import { Application } from "express";
import { allowedOrigins } from './../utils/envVariables';

export function initializeSocket(app: Application) {
  const server = http.createServer(app);

  const ioServer = new io.Server(server, {
    cors: {
      origin: allowedOrigins?.length ? allowedOrigins : true,
      methods: ["GET", "POST"],
    },
  });

  // Socket.IO connection event handlers
  ioServer.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Handle custom events here
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Add more socket event handlers as needed
    // socket.on("eventName", (data) => {
    //   console.log("Event received:", data);
    //   ioServer.emit("eventName", data);
    // });
  });

  return { server, ioServer };
}