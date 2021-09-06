const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')

app.use(cors());
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

const Message = mongoose.model('Message', {
  name: String,
  message: String
});

const dbUrl = 'mongodb+srv://sleeppetz:sleeppetz@cluster0.edsrj.mongodb.net/simple-chat?retryWrites=true&w=majority';

app.get('/messages', async (req, res) => {
  const messages = await Message.find();

  return res.json(messages);
});

app.get('/messages/:user', async (req, res) => {
  const { user } = req.params;
  const messages = await Message.find({ user });
  return res.json(messages);
});

app.post('/messages', async (req, res) => {
  try {    
    const savedMessage = await Message.create({ name: req.body.name, message: req.body.message });
    const hellos = ['ola', 'olá', 'oi', 'oii', 'oiii']

    io.emit('message', req.body);
    

    if(hellos.includes(req.body.message.toLowerCase())){
      const botMessage = await Message.create({ name: 'Bot', message: `Olá ${req.body.name}`});      
      io.emit('message', { name: botMessage.name, message: botMessage.message})
    }    
    
    return res.status(200).json(savedMessage);
  } catch (error) {
    console.log('error', error);
    return res.status(500).json();
  }
});

io.on('connection', () => {
  console.log('a user is connected');
});

mongoose.connect(dbUrl, {}, (err) => {
  console.log('mongodb connected', err);
});

const server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});
