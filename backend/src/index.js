const express = require('express')
const mongoose =  require('mongoose')
const path = require('path')
const cors = require('cors')

const app = express()

const server = require('http').Server(app);
const io = require('socket.io')(server);

mongoose.connect('mongodb+srv://tuius:naoconto@cluster0-jerul.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use((req, res, next) => {
    req.io = io;

    next();
});

//Permite o Frontend conectar com o Backend
app.use(cors());

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

app.use(require('./routes'))

server.listen(3333)