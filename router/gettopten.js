const getTopten = require('../utils/getTopten');
var fn_gettopten = async (ctx, next) => {
    let data = await getTopten();
    ctx.response.body = data;
    await next();
};

module.exports = {
    'GET /gettopten': fn_gettopten
};