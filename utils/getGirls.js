const Modelgirl = require('../model/girl');
const Picture = require('../model/picture');
const {
    makeOffset,
    StrToArray
} = require('./utils');
/**
 * 获取模特及作品数据
 * @param Number id 模特 id
 */
let getGirls = async (id, page) => {
    let offset = makeOffset(page);
    return new Promise((resolve, reject) => {
        Modelgirl.where({
                'id': id
            })
            .fetch({
                withRelated: [{
                    'picture': (qb) => {
                        qb.offset(offset);
                        qb.columns(['picture.girl_id', 'picture.id', 'picture.title', 'picture.cover']);
                        qb.limit(9).orderBy('id', 'DESC');
                    }
                }]
            })
            .then(async (data) => {
                // console.log(id);
                const count = await getGirlsImgCount(id);

                if (data) {
                    let datas = data.toJSON();
                    datas.intro = StrToArray(datas.intro);
                    datas['imgcount'] = count;
                    resolve(datas);
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

let getGirlsImgCount = async (id) => {
    return new Promise((resolve, reject) => {
        Picture.where({
                'girl_id': id
            })
            .count()
            .then((data) => {
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

module.exports = getGirls;