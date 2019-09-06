const HttpGet = require('./httpUtils');
const cheerio = require('cheerio');
var sleep = require('system-sleep');
const {
    getGirl,
    checkGirl
} = require('./getGirl');

const {
    saveIgnore,
    checkIgnore
} = require('./saveInore');
const {
    savePicture
} = require('./savePicture');
const makeNewArr = require('./cgdata');

let getNav = async(id) => {
    // let urlList = makeUrl();
    const url = `https://www.meituri.com/a/${id}/`;
    let checkPic = await checkIgnore(url);
    if (checkPic === false) {
        getPic(url);
    } else {
        process.exit();
    };
};

let makeUrl = async() => {
    for (let i = 1; i < 19018; i++) {
        const url = `https://www.meituri.com/a/${i}/`;
        // urList.push(url)
        let checkPic = await checkIgnore(url);
        if (checkPic === false) {
            console.log('3');
            getPic(url);
        } else {
            console.log('44');
            console.log(checkPic);
            process.exit();
        };
    };
};

let getPic = (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            let getdata = await HttpGet(url);
            let picSave = await createPicJson(getdata, url);
            resolve(picSave);
        } catch (error) {
            console.log(error);
        };
    });
}

let createPicJson = (data,url) => {
    console.log(url);
    return new Promise(async (resolve, reject) => {
        let thisurl = url;
        let $ = cheerio.load(data);
        let title = $('body').find('div.weizhi').children('h1').text();

        let cover = $('body').find('div.content').children('img').first().attr('src');

        let $thisP = $('body').find('div.tuji').children('p');

        // 查找DOM所有的P标签，找出包含图片数量和模特信息的dom所在节点的位置。
        let contIndex,grilIndex;
        $thisP.each(function (index, element) {
            let test = $(element).text();
            if (test.indexOf('数量') > 0) { 
                contIndex = index
            } else if (test.indexOf('模特') > 0) {
                grilIndex = index
            };
        });
        // console.log(contIndex,grilIndex);
        let imgcont = $('body').find('div.tuji').children('p').eq(contIndex).text();
        imgcont = imgcont.split('：')[1].replace('P', '');
        imgcont = parseInt(imgcont);

        let $tagls = $('body').find('div.fenxiang_l').children('a');
        let tags = [];

        let $girl = $('body').find('div.tuji').children('p').eq(grilIndex);
        let girlls = $girl.children('a');
        var girl;
        var girlurl = 'fuckundefinedurl';
        if (girlls.length === 0) {
            girl = $girl.text();
            girl = girl.split('：')[1];
        } else if (girlls.length === 1) {
            girl = $girl.children('a').text();
            girlurl = $girl.children('a').attr('href');

        } else if (girlls.length > 1) {
            girl = $girl.children('a').first().text();
            girlurl = $girl.children('a').first().attr('href');
        };
        girl = girl.replace(/(^\s+)|(\s+$)/g, "");

        if (girl === undefined || girl == '') {
            girl = '未知';
        };
        if (girlurl === undefined || girlurl == '') {
            girlurl = 'fuckundefinedurl';
        };
        $tagls.each(function (i, tag) {
            let t = $(tag).text();
            tags.push(t);
        });
        let imglist = [];
        let imgrooturl = makeImgRootUrl(cover);
        for (let i = 1; i <= imgcont; i++) {
            imglist.push(imgrooturl + i + '.jpg');
        };
        // console.log(title, cover, imgcont, tags, imglist, girlurl, girl);
        // let girlid = await denf.getGirl(girlurl, girl);
        // 制造图片二元数组
        var imgcontent = new Array();
        const lens = imgcont;
        let num = 10; //假设每行显示4个
        let lineNum = lens % num === 0 ? lens / num : Math.floor((lens / num) + 1);

        for (let i = 0; i < lineNum; i++) {
            // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
            let temp = imglist.slice(i * num, i * num + num);
            imgcontent.push(temp);
        };
        // let checkPic = await checkIgnore(thisurl);
        // if (checkPic === false) {
        //     await sleep(1000 * 30);
        //     imgcontent = await makeNewArr(imgcontent);
        // };
        sleep(1000 * 30);
        imgcontent = await makeNewArr(imgcontent);
        imgcontent = JSON.stringify(imgcontent);
        // console.log(imgcont,imgcontent);
        // 模特信息检测，入库操作之后，进行图集信息入库
        let jdata = {
            'jsons': {
                'title': title,
                'cover': cover,
                'img_count': imgcont
            },
            'imgcontent': imgcontent,
            'tags': tags,
            'thisurl': thisurl,
            'girlurl': girlurl,
            'girl': girl
        };
        // console.log(jdata);
        // resolve(jdata);
        // 检测模特

        try {
            var girlPage = '';
            if (girlurl !== 'fuckundefinedurl') {
                girlPage = await HttpGet(girlurl);
            };

            const gid = await getGirl(girlPage, girl, girlurl);
            // console.log(gid);
            let picD = await saveData(jdata, gid);
            console.log(picD.id + '...' + picD.attributes.title + ' is Done!');
            resolve(picD);
            process.exit();
        } catch (error) {
            console.log(error)
        }
    });
}

let saveData = async (data, gid) => {
    // 检测图片详情页是否在忽略列表
    let checkPic = await checkIgnore(data.thisurl);
    if (checkPic === false) {
        // console.log('3');
        // 入库
        var piContent = await savePicture(data.jsons, data.imgcontent, data.tags, gid);
        await saveIgnore(data.thisurl);
        return (piContent);
    } else {
        return ({
            'id': 0,
            'attributes': {
                'title': '已采集'
            }
        });
    };
};

let makeImgRootUrl = function (url) {
    let ul = url.split('.jpg')[0];
    ul = ul.split('/');
    // 删除数组最后一个
    var m = ul.slice();
    m.pop();
    // 合并成网址
    let iurl = m.join('/');
    iurl = iurl + '/'
    return iurl;
};

var id = process.argv.splice(2);
getNav(id)