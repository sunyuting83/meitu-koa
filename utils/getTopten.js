const Picture = require('../model/picture');
const {
    IgnoreJson
} = require('./utils');

let getTopten = async () => {
    return new Promise((resolve, reject) => {
        Picture.query((qb) => {
                qb.groupBy('picture.id');
            })
            .orderBy('picture.click_count', 'DESC')
            .fetchPage({
                pageSize: 10,
                page: 1,
                withRelated: ['modelgirl', 'tags'],
                columns: ['id', 'title', 'cover', 'girl_id']
            })
            .then(async (data) => {
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

module.exports = getTopten;