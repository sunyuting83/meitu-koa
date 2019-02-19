const Bookshelf = require('./base')();
var Ptags = Bookshelf.Model.extend({
    tableName: 'picture_tags',
    picture: function () {
        return this.hasMany(require('./picture'));
    },
    tags: function () {
        return this.hasMany(require('./tags'));
    }
});

module.exports = Bookshelf.model('Ptags', Ptags);