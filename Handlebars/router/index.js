const { Router } = require('express')

const router = Router();

let productos = [];
let idContador = 1;

router.get('/', (req, res) => {
    res.render("formulario")
});

router.post('/productos', (req, res) => {
    const {titulo, precio, url} = req.body;
    let productoCompleto = {
        titulo,
        precio,
        url,
        id: idContador
    }
    productos.push(productoCompleto);
    idContador++
    res.redirect('/');
});

router.get('/productos', (req, res) => {
    res.render("listaProd", {productos});

});

router.get('/chatroom', (req, res) => {
    res.sendFile('index.html')
  })

module.exports = router;