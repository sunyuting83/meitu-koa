var level = require('level');
var path = require('path');
// db 是用户leveldb表
var db = level(path.join(__dirname, '../TagDB'), {
    valueEncoding: "json"
});

let put = (k, v) => {
    return new Promise(function (resolve, reject) {
        db.put(k, v, function (err) {
            // if (err) resolve (false)
            resolve(true)
        });
    });
};


let get = (k) => {
    return new Promise(function (resolve, reject) {
        db.get(k, function (err, value) {
            // if (err) console.log(err);
            resolve(value)
        });
    });
};

//删除
let del = (key) => {
    return new Promise(function (resolve, reject) {
        if (key) {
            db.del(key, (error) => {
                resolve(true)
            })
        } else {
            resolve('no key');
        }
    });
};

module.exports = {
    put,
    get,
    del
};