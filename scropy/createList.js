const HttpGet = require('./httpUtils');
const cheerio = require('cheerio');
// var sleep = require('system-sleep');
const {
    sum,
    sleep
} = require('./utils');
const createPicture = require('./createPicture');

var rooturl = 'https://www.meituri.com/';

var listurl = [
    'zhongguo/10',
    'riben/10',
    'taiwan/10',
    'hanguo/3',
    'oumei/10',
    'taiguo/10'
];

let createList = () => {
    return new Promise(async(resolve, reject) => {
    // console.log('start');
        try {
            await sleep(sum(500, 800));
            console.log('1');
            let Allist = makelist();
            console.log('2');
            let GetList = await getList(Allist);
            console.log('3');
            console.log(GetList);
            resolve(true);
            // 以下内容吧 好似有问题。
            // getList(Allist).then((result) => {
            //     if (result) {
            //         resolve(true);
            //     };
            // }).catch((err) => {
            //     console.log(err)
            // });
        } catch (error) {
            console.log(error);
        };
    });
};

let makelist = () => {
    // 先做所有列表页的url数组
    var listurls = [];
    for (let i = 0; i < listurl.length; i++) {
        let page = listurl[i].split('/');
        let fl = page[0];
        let pg = page[1];
        let url = fl + '/';
        let urllist = [url];
        for (let i = 2; i <= pg; i++) {
            let u = url + i + '.html';
            urllist.push(u);
        };
        listurls.push(urllist);
    };
    // console.log(listurls);
    return listurls;
};

let getList = async (urlist) => {
    // console.log(data);
        console.log('4');
        let rt = [];
        for (const i in urlist) {
            if (urlist.hasOwnProperty(i)) {
                const url = urlist[i];
                try {
                    await sleep(sum(500, 800));
                    let AllData = await createListData(url);
                    
                    rt.push(AllData);
                    // if (i === len) {
                    //     resolve(AllData);
                    // }
                    // createListData(url).then((result) => {
                    //     if (i === urlist.length) {
                    //             resolve(result);
                    //         }
                    // }).catch((err) => {
                    //     console.log(err)
                    // });
                    // resolve(url);
                } catch (error) {
                    console.log(error);
                };
            }
        };
        return rt;
};


let createListData = async (urlist) => {
    return new Promise(async (resolve, reject) => {
        // console.log('5');
        for (let i = urlist.length; i >= 0; i--) {
            if (urlist[i] !== undefined || urlist[i] == 'undefined') {
                let lurl = rooturl + urlist[i];
                const pics = await createPicture(lurl);
                resolve(pics);
                
                
                // createPicture(lurl).then((result) => {
                //     resolve(result);
                // }).catch((err) => {
                //     console.log(err)
                // });
            };
        };
    });
};

module.exports = createList;