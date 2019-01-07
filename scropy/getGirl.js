const cheerio = require('cheerio');
var Entities = require('html-entities').XmlEntities; //编码工具
entities = new Entities();
var Modelgirl = require('../model/girl');
var sleep = require('system-sleep');

let getGirl = async (data, gname, url) => {
    var $ = cheerio.load(data);
    var $roots = $('body').find('div.renwu');
    var cover = $roots.children('div.left').children('img').attr('src');
    var $intro = $roots.children('div.right').children('p');
    var int = new Array();

    $intro.each(function (i, p) {
        let n = $(p).html();
        let pn = $(p).text();
        if (pn !== '') {
            var r = n.replace(/<span>/g, '  ').replace(/<\/span>/g, '');
            r = r.replace(/(^\s+)|(\s+$)/g, "");
            r = entities.decode(r);
            int.push(r);
        }
    });
    var sm = $roots.children('div.shuoming').text().replace(/\n/g, '');
    int.push(sm);
    var jsons = {
        'mname': gname,
        'cover': cover,
        'intro': int
    };
    // resolve(jsons);
    // console.log('maked girl json');
    // 如果不存在
    var gid = 1;
    if (url === 'fuckundefinedurl') {
        const girljsons = {
            'mname': gname,
            'cover': '',
            'intro': []
        };
        // console.log(girljsons);
        gid = await checkGirl(girljsons);
    } else {
        // console.log(gjson);
        gid = await checkGirl(jsons);
    };
    return gid;
};

let checkGirl = async (girls) => {
        // console.log(girls.mname);
    return await Modelgirl.where({
            'mname': girls.mname
        })
        .fetch()
        .then(async (has) => {
            if (has) {
                return (has.id);
            } else {
                return await Modelgirl.forge({
                        'mname': girls.mname,
                        'intro': girls.intro,
                        'cover': girls.cover
                    }).save()
                    .then(function (mod) {
                        return (mod.id);
                    });
            }
        });
};

module.exports = {
    getGirl,
    checkGirl
};