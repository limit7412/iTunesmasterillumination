// シャッフルする奴
function shuffle(ary) {
  let lng = ary.length;

  for (let i = lng - 1 ; i > 0; i--) {
    const random = Math.floor(Math.random()*(i+1));

    const tmp = ary[i];
    ary[i] = ary[random];
    ary[random] = tmp;
  }

  return ary;
}

(function(){
  const socket = io();
  // 疎通確認
  socket.on('connected', (data) => {
    console.log(data.msg);
  });

  document.addEventListener('DOMContentLoaded', () => {
    // カラーコードを取得
    socket.on('sendCode', (imputCode) => {
      // 入ってきた配列をシャッフル
      const colorCode = shuffle(imputCode);
      console.log(colorCode);

      const lng = colorCode.length;
      const colorsRate  = 100 / lng;

      // cssににぶち込むための準備
      let colorsSeparate = [];

      for (var i = 0; i < lng; i++) {
        const startRate = colorsRate * i;
        const endRate = colorsRate * ( i + 1 );
        const inputString = `${colorCode[i]} ${startRate}%, ${colorCode[i]} ${endRate}%`;
        colorsSeparate.push(inputString);
      }

      const colorsToDisplay = colorsSeparate.join(",");

      // jqueryでcssににぶち込む
      $('#background').css('background-image',`linear-gradient(to right, ${colorsToDisplay})`);
    });
  });
})();
