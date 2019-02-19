var url = require('url');
var https = require('https');

var sizeOf = require('image-size');
/**
 * 获取远程图片尺寸
 * @param String imgUrl 图片url
 * @return Json {height, width, type}
 */
let getImgSize = async (imgUrl) => {
    return new Promise((resolve, reject) => {

        var options = url.parse(imgUrl);

        https.get(options, function (response) {
            var chunks = [];
            response.on('data', function (chunk) {
                chunks.push(chunk);
            }).on('end', function () {
                var buffer = Buffer.concat(chunks);
                resolve(sizeOf(buffer));
            });
        });
    });
};

module.exports = getImgSize;