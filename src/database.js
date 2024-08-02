const mongoose = require('mongoose');

//mongoose.connect('mongodb://127.0.0.1:27017/taskstraker')
mongoose.connect('mongodb://0.0.0.0:27017/api-registro_vales')

//mongoose.connect('mongodb+srv://fontalvomejiajosedavid54:lTsXHfFcCmQviYPh@api-node-tasktraker.mpnpcsj.mongodb.net/?retryWrites=true&w=majority&appName=api-node-tasktraker')


    .then(() => console.log('🌟 Database is Connected'))
    .catch(err => console.error('❌ Error connecting to the database:', err));