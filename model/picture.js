const Bookshelf = require('./base')();

var picture = Bookshelf.Model.extend({
    tableName: 'picture',
    hasTimestamps: true,
    images: function () {
        return this.hasOne(require('./images'));
    },
    tags: function () {
        return this.belongsToMany(require('./tags'));
    },
    liked: function () {
        return this.hasMany(require('./liked'));
    },
    modelgirl: function () {
        return this.belongsTo(require('./girl'));
    }
});

// 添加图片1对1
picture.prototype.addImg = function (imgdata) {
    const Images = require('./images');
    return Images.forge({
            content: imgdata,
            picture_id: this.id
        }).save()
        .bind(this)
        .then(function (data) {
            return data;
        });
};

// 添加TAGS
picture.prototype.addTags = async function (tag) {
    /* 
    先查询是否已有TAGS。使用where语句。传入@writer参数
    @has是查询结果
    如果有结果，直接追加书籍的TAGSid入多对多关联表. @has.id
    如果没有结果， 添加新TAGS入库， 并追加TAGSid至关联表 @writer.id
    */
    const Tags = require('./tags');
    return await Tags.where({
        'tags': tag
    })
    .fetch()
    .bind(this)
    .then(async function (has) {
        if (has) {
            this.tags().attach(has.id); //追加到关联表
            return has;
        }else{
            return await Tags.forge({
                'tags': tag,
            }).save()
            .bind(this)
            .then(function (tags) {
                // console.log(this.id, writer.id);
                this.tags().attach(tags.id); //追加到关联表
                return tags;
            });
        }
    });
};

module.exports = Bookshelf.model('picture', picture);