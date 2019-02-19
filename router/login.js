const Login = require('../utils/login');

var fn_login = async (ctx, next) => {
    const username = ctx.request.body.username || '';
    const password = ctx.request.body.password || '';
    let user = await Login(username, password);
    ctx.response.body = user;
    await next();
};

module.exports = {
    'POST /login': fn_login
};