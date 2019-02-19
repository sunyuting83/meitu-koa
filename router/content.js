const getContent = require('../utils/getContent');
var fn_content = async (ctx, next) => {
    let id = ctx.request.query.id;
    let data = await getContent(id, ctx.state.current_user);
    ctx.response.body = data;
    await next();
};

module.exports = {
    'GET /con': fn_content
};