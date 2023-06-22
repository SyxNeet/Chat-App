
const Messages = require("./model/messageModel");

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoutes")
const messageRoute = require("./routes/messagesRoute")
const app = express()
const socket = require("socket.io")
require("dotenv").config()

app.use(cors())
app.use(express.json())
app.use("/api/auth", userRoutes)
app.use("/api/messages", messageRoute)
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB Connection Successfull");
}).catch((err) => {
    console.log(err.message);
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
})

global.onlineUsers = new Map()
io.on("connection", (socket) => {
    global.chatSocket = socket
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id)
    })
    socket.on("send-msg", (data) => {
        // Messages.create({
        //     message: { text: data.message },
        //     users: [data.from, data.to],
        //     sender: data.from
        // })
        const sendUserSocket = onlineUsers.get(data.to) // get ra socketId của userId
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message)
        }
    })
})

// để gọi được API getAllUser
// => chạy dòng 8 => 11 => 12 => 13 => chạy vào userRoutes =>
// => chạy xuống dòng 10 => chạy vào hàm getAllUsers => 