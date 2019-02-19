const getTags = require('../utils/getTags');
var fn_tags = async (ctx, next) => {
    let id = ctx.request.query.id;
    let page = ctx.request.query.page;
    let data = await getTags(id, page);
    ctx.response.body = data;
    await next();
};

module.exports = {
    'GET /tags': fn_tags
};