var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
mongoose.set('strictQuery', false);
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();


mongoose.connect("mongodb://localhost:27017/JobsDatabase");
mongoose.connection.on('connected',async () => {
  console.log("🚀Connect to database success");
  // const Role = require("./schemas/role");
  // const roles = [
  //   { name: "Admin", description: "Quản trị viên" },
  //   { name: "Company", description: "Người tuyển dụng" },
  //   { name: "User", description: "Người dùng thường" },
  // ];

  // for (const roleData of roles) {
  //   const exists = await Role.findOne({ name: roleData.name });
  //   if (!exists) {
  //     await Role.create(roleData);
  //     console.log(`✅ Role '${roleData.name}' đã được tạo.`);
  //   } else {
  //     console.log(`ℹ️ Role '${roleData.name}' đã tồn tại.`);
  //   }
  // }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// add database
app.use(cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/companies', require('./routes/companies'));
app.use('/roles', require('./routes/roles'));
app.use('/auth', require('./routes/auth'));
app.use('/jobs', require('./routes/jobs'));
app.use('/jobTypes', require('./routes/jobTypes'));
app.use('/positonTypes', require('./routes/positionTypes'));


// const port = 3000;
// app.listen(port, () => {
//   console.log(`🚀Server đang chạy tại 127.0.0.1:${port}`);
// })

// chấp nhận tất cả cors truy cập



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
