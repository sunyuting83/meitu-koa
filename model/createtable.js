const dbConfig = require('./db_config');
var knex = require('knex')(dbConfig);
Bookshelf = require('bookshelf')(knex);

// Create a table
Bookshelf.knex.schema.createTable('girl', function (table) {
        table.increments('id').primary();
        table.string('mname', 100);
        table.text('intro');
        table.string('cover', 100);
        table.index('id', ['ix_girl_id']);
        table.comment('模特表');
    })
    // ...and another
    .createTable('picture', function (table) {
        table.increments('id').unsigned().primary();
        table.string('title');
        table.string('cover');
        table.integer('girl_id').unsigned().references('girl.id');
        table.integer('click_count').defaultTo(0);
        table.integer('img_count').defaultTo(0);
        table.timestamps();
        table.index('title', ['ix_picture_title']);
        table.comment('私拍表');
    })
    // ...and another
    .createTable('picture_img', function (table) {
        table.increments('id').unsigned();
        table.text('content');
        table.integer('picture_id').unsigned().references('picture.id');
        table.comment('图片详细表');
    })
    // ...and another
    .createTable('tags', function (table) {
        table.increments('id').primary();
        table.string('tags', 100);
        table.index('id', ['ix_tags_id']);
        table.comment('TAG表');
    })
    // ...and another
    .createTable('picture_tags', function (table) {
        table.increments('id');
        table.integer('picture_id').unsigned().references('picture.id');
        table.integer('tag_id').unsigned().references('tags.id');
        table.comment('私拍-TAG联表');
    })
    // ...and another
    .createTable('ignore', function (table) {
        table.increments('id').unsigned();
        table.integer('ignore_url');
        table.comment('URL忽略列表');
    })
    // ...and another
    .createTable('users', function (table) {
        table.increments('id').unsigned();
        table.string('username', 32);
        table.string('password', 64);
        table.string('token', 128);
        table.boolean('status');
        table.integer('assets');
        table.timestamps();
        table.comment('用户表');
    })
    // ...and another
    .createTable('picture_users', function (table) {
        table.increments('id');
        table.integer('picture_id').unsigned().references('picture.id');
        table.integer('user_id').unsigned().references('users.id');
        table.comment('私拍-用户联表');
    })
    .createTable('girl_users', function (table) {
        table.increments('id');
        table.integer('girl_id').unsigned().references('girl.id');
        table.integer('user_id').unsigned().references('users.id');
        table.comment('模特-用户联表');
    })
    .then(function () {
        console.log('table created');
        process.exit();
    })
    // Finally, add a .catch handler for the promise chain
    .catch(function (e) {
        console.error(e);
        process.exit();
    });