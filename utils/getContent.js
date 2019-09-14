const Picture = require('../model/picture');
const makeTags = require('./tagdata');
const _ = require('lodash');
/**
 * 获取详情数据
 * @param Number id 详情id
 * @param Boolean status 登录状态
 */
let getContent = async (id, user) => {
    return new Promise((resolve, reject) => {
        var status;
        if(user) {
            status = true;
        } else {
            status = false;
        };
        Picture.where({
                'id': id
            })
            .fetch({
                columns: ['id', 'click_count'],
                withRelated: [
                    'images',
                    'tags',
                    'liked', {
                        'liked': (qb) => {
                            if (status === true) {
                                qb.where('user_id', user.id)
                            }
                        }
                    }
                ]
            })
            .then(async (data) => {
                if (data) {
                    /**
                     * 大坑。注意先要把数据转换成json再加1 入库
                     */
                    let jdata = data.toJSON();
                    // console.log(jdata.tags);
                    if (status === true) {
                        data.save({
                            click_count: parseInt(jdata.click_count + 1)
                        });
                        makeTags(user.id,jdata.tags);
                    };
                    let ContentData = makeContentJson(data, status);
                    resolve(ContentData);
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
 * 制造详情页数据
 * @param {Object} data 传入的数据
 * @param Boolean status 登录状态
 */
let makeContentJson = (data, status) => {
    var d = data.toJSON();
    delete d.images.id;
    delete d.images.picture_id;
    delete d.tags;
    // var imglist = StrToArray(d.images.content);
    var imglist = JSON.parse(d.images.content);
    imglist = _.flatten(imglist, true);
    // console.log(imglist);
    imglist.forEach(i => {
        i.uri = i.url;
        delete i.url;
        i['dimensions'] = {
            width: i.width,
            height: i.height
        };
        delete i.width;
        delete i.height;
        // console.log(i);
    });
    d.login = 0;
    if (status === false) {
        imglist = _.take(imglist, 10);
        d.login = 1;
        delete d.liked;
    };
    d['images']['content'] = imglist;
    d = {...d,count: imglist.length}
    return d;
};

module.exports = getContent;