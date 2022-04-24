import { Server,Socket } from "socket.io"

export = (io:Server, socket:Socket) => {
    const echoHandler = (payload:string) => {
        socket.emit("common:echo", payload)
    }
 
    socket.on("common:echo", echoHandler);
 }
 