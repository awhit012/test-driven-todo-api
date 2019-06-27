var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TodoSchema = new Schema({
  task: String,
  status: String
});

var Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;