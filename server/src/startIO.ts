import http from "http";
import { Server, Socket } from "socket.io";

interface Client {
  socket: Socket;
  data: {
    userId: string;
  };
}

const clientSet = new Set<Client>();

export function startIO(server: http.Server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });
  io.on("connection", (socket) => {
    const client = {
      socket,
      data: {
        userId: "",
      },
    };
    clientSet.add(client);
    socket.on("login", (userId: string) => {
      client.data.userId = userId;
      console.log(`[socket] User ${userId} logged in.`);
    });
    socket.on("disconnect", () => {
      clientSet.delete(client);
    });
  });
}

export function sendSocketMsg({
  userId,
  event,
  data,
}: {
  userId: string;
  event: string;
  data: any;
}) {
  clientSet.forEach((t) => {
    if (t.data.userId === userId) {
      t.socket.emit(event, data);
    }
  });
}
