const Ignore = require('../model/ignore');

var saveIgnore = async (url) => {
    let uarr = url.split('/');
    let len = uarr.length - 2;
    let md = parseInt(uarr[len]);
    return new Promise((resolve, reject) => {
        Ignore.forge({
            'ignore_url': md
        }).save()
            .then((ignore) => {
                resolve(ignore.id);
            })
            .catch((error) => {
                console.log(error)
            });
    });
};

var checkIgnore = async (url) => {
    let uarr = url.split('/');
    let len  = uarr.length - 2;
    let md = parseInt(uarr[len]);
    return new Promise((resolve, reject) => {
        Ignore.where({
                'ignore_url': md
            })
            .fetch()
            .then((has) => {
                if(has) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((error) => {
                console.log(error)
            });
    });
};


module.exports = {
    saveIgnore,
    checkIgnore
};