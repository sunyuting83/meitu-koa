
var fn_search = async (ctx, next) => {
    let t = ctx.request.query.t;
    let p = ctx.request.query.page;
    if (!p) p = 0;
    ctx.response.body = await getmo.getSearch(t, p, (err, res) => {
        return new Promise((resolve, reject) => {
            resolve(res);
        });
    });
};

module.exports = {
    'GET /search': fn_search
};