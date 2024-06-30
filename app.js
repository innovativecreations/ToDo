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
  let task = { title: req.body.newtask, subtasks: [] };
  tasks.push(task);
  res.redirect('/');
});

app.post('/removetask', (req, res) => {
  let completedTask = req.body.check;
  if (typeof completedTask === 'string') {
    tasks.splice(tasks.findIndex(task => task.title === completedTask), 1);
  } else if (typeof completedTask === 'object') {
    for (let i = 0; i < completedTask.length; i++) {
      tasks.splice(tasks.findIndex(task => task.title === completedTask[i]), 1);
    }
  }
  res.redirect('/');
});

app.post('/addsubtask', (req, res) => {
  let mainTask = req.body.maintask;
  let subtask = req.body.newsubtask;
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