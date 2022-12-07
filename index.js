const express = require("express");
       bodyParser = require("body-parser");
       uuid = require("uuid");

const morgan = require("morgan");
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//GET/READ REQUESTS
app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// GET return a list of all movies to the users
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});  


// //GET- READ. Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user;
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// //READ: Return data about a genre (description) by name/title (e.g., “Thriller”);
app.get('/movies/genre/:genreName', (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.genreName })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
   

// //READ:Return data about a director (bio, birth year, death year) by name;
app.get('/movies/directors/:directorName', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.directorName })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
}); 





// //CREATE Allow new users to register;
app.post('/users', (req, res) => {
  //using findOne function to check if user with this username already exists
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      //if this username does exist then....
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          //the parameter "user" refers to the document you just added
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


// //CREATE Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later);
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});  

// //DELETE Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later);

app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
// //DELETE Allow existing users to deregister (showing only a text that a user email has been removed—more on this later).

// //UPDATE Allow users to update their user info (username);
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
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