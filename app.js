var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var trips = require('./public/data/trips.json')
//var games = require('./public/data/atari.json')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Mongo setup
var MongoClient = require('mongodb').MongoClient
dbClientPromise = MongoClient.connect('mongodb://localhost:27017/')

async function getClient() {
  return await MongoClient.connect('mongodb://localhost:27017/')
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getGames', async function(req, res) {
  const dbClient = await getClient()
  const dbObject = dbClient.db('newAtariDatabase')
  const collection = dbObject.collection('games')
  const allGames = await collection.find({}).toArray();

  res.setHeader('Content-Type', 'application/json')
  res.json(allGames) //Changed
})

app.get('/getList', async function(req, res) {

  const dbClient = await getClient()
  const dbObject = dbClient.db('newAtariDatabase')
  const collection = dbObject.collection('games')
  const allGames = await collection.find({}).toArray(); 

  res.setHeader('Content-Type', 'aplication/json')
  res.json(allGames) //Changed

})

app.get('/getTrip', async function (req, res) {
  const dbClient = await getClient()
  const dbObject = dbClient.db('newAtariDatabase')
  const collection = dbObject.collection('games')
  const allGames = await collection.find({}).toArray(); 

  res.setHeader('Content-Type', 'aplication/json');
  res.end(JSON.stringify(allGames[req.query.idx]));
});

//This no longer saves the star rating 
app.post('/setRating', async function(req, res) {
  const dbClient = await getClient()
  const dbObject = dbClient.db('newAtariDatabase')
  const collection = dbObject.collection('games')
  const allGames = await collection.find({}).toArray();

  const currentRating = allGames[req.body.idx].fav
  const filter = {idx: parseInt(req.body.idx)}
  // const updateDoc = {$set: {fav: !currentRating}}
  const updateDoc = {
    $set: {
      fav: !currentRating,
      rating: req.body.rating
    }
  };
  const options = {upsert: false}
  await collection.updateOne(filter, updateDoc, options) //updates database
   
  allGames[req.body.idx].rating = req.body.rating //Changed 
  res.setHeader('Content-Type', 'application/json')
  res.json(allGames[req.body.idx]) //Changed
  
 
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
