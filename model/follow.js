const Bookshelf = require('./base')();

var Follow = Bookshelf.Model.extend({
    tableName: 'girl_users',
    users: function () {
        return this.hasMany(require('./users'));
    },
    girl: function () {
        return this.belongsTo(require('./girl'));
    }
});

module.exports = Bookshelf.model('Follow', Follow);