var Users = require('../model/users');
const {
    makeToken,
    makeMD5
} = require('./utils');
const {
    checkUser
} = require('./auth');
/**
 * 用户登录
 * @param String name 用户名
 * @param String password 密码
 */
let Login = async (username, password) => {
    return new Promise((resolve, reject) => {
        checkUser(username)
            .then(async (status) => {
                if (status) {
                    Logined(username, password)
                        .then((data) => {
                            resolve(data);
                        })
                } else {
                    resolve({
                        'status': 1,
                        'message': '用户不存在'
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                reject({
                    'status': 5,
                    'message': '数据库发生错误'
                });
            });
    })
};
/**
 * 用户登录
 * @param String name 用户名
 * @param String password 密码
 */
let Logined = async (username, password) => {
    const mps = await makeMD5(password, 'md5');
    return new Promise((resolve, reject) => {
        Users.where({
                'username': username,
                'password': mps
            })
            .fetch({
                columns: ['username', 'token', 'assets']
            })
            .then(async(user) => {
                if (user) {
                    var data = user.toJSON();
                    data['status'] = 0;
                    data['message'] = '登录成功';
                    var untoken = await makeToken(data.token, true);
                    data['token'] = untoken;
                    resolve(data);
                } else {
                    resolve({
                        'status': 3,
                        'message': '密码错误'
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                reject({
                    'status': 5,
                    'message': '数据库发生错误'
                });
            });
    })
};

module.exports = Login;