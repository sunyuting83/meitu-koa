const crypto = require('crypto');

let makeToken = async (token, spl = false) => {
    var untoken;
    if (spl === true) {
        untoken = token;
        var untoken = new Buffer.from(untoken);
        untoken = untoken.toString('base64');
    }else {
        untoken = token.split(' ')[1];
        untoken = new Buffer.from(untoken, 'base64')
        untoken = untoken.toString();
    }
    return untoken;
};

/**
 * MD5加密
 * @param String str 用户名
 * @param String method 加密类型
 */
let makeMD5 = (str, method) => {
    var md5 = crypto.createHash(method);
    let s = md5.update(str);
    s = md5.digest('hex');
    return s;
};

/**
 * String 转 Array
 * @param String
 * @retrun Array
 */
let StrToArray = (str) => {
    var arr = str.replace(/'\'/g, "");
    arr = arr.replace(/{/g, "[").replace(/}/g, "]");
    arr = JSON.parse(arr);
    return arr;
};

let makeOffset = (page) => {
    let offset = 0;
    if (page === 1 || !page) {
        offset = 0
    } else if (page === 2) {
        offset = 9
    } else {
        offset = (page - 1) * 9
    };
    return offset;
};

let IgnoreJson = (data, status) => {
    let d = data.toJSON();
    for (const i in d) {
        if (d.hasOwnProperty(i)) {
            const list = d[i];
            for (const t in list.tags) {
                if (list.tags.hasOwnProperty(t)) {
                    const element = list.tags[t];
                    delete element._pivot_picture_id
                    delete element._pivot_tag_id;
                }
            };
            if (status === false) {
                delete list.liked;
            };
            delete list.modelgirl.intro;
        }
    };
    return d;
};

module.exports = {
    makeToken,
    makeMD5,
    StrToArray,
    makeOffset,
    IgnoreJson
};