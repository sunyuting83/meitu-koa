const Tags = require('../model/tags');
const Ptags = require('../model/picture_tags.js');
const {
    makeOffset
} = require('./utils');
const {
    get,
    put
} = require('./levledb');
/**
 * 获取Tag多对多数据
 * @param Number id TAG id
 */
getTags = async (id, page, user) => {
    if(page == 1) {
        if (user) {
            makeTagArr(user.id, id);
        };
    };
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
                // console.log(count);
                if (data) {
                    let datas = data.toJSON();
                    if (user && page == 1) {
                        data.save({
                            click_count: parseInt(datas.click_count + 1)
                        });
                    };
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

let makeTagArr = async(user,id) => {
    id = parseInt(id);
    let tagArr = await get(user);
    if (tagArr !== undefined) {
        let hasid = tagArr.findIndex(function (value, index, arr) {
            if(value.id == id) return index;
        });
        // console.log(hasid, tagArr[hasid]);
        if (hasid == -1) {
            tagArr = [...tagArr,{id:id,count:1}];
        }else {
            let id_count = tagArr[hasid].count;
            id_count = id_count + 1;
        };
    }else {
        tagArr = [];
        tagArr = [...tagArr,{id:id,count:1}];
    };
    saveTags(user, tagArr);
};

let saveTags = (user, tagArr) => {
    let array = makeArray(tagArr);
    put(user, tagArr);
    let k = `tagarr:${user}`;
    put(k, array);
}

let makeArray = (arr) => {
    // console.log(arr);
    arr = arr.sort(compare('count'));
    let ar = [];
    for (let i = 0; i < arr.length; i++) {
        const id = arr[i];
        if (i <= 4) {
            ar.push(id.id);
        }
    }
    return ar;
}

/**
 * 按照某个值排序
 */
let compare = (prop) => {
    return function (a, b) {
        var v1 = a[prop];
        var v2 = b[prop];
        return v2 - v1;
    }
};

module.exports = getTags;