const {
    UserCenter
} = require('../utils/auth');
var fn_usercenter = async (ctx, next) => {
    let user = await UserCenter(ctx.state.current_user);
    ctx.response.body = user;
    await next();
};

module.exports = {
    'GET /user': fn_usercenter
};