import express, { type Express } from 'express'
import { createServer, Server } from 'node:http'
import { Server as SocketServer } from 'socket.io'
import cors from 'cors'
import { config } from 'dotenv'

config({ path: '.env' })

const app: Express = express()
const httpServer: Server = createServer(app)

const io: SocketServer = new SocketServer(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors({ origin: '*', methods: ['GET', 'POST'] }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', express.static('public'));
let roomId = 'roomId'
io.on('connection', (socket) => {
    let { username } = socket.handshake.auth
    socket.join(roomId)
    socket.on('message', (data) => {
        socket.to(roomId).emit('message', { ...data, username })
        socket.emit('message', { ...data, username });
    });
    socket.on('disconnect', () => {
        socket.leave(roomId)
        socket.to(roomId).emit('message', { username, message: 'disconnected', type: 'disconnect' });
    })
});

const { PORT, SERVER_ENV, SERVER_ID } = process.env

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${SERVER_ENV} mode with ID ${SERVER_ID}`)
})