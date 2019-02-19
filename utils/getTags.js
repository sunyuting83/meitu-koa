const Tags = require('../model/tags');
const Ptags = require('../model/picture_tags.js');
const {
    makeOffset
} = require('./utils');
/**
 * 获取Tag多对多数据
 * @param Number id TAG id
 */
getTags = async (id, page) => {
    let offset = makeOffset(page);
    return new Promise((resolve, reject) => {
        Tags.forge({
                'id': id
            })
            .fetch({
                withRelated: ['picture.tags', 'picture.modelgirl', {
                    'picture': (qb) => {
                        qb.offset(offset);
                        qb.limit(9)
                            .orderBy('picture.id', 'DESC');
                    }
                }],
                columns: ['id']
            })
            .then(async (data) => {
                const count = await getTagsCount(id);
                console.log(count);
                if (data) {
                    let datas = data.toJSON();
                    datas = makeJson(datas);
                    datas['tagcount'] = count;
                    resolve(datas);
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

makeJson = (json) => {
    for (const i in json.picture) {
        if (json.picture.hasOwnProperty(i)) {
            const picls = json.picture[i];
            delete picls.modelgirl.intro;
            delete picls._pivot_picture_id;
            delete picls._pivot_tag_id;
            for (const t in picls.tags) {
                if (picls.tags.hasOwnProperty(t)) {
                    const element = picls.tags[t];
                    delete element._pivot_picture_id
                    delete element._pivot_tag_id;
                }
            };
        }
    };
    return json;
}

getTagsCount = async (id) => {
    return new Promise((resolve, reject) => {
        Ptags.where({
                'tag_id': id
            })
            .count('tag_id')
            .then((data) => {
                if (data) {
                    // console.log(data);
                    // const c = data.toJSON();
                    // const nb = c.picture[0]['count(*)'];
                    resolve(data);
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

module.exports = getTags;