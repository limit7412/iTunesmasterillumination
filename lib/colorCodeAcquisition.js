const fs = require('fs');
const getAPI = require('../lib/imasDbGet');
const jsonAccess = require('../lib/jsonAccess');
const promiseBase = require('../lib/promiseBase');

const colorCodeAcquisition = (colorCodeAPI, lookupAPI, data, callback) => {
  promiseBase.then(() => { return new Promise((resolve, reject) => {
    // アイドル名保管用
    let idolName = [];
    // 比較用の名前リスト保管用
    let nameList = [];
    // クラスと色を紐付け紐付ける情報
    let classJson = JSON.parse(fs.readFileSync(lookupAPI.path, 'utf8'));


    // アーティスト情報を配列化
    let playingName = data.artist.split(/,|、/);

    // 例外 765PROALLSTARS
    if ( playingName[0] === '765PROALLSTARS' || playingName[0] === '765PRO ALLSTARS' ) {
      playingName = [ '天海春香','星井美希','如月千早','高槻やよい',
                      '萩原雪歩','菊地真','双海亜美','双海真美','水瀬伊織',
                      '三浦あずさ','四条貴音','我那覇響','秋月律子' ];
    }
    console.log(playingName);

    // CV名除去
    playingName.forEach( (imputName) => {
      const convertName = imputName.replace(/ /g, '').replace(/\(.+?\)/g, '');
      idolName.push(convertName);
    });

    // ローカルのデータから名前を抽出
    classJson.forEach( (list) => {
      nameList.push(list.name);
    });
    console.log(idolName);

    // ローカルのデータにデータが無い場合APIから取得 by アイマスDB
    idolName.filter( (name) => {
      return nameList.indexOf(name) == -1;
    }).forEach( (name) => {
      // APIから取得
      getAPI(lookupAPI.URL,  lookupAPI.qs(name), (err) => {
        reject(err);
      },(data) => {
        // クラス名を取り出して配列に入れる
        const className = data.character_list[0].class_name;
        const pushData = { name: name, class_name: className };
        classJson.push(pushData);

        // 結果をローカルに保持
        fs.writeFile(lookupAPI.path, JSON.stringify(classJson, '', ' '));
      });
    });
    resolve(idolName);
  })}).then((idolName) => {
    // クラス名保管用
    let idolclass = [];
    // カラーコード保管用
    let colorCode = [];

    // クラスと色を紐付け紐付ける情報
    const classJson = JSON.parse(fs.readFileSync(lookupAPI.path, 'utf8'));
    // カラーコードのリストをローカルから
    const colorCodeList = JSON.parse(fs.readFileSync(colorCodeAPI.path, 'utf8'));

    // ローカルのデータからクラス名を取得
    classJson.filter( (list) => {
      return idolName.indexOf(list.name) >= 0 ;
    }).forEach( (list) => {
      idolclass.push(list.class_name);
    });
    console.log(idolclass);

    // 取得したアイドルのクラス名に対応するカラーコードを取得
    colorCodeList.filter( (list) => {
      return idolclass.indexOf(list.class_name) >= 0 ;
    }).forEach( (list) => {
      colorCode.push(list.color_code);
    });
    console.log(colorCode);

    callback(colorCode);
  }).catch((error) => {
    // エラー
    console.error(error);
  });
};
module.exports = colorCodeAcquisition;
