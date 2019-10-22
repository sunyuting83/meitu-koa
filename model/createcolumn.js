const dbConfig = require('./db_config');
var knex = require('knex')(dbConfig);
Bookshelf = require('bookshelf')(knex);
// 添加字段
Bookshelf.knex.schema.table('tags', (table) => {
    // table.integer('sort').defaultTo(0);
    // table.string('more');
    // table.dropColumn('cover'); //删除字段
    // table.dropColumn('downpath'); //删除字段
    // table.jsonb('profiles');
    // table.jsonb('downpath');
    table.integer('click_count').defaultTo(0);
})
.then((result) => {
    process.exit();
}).catch((err) => {
    console.log(err)
});