const bookshelf = require('./base')();

var Users = bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true,
    liked: function () {
        return this.belongsToMany(require('./picture')).through(require('./liked'));
    },
    follow: function () {
        return this.belongsToMany(require('./picture')).through(require('./follow'));
    }
});

module.exports = Users;