const fs = require('fs');
const getAPI = require('../lib/imasDbGet');
const jsonAccess = require('../lib/jsonAccess');

const priorConfirmation = (colorCodeAPI,lookupAPI) => {
  // カラーコードのリストを取得 by アイマスDB
  jsonAccess(colorCodeAPI.path, () => {
    // ローカルにファイルがなければアイマスDBのAPIから取得
    getAPI(colorCodeAPI.URL, colorCodeAPI.qs, (err) => {
      console.log(err);
    },(data) => {
      // 結果はローカルに保持
      const getJson = data.color_code_list;
      fs.writeFile(colorCodeAPI.path, JSON.stringify(getJson, '', ' '));
    });
  });
  // class_name.jsonの存在チェック
  jsonAccess(lookupAPI.path, () => {
    // ローカルにファイルがなければ空データを生成
    fs.writeFile(lookupAPI.path, JSON.stringify('', '', ' '));
  });
};
module.exports = priorConfirmation;
