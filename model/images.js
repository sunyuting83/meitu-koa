const bookshelf = require('./base')();

var Images = bookshelf.Model.extend({
    tableName: 'picture_img',
    picture: function () {
        return this.belongsTo(require('./picture'));
    }
});

module.exports = Images;