var superagent = require('superagent');
// var sleep = require('system-sleep');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // 解决https无法访问的问题
let HttpGet = async (url) => {
  // await sleep(200);
  var ip = Math.floor((Math.random() * 254) + 1) +
    "." + Math.floor((Math.random() * 254) + 1) +
    "." + Math.floor((Math.random() * 254) + 1) +
    "." + Math.floor((Math.random() * 254) + 1);
  // console.log(ip);
  return new Promise(async (resolve, reject) => {
    // console.log(url);
    if (url !== NaN || url !== undefined) {
      superagent.get(url)
        .set("X-Forwarded-For", ip)
        .set({
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3100.0 Safari/537.36",
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        })
        .then((res) => {
          resolve(res.text)
        })
        .catch((e) => {
          console.log(e.message);
          process.exit();
        });
    }
  });
};

module.exports = HttpGet;