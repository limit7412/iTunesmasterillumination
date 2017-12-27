const itunes = require('playback');
const priorConfirmation = require('../lib/priorConfirmation');
const colorCodeAcquisition = require('../lib/colorCodeAcquisition');

// カラーコードAPI用
const colorCodeAPI = {
  path:  './json/coler_code.json',
  URL: 'http://api.imas-db.jp/character/color_code',
  qs: {format: 'list'}
};

// キャラクターAPI用
const lookupAPI = {
  path:  `./json/class_name.json`,
  URL: 'http://api.imas-db.jp/character/lookup',
  qs: (name) => { return {name: `${name}`}; }
};

const socketCommunication = (server) => {
  const io = require('socket.io').listen(server);

  // 事前確認
  priorConfirmation(colorCodeAPI, lookupAPI);

  // ソケット
  io.sockets.on('connection', (socket) => {
    // 疎通チェック
    let data = {msg: `接続: ${socket.id}`}
    console.log(data.msg);
    socket.emit('connected', data);

    // itunesで曲が再生されたら
    itunes.on('playing', (data) => {
      colorCodeAcquisition(colorCodeAPI, lookupAPI, data, (code) => {
        // カラーコードをSocketで送りつける
        socket.broadcast.emit('sendCode', code);
      });
    });
  });
};
module.exports = socketCommunication;
