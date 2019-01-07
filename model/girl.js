const bookshelf = require('./base')();

var Modelgirl = bookshelf.Model.extend({
    tableName: 'girl',
    picture: function () {
        return this.hasMany(require('./picture'));
    }
});

// 添加模特

module.exports = Modelgirl;