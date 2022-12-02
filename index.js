//express is a package so it needs to be required
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  morgan = require('morgan');

app.use(bodyParser.json());

//app.use() invokes a middleware function- here it is morgan
//the 'common' parameter here specifies that requests should be logged using Morgan's "common" format
app.use(morgan('common'));

let users = [
    {
      id : 1,
      name : 'Alison',
      favoriteMovies: []
    },
    {
      id : 2,
      name : 'Fred',
      favoriteMovies: ['Family Reunion']
    },
  ]

//create an Express GET route located at the endpoint “/movies” that returns a JSON object containing data about your top 10 movies.
let movies = [
    {
        "Title": "Family Reunion",
        "Description": "The Mckellans recall a cross-country move to Georgia that was packed with misadventure , from a weird proposal and a creepy ritual to a frisky raccoon.",
        "Genre": {
          "Name": "Drama",
          "Description": "In film and television, drama is a category of a narrative fiction or semi-fiction"
        },
        "Director": {
          "Name": "Mag DeLoatch",
          "Bio" : "Meg DeLoatch Biography, Height, Weight, Age, Measurements, Net Worth, Family, Wiki & much more! Meg DeLoatch was born on Tampa 12 Oct 1995 in and her current age 27 years old. Meg DeLoatch Weight 58.0 KG and height 5.7 Inches. Meg DeLoatch is an Producer, Writer, Additional Crew in USA. Her born home city of FL, USA. Her primary Profession is a Producer, Writer, Additional Crew. Right now Meg DeLoatch is a famous Producer, Writer, Additional Crew in the world. And her Nationality is American.",
          "Birth" : 1995,
        },
        "ImageUrl" : "https://en.wikipedia.org/wiki/Family_Reunion_(TV_series)#/media/File:Family_Reunion_(TV_series)_Title_Card.jpg",
        "Featured" : false
      },
    {
        "Title": "Wedding Season",
        "Description": "Two Indian Americans fake a romance through a summer of weddings to pacify their pushy parents, but family expectations soon clash with personal desires.",
        "Genre": {
          "Name": "Romance",
          "Description": "In film and television, Romance is a category of a narrative fiction or semi-fiction based on Love and feelings"
        },
        "Director": {
          "Name": "Tom Dey",
          "Bio" : "Thomas Ridgeway Dey is an American film director, screenwriter, and producer. His credits include Shanghai Noon, Showtime, Failure to Launch, and Marmaduke",
          "Birth" : 1965,
        },
        "ImageUrl" : "https://occ-0-3492-879.1.nflxso.net/dnm/api/v6/X194eJsgWBDE2aQbaNdmCXGUP-Y/AAAABXUp_wC5pAH3H3DrHIMQncy8baOXpGz-PtKcCr68re2tMLglxbApDyCMw28dUOZXk_cR4mVsfkDSgxbfW7TOJkGL_MsyGJ3D-W5ABVrFdUxaVec1LwoIpqirTziwn5Ic96nVKw.jpg?r=628",
        "Featured" : false
      },
    
      {
        "Title": "Emily in Paris",
        "Description": "Emily brings her can-do American attitude and fresh ideas to her new office in Paris, but her inability to speak French turns out to be a major Faux pas.",
        "Genre": {
          "Name": "Comedy",
          "Description": "In film and television, Comedy is a category of a narrative fiction or semi-fiction with alot of humor"
        },
        "Director": {
          "Name": "Darren Star",
          "Bio" : "Darren Star is an American writer, director and producer of film and television. He is best known for creating the television series Beverly Hills, 90210, Melrose Place, Sex and the City, Younger, and Emily in Paris",
          "Birth" : 1961,
        },
        "ImageUrl" : "https://www.netflix.com/de-en/title/81037371",
        "Featured" : false
      },
];

//CREATE Allow new users to register;
app.post('/users', (req,res) =>{
  //req.body only works because of the body parser we installed
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
})

//CREATE Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later);
app.post('/users/:id/:movieTitle', (req,res) =>{
  const {id, movieTitle} = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  }else {
    res.status(400).send('no such user')
  }
})

//DELETE Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later);
app.delete('/users/:id/:movieTitle', (req,res) =>{
  const {id, movieTitle} = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  }else {
    res.status(400).send('no such user')
  }
})

//DELETE Allow existing users to deregister (showing only a text that a user email has been removed—more on this later).
app.delete('/users/:id', (req,res) =>{
  const {id} = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(` user ${id} has been deleted`);
  }else {
    res.status(400).send('no such user')
  }
})

//UPDATE Allow users to update their user info (username);
app.put('/users/:id', (req,res) =>{
  const {id} = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  }else {
    res.status(400).send('no such user')
  }
})




// READ. return a list of all movies to the users
app.get('/movies', (req,res) =>{
  res.status(200).json(movies);
})

//READ. Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user;
//:title is put on the req.params object
app.get('/movies/:title', (req,res) =>{
  //line below (object destructuring) is the same as const title = req.params.title 
  const {title} = req.params;
  const movie= movies.find (movie => movie.Title ===title);

  if (movie){
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }
})

//READ: Return data about a genre (description) by name/title (e.g., “Thriller”);
app.get('/movies/genre/:genreName', (req, res) =>{
  const {genreName} = req.params;
  const genre = movies.find (movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  }else {
    res.status(400).send('no such genre')
  }
})

//READ:Return data about a director (bio, birth year, death year) by name;
app.get('/movies/directors/:directorName', (req, res) =>{
  const {directorName} = req.params;
  const director = movies.find (movie => movie.Director.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  }else {
    res.status(400).send('no such director')
  }
})



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