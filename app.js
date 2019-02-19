const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
// 导入controller middleware:
const router = require('./router');
const app = new Koa();

// 检测token
const {
    checkToken
} = require('./utils/auth');

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var token = ctx.header.authorization || '';
    if (token.length > 0) {
        let user = await checkToken(token, true);
        // console.log(user);
        if (user.status !== 1) {
            ctx.state.current_user = user;
        }
    };
    await next();
});


// add router middleware:
app.use(bodyParser());
// 使用middleware:
app.use(router());

app.listen(3000);
console.log('app started at port 3000...');