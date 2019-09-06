const getTags = require('../utils/getTags');
var fn_tags = async (ctx, next) => {
    let id = ctx.request.query.id;
    let page = ctx.request.query.page;
    let user = ctx.state.current_user;
    let data = await getTags(id, page, user);
    ctx.response.body = data;
    await next();
};

module.exports = {
    'GET /tags': fn_tags
};