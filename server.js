require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const serviceRoutes = require('./routes/service.route');
const chatRoutes = require('./routes/chat.route');
const propertyRoutes = require('./routes/property.route');
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5555;
const { Server } = require("socket.io");
const allowedOrigins = ["http://localhost:3000", "https://buildeo.vercel.app"];

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(helmet());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected✅ ');
}).catch(err => console.log(err));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/service', serviceRoutes);
app.use('/chat', chatRoutes);
app.use('/property', propertyRoutes);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);

    socket.on("sendMessage", async (data) => {
        const { chatId, sender, text, createdAt } = data;

        try {
            const chat = await Chat.findById(chatId);
            if (!chat) return;

            const message = { sender, text, createdAt: new Date(createdAt) };
            chat.messages.push(message);
            await chat.save();

            io.emit("receiveMessage", { chatId, message }); 
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}✅ `);
    console.log(`Server's Frontend origins: ${allowedOrigins.join(', ')}✅ `);
});