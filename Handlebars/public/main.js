const socket = io.connect();
socket.on('mi mensaje', (data) => {
  alert(data)
  socket.emit('notificacion', 'mensaje recibido con exito')
});

function timeOfMessage(){
  let date = new Date();
  let time = date.getFullYear() + "/" + (date.getMonth() +1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(); 
  return time;
}

function render(data) {
  const html = data
    .map((elem, index) => {
      return `<div>
            <strong style="color: blue">${elem.author}</strong><bdi style:"color: red">[${elem.time}]</bdi>:
            <em style="color: green">${elem.text}</em> </div>`
    }).join(' ');
  document.getElementById('mensajes').innerHTML = html;
}

socket.on('messages', function (data) {
  render(data);
})

function addMessage(e) {

  let time = timeOfMessage()

  const mensaje = {
    author: document.getElementById('username').value,
    text: document.getElementById('texto').value,
    time: time
  }
  socket.emit('new-message', mensaje);
  return false;
}

function addProduct(e) {
  const producto = {
    title: document.getElementById('title').value,
    price: document.getElementById('price').value,
    url: document.getElementById('url').value,
  }
  socket.emit('new-product', producto);
  return false;
}

socket.on('products', async (data) => {
  const templateHTML = await fetch('templates/tablaProds.hbs');
  const template = await templateHTML.text();
  const table = Handlebars.compile(template);
  document.getElementById('table').innerHTML = table({products: data});
});