
var fn_bookshelf = function () {
    var dbConfig = require('./db_config');
    var knex = require('knex')(dbConfig);

    var Bookshelf = require('bookshelf')(knex);

    Bookshelf.plugin([
        'registry',
        'pagination'
    ]);

    return Bookshelf;
}
module.exports = fn_bookshelf;