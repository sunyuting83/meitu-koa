const createList = require('./createList');
const {
    sleep,
    sum
} = require('./utils');

let scrapy = () => {
    return new Promise(async(resolve, reject) => {
        // 爬取首页，列表页，制造分类的分页url
        await sleep(sum(500,800));
        console.log('start');
        const aListUrl = await createList();
        resolve(aListUrl);
    });
};

// var arguments = process.argv.splice(2);
scrapy().then((data) => {
    console.log('采集完成');
    if (data === true) {
        // process.exit();
    }
});
