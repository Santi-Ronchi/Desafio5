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
const Contenedor = require('./Contenedor')


const server = httpServer.listen(PORT, () =>{
  console.log('servidor levantado en puerto ' + server.address().port);
})

server.on('error', (error) => console.log(`hubo un error ${error}`));

//ACA HACEMOS PRUEBAS KNEX

const options = require('./options/mariaDB')
const optionsSQLite = require('./options/sqlite3')
//const knex = require('knex')(optionsSQLite)

/*knex.schema.createTable('mensajes', table => {
  table.increments('id'),
  table.string('email', 40),
  table.string('data', 240),
  table.timestamp('date').defaultTo(knex.fn.now())
})
  .then(() => console.log('tabla "mensajes" creada'))
  .catch( err => {console.log({'crear tabla':err}); throw err} )
  .finally(() => {
      knex.destroy();
  })*/
const contenedorProd = new Contenedor(options, "productos")
const contenedorChat = new Contenedor(optionsSQLite, "mensajes")

/*contenedorProd.saveObj({title: "remera", price: "500", thumbnail: "remera.png"})*/

//ACA HACEMOS PRUEBAS KNEX

//const products = [];
//let numID = 1;


io.on('connection', async (socket) => {

  const products = await contenedorProd.getAll();
  //console.log(products);
  console.log('se conecto un usuario');
  const messages = await contenedorChat.getAll();
  //const persist = await fs.promises.readFile('data/chats.json', 'UTF-8');
  //const messages = JSON.parse(persist);
  console.log(messages);
  socket.emit('messages', messages);
  socket.emit('products', products);

  socket.on('new-message', async (data) => {
    await contenedorChat.saveObj(data);
    const messages = await contenedorChat.getAll();
    console.log(messages);
    //messages.push(data);
    //await fs.promises.writeFile('data/chats.json', JSON.stringify(messages, null, 2));
    io.sockets.emit('messages', messages);
  })

  socket.on('new-product', async (data) => {
    //products.push(newProd);
    await contenedorProd.saveObj(data);
    const products = await contenedorProd.getAll();
    io.sockets.emit('products', products);
  })
})
