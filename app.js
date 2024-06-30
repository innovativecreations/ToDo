const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let tasks = [];

app.get('/', (req, res) => {
  res.render('index', { tasks: tasks });
});

app.post('/addtask', (req, res) => {
  let task = { title: req.body.newtask, completed: false, subtasks: [] };
  tasks.push(task);
  res.redirect('/');
});

app.post('/togglecompletion', (req, res) => {
  let taskTitle = req.body.taskTitle;
  tasks.forEach(task => {
    if (task.title === taskTitle) {
      task.completed = !task.completed;
    }
    task.subtasks.forEach(subtask => {
      if (subtask.title === taskTitle) {
        subtask.completed = !subtask.completed;
        if (task.subtasks.every(st => st.completed)) {
          task.completed = true;
        } else {
          task.completed = false;
        }
      }
    });
  });
  res.redirect('/');
});

app.post('/addsubtask', (req, res) => {
  let mainTask = req.body.maintask;
  let subtask = { title: req.body.newsubtask, completed: false };
  tasks.forEach(task => {
    if (task.title === mainTask) {
      task.subtasks.push(subtask);
    }
  });
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
