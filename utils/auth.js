var Users = require('../model/users');
const {
    makeToken
} = require('./utils');

/**
 * 检测用户是否存在
 * @param String token 用户名
 * @param Boolean save 是否是保存请求
 * @reurn data 用户信息
 */
let checkToken = async (token, save = false) => {
    return new Promise(async (resolve, reject) => {
        token = await makeToken(token);

        Users.where({
                'token': token
            })
            .fetch({
                columns: ['id', 'username', 'assets']
            })
            .then((user) => {
                // console.log(user);
                if (user) {
                    if (save === true) {
                        resolve(user);
                    } else {
                        let data = user.toJSON();
                        data['status'] = 0;
                        data['message'] = '已登录';
                        resolve(data);
                    }
                } else {
                    resolve({
                        'status': 1,
                        'message': '请登录'
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
    });
};

/**
 * 检测用户是否存在
 * @param String name 用户名
 * @reurn true 用户已存在
 * @reurn false 用户已不存在
 */
let checkUser = async (username) => {
    return new Promise((resolve, reject) => {
        Users.where({
                'username': username
            })
            .fetch()
            .then((user) => {
                if (user) {
                    resolve(true);
                } else {
                    resolve(false);
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
 * 用户个人中心
 * @param String token token
 */
let UserCenter = async (user) => {
    return new Promise((resolve, reject) => {
        if (user) {
            // console.log(user);
            let data = user.toJSON();
            data['status'] = 0;
            data['message'] = '已登录';
            resolve(data);
        }else {
            resolve({
                'status': 1,
                'message': '请登录'
            });
        }
    })
};

module.exports = {
    checkToken,
    checkUser,
    UserCenter
};