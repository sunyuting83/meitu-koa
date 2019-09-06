const getHotList = require('../utils/getHot');
var fn_hotlist = async (ctx, next) => {
    let page = ctx.request.query.page;
    if (!page) page = 1;
    let data = await getHotList(page, ctx.state.current_user);
    ctx.response.body = data;
    await next();
};

module.exports = {
    'GET /gethot': fn_hotlist
};