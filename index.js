//express is a package so it needs to be required
const express = require('express');
const app = express();

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

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });