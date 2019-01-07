const Bookshelf = require('./base')();
var Tags = Bookshelf.Model.extend({
    tableName: 'tags',
    picture: function () {
        return this.belongsToMany(require('./picture'));
    }
});

module.exports = Bookshelf.model('Tags', Tags);