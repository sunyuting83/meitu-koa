const PostLike = require('../utils/postLike');
var fn_like = async (ctx, next) => {
    const gid = ctx.request.body.gid || 0;
    const status = ctx.request.body.status || 0;
    let data = await PostLike(gid, status, ctx.state.current_user);
    ctx.response.body = data;
    await next();
};

module.exports = {
    'POST /postlike': fn_like
};