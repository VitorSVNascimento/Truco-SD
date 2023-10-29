import React from "react"
import { Socket } from "socket.io-client"

const SocketContext = React.createContext<Socket>({} as Socket)

export default SocketContext
