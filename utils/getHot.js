const Picture = require('../model/picture');
const {
    IgnoreJson
} = require('./utils');
const {get} = require('./levledb');
/**
 * 获取首页数据，列出最新的5条
 * @param String p 页数
 */
/**
 * 包含这些TAG的所有数据sql
 select distinct on(a.id) a.*
 from picture a
 join picture_tags pt on pt.picture_id = a.id
 where pt.tag_id in (1, 3, 5, 125)
 group by a.id
 order by a.id
 limit 12
 offset 0;
 */
let getHotList = async (p, user) => {
    var taglist;
    // console.log(user);
    if (user) {
        let ts = await get(`tagarr:${user.id}`);
        if (ts === undefined) {
            taglist = [34, 38, 41, 47, 53];
        }else if(ts.length < 4) {
            taglist = [34, 38, 41, 47, 53];
        }else {
            // console.log(ts);
            taglist = ts;
        }
    } else {
        taglist = [34,38,41,47,53];
    };
    return new Promise((resolve, reject) => {
        Picture.query((qb) => {
                qb.innerJoin('picture_tags', 'picture.id', 'picture_tags.picture_id')
                qb.groupBy('picture.id')
                qb.where('picture_tags.tag_id', 'in', taglist)
            })
            .orderBy('picture.id', 'DESC')
            .fetchPage({
                pageSize: 12,
                page: p,
                withRelated: ['modelgirl', 'tags'],
                columns: ['picture.id', 'title', 'cover', 'girl_id']
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