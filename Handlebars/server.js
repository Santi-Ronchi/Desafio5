const express = require('express');
const router = require('./router/index');
const app = express();
const { engine } = require('express-handlebars');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: path.join(__dirname, './views/layout.hbs'),
    partialsDir: path.join(__dirname, './views/partials')
}));

app.set('view engine', 'hbs');
const PORT = 3000;
app.use(router);

const server = app.listen(PORT, () =>{
    console.log('servidor levantado en puerto ' + server.address().port);
})

server.on('error', (error) => console.log('hubo un error ${error}'));