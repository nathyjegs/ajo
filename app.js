const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger');
const express = require('express');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

// configuration
console.log(`Application Name: ${config.get('name')}`);
console.log(`Mail server: ${config.get('mail.host')}`);

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan enabled')
}


app.use(logger);

const tours = [
  { id: 1, name: 'tour1' },
  { id: 2, name: 'tour2' },
  { id: 3, name: 'tour3' },
  { id: 4, name: 'tour4' }, 
];

app.get('/', (req, res) => {
  res.send('Hello World')
});

app.get('/api/tours', (req, res) => {
  res.send(tours);
});

app.get('/api/tours/:id', (req, res) => {
  const tour = tours.find(t => t.id === parseInt(req.params.id));
  if (!tour) return res.status(404).send('The tour with the given ID was not found');
  res.send(tour);
});

app.post('/api/tours', (req, res) => {
  const { error } = validateTour(req.body);
  if (error) return res.status(400).send(result.error.details[0].message);
  
  const tour = {
    id: tours.length + 1,
    name: req.body.name
  };
  tours.push(tour);
  res.send(tour);
});

app.put('/api/tours/:id', (req, res) => {
  const tour = tours.find(t => t.id === parseInt(req.params.id));
  if (!tour) return res.status(404).send('The tour with the given ID was not found');

  const { error } = validateTour(req.body);
  if (error) return res.status(400).send(result.error.details[0].message);

  tour.name = req.body.name;
  res.send(tour);

});

app.delete('/api/tours/:id', (req, res) => {
  const tour = tours.find(t => t.id === parseInt(req.params.id));
  if (!tour) return res.status(404).send('The tour with the given ID was not found');

  const index = tours.indexOf(tour);
  tours.splice(index, 1);

  res.send(tour);
})

function validateTour(tour) {
  const schema = {
    name: Joi.string().min(3).required()
  };
  
  return Joi.validate(tour, schema);
};



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}...`));