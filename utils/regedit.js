var Users = require('../model/users');
const {
    checkUser
} = require('./auth');
const {
    makeToken,
    makeMD5
} = require('./utils');
/**
 * 用户注册
 * @param String name 用户名
 * @param String password 密码
 */
let Regedit = async (username, password) => {
    return new Promise((resolve, reject) => {
        checkUser(username)
            .then(async (status) => {
                if (status) {
                    resolve({
                        'status': 1,
                        'message': '用户已存在'
                    });
                } else {
                    await SaveUser(username, password)
                        .then((data) => {
                            if (data) resolve(data);
                        })
                }
            })
            .catch((err) => {
                reject({
                    'status': 5,
                    'message': '数据库发生错误'
                });
            });
    })
};


/**
 * 添加新用户
 * @param String name 用户名
 * @param String password 密码
 */
let SaveUser = async (username, password) => {
    return new Promise(async (resolve, reject) => {
        if (username.length < 6) {
            resolve({
                'status': 6,
                'message': '用户名必须大于6个字'
            })
        } else if (password.length < 8) {
            resolve({
                'status': 6,
                'message': '密码必须大于8个字'
            })
        } else {
            const mps = await makeMD5(password, 'md5');
            const token = await makeMD5(username + mps, 'RSA-SHA256');
            let untoken = await makeToken(token, true);
            Users.forge({
                    'username': username,
                    'password': mps,
                    'token': token,
                    'status': true,
                    'assets': 0
                })
                .save()
                .then((data) => {
                    if (data) {
                        resolve({
                            'status': 0,
                            'message': '注册成功',
                            'token': untoken
                        })
                    };
                })
                .catch((err) => {
                    reject({
                        'status': 5,
                        'message': '数据库发生错误'
                    });
                })
        }
    })
};

module.exports = Regedit;