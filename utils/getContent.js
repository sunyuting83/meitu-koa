const Picture = require('../model/picture');
const {
    StrToArray
} = require('./utils');

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
                    if (status === true) {
                        data.save({
                            click_count: parseInt(jdata.click_count + 1)
                        });
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
    var imglist = StrToArray(d.images.content);
    if (status === false) {
        imglist = [imglist[0]];
        delete d.liked;
    };
    d['images']['content'] = imglist;
    return d;
};

module.exports = getContent;