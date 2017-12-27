// Promiseの準備
const promiseBase = (() => {
  return new Promise((resolve, reject) => {
    resolve();
  });
})();
module.exports = promiseBase;
