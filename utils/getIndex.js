const Picture = require('../model/picture');
const {
    IgnoreJson
} = require('./utils');
/**
 * 获取首页数据，列出最新的5条
 * @param String p 页数
 */
let getIndex = async (p, user) => {
    var status;
    if (user) {
        status = true;
    } else {
        status = false;
    };
    return new Promise((resolve, reject) => {
        Picture.query((qb) => {
                qb.groupBy('picture.id');
            })
            .orderBy('picture.id', 'DESC')
            .fetchPage({
                pageSize: 5,
                page: p,
                withRelated: [
                    'modelgirl',
                    'tags',
                    'liked', {
                        'liked': (qb) => {
                            if (status === true) {
                                qb.where('user_id', user.id)
                            }
                        }
                    },
                ],
                columns: ['id', 'title', 'cover', 'girl_id']
            })
            .then(async(data) => {
                if (data) {
                    let indexData = await IgnoreJson(data, status);
                    resolve(indexData);
                }
            })
            .catch((err) => {
                // console.log(err);
                reject({
                    'status': 5,
                    'message': '数据库发生错误'
                });
            });
    })
};

module.exports = getIndex;
