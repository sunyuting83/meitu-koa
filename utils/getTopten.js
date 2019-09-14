const Picture = require('../model/picture');
const Modelgirl = require('../model/girl');
const Tags = require('../model/tags');
const {
    IgnoreJson
} = require('./utils');

let getTopten = async () => {
    let picture = await getPicture();
    let model = await getModel();
    let tags = await getTags();
    let data = {
        picture: picture,
        model: model,
        tags: tags
    };
    return data;
};

let getPicture = async () => {
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

let getModel = async () => {
    return new Promise((resolve, reject) => {
        Modelgirl.query((qb) => {
                qb.groupBy('girl.id');
            })
            .orderBy('girl.click_count', 'DESC')
            .fetchPage({
                pageSize: 20,
                page: 1,
                columns: ['id', 'mname', 'cover']
            })
            .then(async (data) => {
                if (data) {
                    resolve(data);
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

let getTags = async () => {
    return new Promise((resolve, reject) => {
        Tags.query((qb) => {
                qb.groupBy('tags.id');
            })
            .orderBy('tags.click_count', 'DESC')
            .fetchPage({
                pageSize: 40,
                page: 1,
                columns: ['id', 'tags']
            })
            .then(async (data) => {
                if (data) {
                    resolve(data);
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