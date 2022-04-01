const express = require('express');
const PORT = 3000;
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');
const app = express();
const fs = require('fs');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));


const server = httpServer.listen(PORT, () =>{
  console.log('servidor levantado en puerto ' + server.address().port);
})

server.on('error', (error) => console.log('hubo un error ${error}'));

const products = [];
let numID = 1;

io.on('connection', async (socket) => {
console.log('se conecto un usuario');
const persist = await fs.promises.readFile('data/chats.json', 'UTF-8');
const messages = JSON.parse(persist);
console.log(messages);
socket.emit('messages', messages);
socket.emit('products', products);

socket.on('new-message', async (data) => {
  messages.push(data);
  await fs.promises.writeFile('data/chats.json', JSON.stringify(messages, null, 2));
  io.sockets.emit('messages', messages);
})

socket.on('new-product', async (data) => {
  const newProd = {...data, id: numID}
  numID++ 
  products.push(newProd);
  io.sockets.emit('products', products);
})
})
