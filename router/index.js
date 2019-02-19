const getIndex = require('../utils/getIndex');

var fn_index = async (ctx, next) => {
    let page = ctx.request.query.page;
    if (!page) page = 1;
    // console.log(ctx.hostname);
    // console.log(ctx.socket.domain);
    // console.log(ctx.subdomains);
    let data = await getIndex(page, ctx.state.current_user);
    ctx.response.body = data;
    await next();
};

module.exports = {
    'GET /': fn_index
};