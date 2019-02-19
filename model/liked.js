const Bookshelf = require('./base')();

var Liked = Bookshelf.Model.extend({
    tableName: 'picture_users',
    users: function () {
        return this.hasMany(require('./users'));
    },
    picture: function () {
        return this.belongsTo(require('./picture'));
    }
});

module.exports = Bookshelf.model('Liked', Liked);