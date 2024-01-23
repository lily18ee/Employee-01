require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');

const employeeController = require('./controllers/employeeController');

const app = express();

// Set up body parser middleware
app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json()) ;

app.set('views', path.join(__dirname, '/views/'));

// Use exphbs.create to initialize express-handlebars
const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'mainLayout',
  layoutsDir: __dirname + '/views/layouts/' ,
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.listen(3000, () => {
  console.log('Express server started at port: 3000');
});

app.use('/employee', employeeController);
