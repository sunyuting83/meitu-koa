const bookshelf = require('./base')();

var Ignore = bookshelf.Model.extend({
    tableName: 'ignore',
});

module.exports = Ignore;