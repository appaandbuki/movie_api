//express is a package so it needs to be required
const express = require('express');
    morgan = require('morgan');
const app = express();

//app.use() invokes a middleware function- here it is morgan
//the 'common' parameter here specifies that requests should be logged using Morgan's "common" format
app.use(morgan('common'));

//create an Express GET route located at the endpoint “/movies” that returns a JSON object containing data about your top 10 movies.
let topMovies = [
    {
        title: 'Howl\'s Moving Castle',
        director: 'Hayao Miyazaki '
    },
    {
        title: 'Spirited Away',
        director: 'Hayao Miyazaki'
      },
    {
        title: 'Lord of the Rings: The Return of the King',
        director: 'Peter Jackson '
    },
    {
        title: 'Grand Budapest Hotel',
        director: 'Wes Anderson '
    },
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        director: 'Chris Columbus'
    },
    {
        title: 'Jojo Rabbit',
        director: 'Taika Waititi'
    },
    {
        title: 'Everything Everywhere All at Once',
        director: 'Daniel Kwan and Daniel Scheinert '
    },
    {
        title: 'The Emperor\'s New Groove',
        director: 'Mark Dindal'
    },
    {
        title: 'The Hobbit: An Unexpected Journey',
        director: 'Peter Jackson'
    },
    {
        title: 'Ponyo',
        director: 'Hayao Miyazaki'
    },
];

//GET requests
app.get ('/movies', (req,res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to my Top Movie List! ')
});

//serves the documentation.html files from the public folder (rather than using the http, url, and fs module)
app.use(express.static('public'));

//an error-handling middleware function
//the first argument "err" allows you to recieve info about the error
//err.stack logs information about the current error to the terminal; res.status().send sets and sends the string as the response body
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });