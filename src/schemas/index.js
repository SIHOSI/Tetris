const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Tetris');
    mongoose.set('strictQuery', true);
    console.log('몽고디비 연결 성공.');
  } catch (error) {
    console.log('🚀 ~ file: index.js:7 ~ connect ~ error:', error);
  }
};

mongoose.connection.on('error', (err) => {
  console.log('몽고디비 연결 에러');
  console.log('🚀 ~ file: index.js:14 ~ err:', err);
});

module.exports = connect;
