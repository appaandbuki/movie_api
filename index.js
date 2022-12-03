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
      favoriteMovies: ['Spirited Away']
    },
  ]

//create an Express GET route located at the endpoint “/movies” that returns a JSON object containing data about your top 10 movies.
let movies = [
    {
        "Title": "Howl/'s Moving Castle",
        "Description": "This Japanese animated, fantasy film is set in a fictional kingdom where both magic and early twentieth-century technology are prevalent, against the backdrop of a war with another kingdom. It tells the story of Sophie, a young milliner who is turned into an elderly woman by a witch who enters her shop and curses her. She encounters a wizard named Howl and gets caught up in his resistance to fighting for the king..",
        "Genre": {
          "Name": "Fantasy",
          "Description": "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds."
        },
        "Director": {
          "Name": "Hayao Miyazaki",
          "Bio" : "Hayao Miyazaki is a Japanese animator, director, producer, screenwriter, author, and manga artist. A co-founder of Studio Ghibli, he has attained international acclaim as a masterful storyteller and creator of Japanese animated feature films, and is widely regarded as one of the most accomplished filmmakers in the history of animation.",
          "Birth" :  "January 5, 1941" ,
        },
        "ImageUrl" : "https://en.wikipedia.org/wiki/Howl%27s_Moving_Castle_(film)#/media/File:Howls-moving-castleposter.jpg",
        "Featured" : true
      },
      {
        "Title": "Spirited Away",
        "Description": "Spirited Away tells the story of Chihiro Ogino (Hiiragi), a ten-year-old girl who, while moving to a new neighborhood, enters the world of Kami (spirits of Japanese Shinto folklore).[8] After her parents are turned into pigs by the witch Yubaba (Natsuki), Chihiro takes a job working in Yubaba's bathhouse to find a way to free herself and her parents and return to the human world.",
        "Genre": {
          "Name": "Fantasy",
          "Description": "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds."
        },
        "Director": {
          "Name": "Hayao Miyazaki",
          "Bio" : "Hayao Miyazaki is a Japanese animator, director, producer, screenwriter, author, and manga artist. A co-founder of Studio Ghibli, he has attained international acclaim as a masterful storyteller and creator of Japanese animated feature films, and is widely regarded as one of the most accomplished filmmakers in the history of animation.",
          "Birth" :  "January 5, 1941" ,
        },
        "ImageUrl" : "https://en.wikipedia.org/wiki/Spirited_Away#/media/File:Spirited_Away_Japanese_poster.png",
        "Featured" : true
      },
    
      {
        "Title": "The Lord of the Rings: The Fellowship of the Ring ",
        "Description": "Set in Middle-earth, the story tells of the Dark Lord Sauron, who seeks the One Ring, which contains part of his might, to return to power. The Ring has found its way to the young hobbit Frodo Baggins. The fate of Middle-earth hangs in the balance as Frodo and eight companions (who form the Fellowship of the Ring) begin their journey to Mount Doom in the land of Mordor, the only place where the Ring can be destroyed. .",
        "Genre": {
          "Name": "Fantasy",
          "Description": "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds."
        },
        "Director": {
          "Name": "Peter Jackson",
          "Bio" : "Sir Peter Robert Jackson is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the Lord of the Rings trilogy (2001–2003) and the Hobbit trilogy (2012–2014), both of which are adapted from the novels of the same name by J. R. R. Tolkien. Other notable films include the critically lauded drama Heavenly Creatures (1994), the horror comedy The Frighteners (1996), the epic monster remake film King Kong (2005), the World War I documentary film They Shall Not Grow Old (2018) and the documentary The Beatles: Get Back (2021). He is the third-highest-grossing film director of all-time, his films having made over $6.5 billion worldwide.",
          "Birth" : "October 31, 1961" ,
        },
        "ImageUrl" : "https://en.wikipedia.org/wiki/The_Lord_of_the_Rings:_The_Fellowship_of_the_Ring#/media/File:The_Lord_of_the_Rings_The_Fellowship_of_the_Ring_(2001).jpg",
        "Featured" : true
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