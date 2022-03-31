const express = require('express');
const PORT = 3000;
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');
const router = require('./router/index');
const app = express();
const { engine } = require('express-handlebars');
const path = require('path');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: path.join(__dirname, './views/layout.hbs'),
    partialsDir: path.join(__dirname, './views/partials')
}));
app.set('view engine', 'hbs');
app.use(router);

const server = httpServer.listen(PORT, () =>{
  console.log('servidor levantado en puerto ' + server.address().port);
})

server.on('error', (error) => console.log('hubo un error ${error}'));

const messages = [
{ author: 'Juan', text: '¡Hola! ¿Que tal?' },
{ author: 'Pedro', text: '¡Muy bien! ¿Y vos?' },
{ author: 'Ana', text: '¡Genial!' },
];

io.on('connection', (socket) => {
console.log('se conecto un usuario');
socket.emit('messages', messages);
socket.on('notificacion', (data) => {
  console.log(data);
})

socket.on('new-message', (data) => {
  messages.push(data);
  io.sockets.emit('messages', messages);
})
})
