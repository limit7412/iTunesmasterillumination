// ローカルのjson読むやつ
const fs = require('fs');
const jsonAccess = (jsonPath, callback) => {
  fs.access(jsonPath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        callback();
      } else {
        console.error(err);
        process.exit(1);
      }
    }
  });
};
module.exports = jsonAccess;
