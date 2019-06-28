// require express and other modules
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');
      cors = require('cors');


var corsOptions = {
  origin: 'http://localhost:3000',
}
app.use(cors())

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// serve static files from public folder
app.use(express.static(__dirname + '/public'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/todo');

// require Todo model
var Todo = require('./models/todo');

// get all todos
app.get('/api/todos', function (req, res) {
  // find all todos in db
  Todo.find(function (err, allTodos) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ todos: allTodos });
    }
  });
});

// create new todo
app.post('/api/todos', function (req, res) {
  console.log(req.body)
  // create new todo with form data (`req.body`)
  var newTodo = new Todo(req.body);
  console.log(req.body)
  // save new todo in db
  newTodo.save(function (err, savedTodo) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(savedTodo);
    }
  });
});

// get one todo
app.get('/api/todos/:id', function (req, res) {
  // get todo id from url params (`req.params`)
  var todoId = req.params.id;

  // find todo in db by id
  Todo.findOne({ _id: todoId }, function (err, foundTodo) {
    if (err) {
      if (err.name === "CastError") {
        res.status(404).json({ error: "Nothing found by this ID." });
      } else {
        res.status(500).json({ error: err.message });
      }
    } else {
      res.json(foundTodo);
    }
  });
});

// update todo
app.put('/api/todos/:id', function (req, res) {
  // get todo id from url params (`req.params`)
  var todoId = req.params.id;

  // find todo in db by id
  Todo.findOne({ _id: todoId }, function (err, foundTodo) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // update the todos's attributes
      foundTodo.task = req.body.task;
      foundTodo.description = req.body.description;

      // save updated todo in db
      foundTodo.save(function (err, savedTodo) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(savedTodo);
        }
      });
    }
  });
});


// delete todo
app.delete('/api/todos/:id', function (req, res) {
  // get todo id from url params (`req.params`)
  var todoId = req.params.id;
  // find todo in db by id and remove
  Todo.findOneAndRemove({ _id: todoId }, function (err, deletedTodo) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(deletedTodo);
    }
  });
});

const port = process.env.PORT || 3000;

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(port, function() {
  console.log('server started');
});