const express = require('express');
const router = require('./router/index');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const PORT = 3000;
app.use(router);

const server = app.listen(PORT, () =>{
    console.log('servidor levantado en puerto ' + server.address().port);
})

server.on('error', (error) => console.log('hubo un error ${error}'));