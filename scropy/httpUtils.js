var superagent = require('superagent');
var sleep = require('system-sleep');
let HttpGet = async (url) => {
    await sleep(200);
    return new Promise(async(resolve, reject) => {
        // console.log(url);
        if (url !== NaN || url !== undefined) {
            superagent.get(url)
                .set({
                    "User-Agent": "Mozilla/5.0 (Linux; Android 4.0.3; U9200 Build/HuaweiU9200)",
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                })
                .then((res) => {
                    resolve(res.text)
                })
                .catch((e) => {
                    console.log(e,'1');
                });
        }
    });
};

module.exports = HttpGet;