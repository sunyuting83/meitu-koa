const {get, put} = require('./levledb');

async function makeTags(user,tags) {
    let oldArray = await get(user);
    if(oldArray === undefined) {
        oldArray = []
    }else {
        oldArray = oldArray;
    };
    // console.log(oldArray);
    let newA = makeTagsList(tags);
    let checks = checkArr(oldArray, newA);
    let array = makeArray(checks);
    let v = checks;
    put(user,v);
    let k = `tagarr:${user}`;
    let uv = array;
    put(k, uv);
    // console.log(checks);
}

function makeTagsList(arr) {
    arr.forEach(i => {
        delete i.tags;
        delete i._pivot_picture_id;
        delete i._pivot_tag_id;
        i.count = 1;
    });
    return arr;
}

function checkArr(oldArray, newArray) {
    // 比对两个数组，相同的数组点击+1
    oldArray.forEach(item => {
        if (newArray.some(it => it.id === item.id)) {
            item.count = item.count + 1
        }
    });
    // 对比两个数组，有新元素加入到旧数组
    newArray.forEach(item => {
        if (oldArray.every(it => it.id !== item.id)) {
            oldArray = [...oldArray, item]
        }
    });
    return oldArray;
}

function makeArray(arr) {
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
function compare(prop) {
    return function (a, b) {
        var v1 = a[prop];
        var v2 = b[prop];
        return v2 - v1;
    }
}

module.exports = makeTags;