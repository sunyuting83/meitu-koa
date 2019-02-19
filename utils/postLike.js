
/**
 * 用户登录
 * @param Number gid 详情id
 * @param String token
 */
PostLike = async (gid, status, user) => {
    var status = Number(status);
    var login;
    if (user) {
        login = true;
    } else {
        login = false;
    };
    return new Promise((resolve, reject) => {
        try {
            if (login === false) {
                resolve({
                    'status': 1,
                    'message': '请登录'
                });
            } else {
                if (status === 0) {
                    user.liked().attach(gid);
                    resolve({
                        'status': 0,
                        'message': '已赞'
                    });

                } else {
                    user.liked().detach(gid);
                    resolve({
                        'status': 2,
                        'message': '取消成功'
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    })
};

module.exports = PostLike;