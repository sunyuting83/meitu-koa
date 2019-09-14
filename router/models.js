
const getGirls = require('../utils/getGirls');
var fn_girls = async (ctx, next) => {
    let id = ctx.request.query.id;
    let page = ctx.request.query.page;
    let user = ctx.state.current_user;
    let data = await getGirls(id, page, user);
    ctx.response.body = data;
    await next();
};

module.exports = {
    'GET /model': fn_girls
};