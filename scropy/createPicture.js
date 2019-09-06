const HttpGet = require('./httpUtils');
const cheerio = require('cheerio');
var sleep = require('system-sleep');
const {
    sum
} = require('./utils');
const {
    saveIgnore,
    checkIgnore
} = require('./saveInore');
const {
    savePicture
} = require('./savePicture');
const {
    getGirl,
    checkGirl
} = require('./getGirl');
const makeNewArr = require('./cgdata');

let createPicture = async (url) => {
    return new Promise(async (resolve, reject) => {
        // console.log('6');
        // sleep(sum(3800));
        try {
            let getdata = await HttpGet(url);
            let picSave = await createPicJson(getdata);
            resolve(picSave);
            // createPicJson(getdata, url).then((picSave) => {
            //     console.log(picSave.id + '...' + picSave.attributes.title + ' is Done!');
            //     resolve(picSave);
            // }).catch((err) => {
            //     console.log(err)
            // });
        } catch (error) {
            console.log(error);
        };
    });
};

var createPicJson = (data) => {
    // console.log(url);
    // console.log('7');
    return new Promise(async (resolve, reject) => {
        // console.log('gbook');
        var $ = cheerio.load(data);
        var $list = $('body').find('div.hezi').eq(1).children('ul').children('li');
        let len = $list.length;
        len = len - 1;
        $list.each(async function (index, element) {
            // console.log(index);
            let thisurl = $(element).find('p.biaoti').children('a').attr('href');
            let imgcont = $(element).find('span.shuliang').text().replace('P', '');
            imgcont = parseInt(imgcont);
            let title = $(element).find('p.biaoti').children('a').text();
            let cover = $(element).find('a').first().children('img').attr('src');
            let $tagls = $(element).find('p').eq(2).children('a');
            let tags = [];

            let $girl = $(element).find('p').eq(1);
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
            let checkPic = await checkIgnore(thisurl);
            if (checkPic === false) {
                await sleep(1000 * 30);
                imgcontent = await makeNewArr(imgcontent);
            };
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
            // 检测模特
            
            try {
                var girlPage = '';
                if (girlurl !== 'fuckundefinedurl') {
                    girlPage = await HttpGet(girlurl);
                };
                
                const gid = await getGirl(girlPage, girl, girlurl);
                let picD = await saveData(jdata, gid);
                console.log(picD.id + '...' + picD.attributes.title + ' is Done!');
                resolve(picD);
            } catch (error) {
                console.log(error)
            }
            
        });
    });
};

let saveData = async (data, gid) => {
    // 检测图片详情页是否在忽略列表
        let checkPic = await checkIgnore(data.thisurl);
        if (checkPic === false) {
            // console.log('3');
            // 入库
            var piContent = await savePicture(data.jsons, data.imgcontent, data.tags, gid);
            await saveIgnore(data.thisurl);
            return (piContent);
        }else {
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


module.exports = createPicture;