const { List } = require('./listModel');
const { Task } = require ('./taskModel');

const { User} = require('./user.model')

module.exports = {
    List,
    Task,
    User,
}

// index.js used for grouping your models so you dont need two statements in app.js