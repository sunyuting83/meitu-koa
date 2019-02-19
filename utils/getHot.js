const Picture = require('../model/picture');
const {
    IgnoreJson
} = require('./utils');
/**
 * 获取首页数据，列出最新的5条
 * @param String p 页数
 */
let getHotList = async (p) => {
    return new Promise((resolve, reject) => {
        Picture.query((qb) => {
                qb.groupBy('picture.id');
            })
            .orderBy('picture.click_count', 'DESC')
            .fetchPage({
                pageSize: 12,
                page: p,
                withRelated: ['modelgirl', 'tags'],
                columns: ['id', 'title', 'cover', 'girl_id']
            })
            .then(async(data) => {
                if (data) {
                    let hotData = await IgnoreJson(data, false);
                    resolve(hotData);
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

module.exports = getHotList;