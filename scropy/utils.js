var crypto = require('crypto'); //MD5

let makeMD5 = async (str) => {
    return new Promise((resolve, reject) => {
        var md5 = crypto.createHash("md5");
        let s = md5.update(str);
        s = md5.digest('hex');
        resolve(s)
    });
};
let sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve()
        }, time)
    })
};
let sum = (m, n) => { //取随机数函数
    var num = Math.floor(Math.random() * (m - n) + n);
    return (num)
};


module.exports = {
    makeMD5,
    sum,
    sleep
};