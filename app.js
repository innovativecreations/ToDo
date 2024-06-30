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
  let task = req.body.newtask;
  tasks.push(task);
  res.redirect('/');
});

app.post('/removetask', (req, res) => {
  let completedTask = req.body.check;
  if (typeof completedTask === 'string') {
    tasks.splice(tasks.indexOf(completedTask), 1);
  } else if (typeof completedTask === 'object') {
    for (let i = 0; i < completedTask.length; i++) {
      tasks.splice(tasks.indexOf(completedTask[i]), 1);
    }
  }
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});