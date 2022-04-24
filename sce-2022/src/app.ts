import server from './server'

import socketServer from "./socket_server"

socketServer(server)

const PORT = process.env.PORT
server.listen(PORT,()=>{
    console.log('server started on port ' + PORT)
})

export = server
