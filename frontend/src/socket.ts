import { io } from "socket.io-client";

export const socket = io("http://localhost:22000", {
    autoConnect: false
});