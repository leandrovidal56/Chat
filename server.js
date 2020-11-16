const express = require('express');
const path = require('path');

const app = express();
//definindo protocolo http
const server = require('http').createServer(app);
//definindo protocolo wsl para o socket
const io = require('socket.io')(server);

//definir pasta onde vão ficar arquivos públicos da iplicação 
app.use(express.static(path.join(__dirname, 'public')));
//configuração para definir que estamos usando a view como html
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//para quando acessar o endereço padrão ele renderizar a view htlm
app.use('/', (req, res) => {
  res.render('index.html');
});

// array para armazenar as mensagens 
let messages = [];

// forma de conexão do socket, toda vez que um novo cliente se conectar ao socket, 
// vai receber o socket que acabou de se conectar
io.on('connection', socket => {
  // mostar quando um novo socket for conectado e o id de quem se conectou 
  console.log(`Socket conectado: ${socket.id}`);

  // função para enviar todas as mensagem anteriores quando conectar na aplicação,
  // para não perder as mensagens quando recarregar a tela 
  socket.emit('previousMessages', messages);

  // enviar a mensagem, recebendo o mesmo nome que foi passado no html  
  socket.on('sendMessage', data => {
    // setando as informações no array de messages 
    messages.push(data);
    // comunicação para receber as informações informado pelo outro chat
    socket.broadcast.emit('receivedMessage', data);
  });
});
//usar a porta 3000 local 
server.listen(3000);