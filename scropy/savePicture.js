const Picture = require('../model/picture');
const Girl = require('../model/girl');
var sleep = require('system-sleep');

var savePicture = async (jsons, imgurl, tags, modid) => {
    return new Promise((resolve, reject) => {
        jsons['girl_id'] = modid;
        Picture.forge(jsons)
            .save()
            .then(async (picture) => {
                var img = await picture.addImg(imgurl);
                for (const tag in tags) {
                    if (tags.hasOwnProperty(tag)) {
                        const t = tags[tag];
                        await sleep(300);
                        var tsave = await picture.addTags(t);
                    }
                };
                return picture;
            })
            .then((picture) => {
                resolve(picture);
            })
            .catch((error) => {
                console.log(error,'2')
            });
    });
};

var saveGirl = (data) => {
    return new Promise(async (resolve, reject) => {
        await Girl.forge(data)
            .save()
            .then((picture) => {
                if (picture) resolve(picture.id);
            })
            .catch((error) => {
                console.log(error,'3');
            });
    });
};

module.exports = {
    savePicture,
    saveGirl
};