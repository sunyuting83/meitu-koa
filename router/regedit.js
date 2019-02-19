const Regedit = require('../utils/regedit');
const {checkUser} = require('../utils/auth');

var fn_regedit = async (ctx, next) => {
    const username = ctx.request.body.username || '';
    const password = ctx.request.body.password || '';
    let reg = await Regedit(username, password);
    ctx.response.body = reg;
    await next();
};
var fn_checkusername = async (ctx, next) => {
    const username = ctx.request.body.username || '';
    let user = await checkUser(username);
    ctx.response.body = user;
    await next();
};

module.exports = {
    'POST /regedit': fn_regedit,
    'POST /checkusername': fn_checkusername
};