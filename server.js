// Declare our dependencies
const express = require('express');
const request = require('superagent');

// create the express app
const app = express();

// Set the view engine to use EJS as well as set the default views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');

// This tells Express out of which directory to serve static assets like CSS and images
app.use(express.static(__dirname + '/public'));

// These two variables we’ll get from our Auth0 MovieAnalyst-Website Client.
// Head over the the management dashboard at https://manage.auth0.com
// Find the MovieAnalyst Website Client and copy and paste the Client ID and Secret
const NON_INTERACTIVE_CLIENT_ID = 'dzCiyQTwkL03gFRIdL4Wo3VlCuZD131N';
const NON_INTERACTIVE_CLIENT_SECRET = '9nffY7gvCFbCaSafZ9B3LAZgzQxbYLEciOKCR35-honwbvzU9qzgZbtkzBvcxgs6';

// Next, we’ll define an object that we’ll use to exchange our credentials for an access token.
const authData = {
    client_id: NON_INTERACTIVE_CLIENT_ID,
    client_secret: NON_INTERACTIVE_CLIENT_SECRET,
    grant_type: 'client_credentials',
    audience: 'movieanalyst'
};

// We’ll create a middleware to make a request to the oauth/token Auth0 API with our authData we created earlier.
// Our data will be validated and if everything is correct, we’ll get back an access token.
// We’ll store this token in the req.access_token variable and continue the request execution.
// It may be repetitive to call this endpoint each time and not very performant, so you can cache the access_token once it is received.
function getAccessToken(req, res, next) {
    request
        .post('https://movieapi.auth0.com/oauth/token')
        .send(authData)
        .end(function (err, res) {
            req.access_token = res.body.access_token;
            next();
        });
}

// The homepage route of our application does not interface with the MovieAnalyst API and is always accessible. 
// We won’t use the getAccessToken middleware here. We’ll simply render the index.ejs view.
app.get('/', function (req, res) {
    res.render('index');
});

// For the movies route, we’ll call the getAccessToken middleware to ensure we have an access token. If we do have a valid access_token,
// we’ll make a request with the superagent library and we’ll be sure to add our access_token in an Authorization header before making 
// the request to our API.
// Once the request is sent out, our API will validate that the access_token has the right scope to request the /movies resource and if 
// it does, will return the movie data. We’ll take this movie data, and pass it alongside our movies.ejs template for rendering
app.get('/movies', getAccessToken, function (req, res) {
    request
        .get('http://localhost:8080/movies')
        .set('Authorization', 'Bearer ' + req.access_token)
        .end(function (err, data) {
            console.log(data.body);
            if (data.status == 401) {
                res.status(401).send(err);
            } else {
                const movies = data.body;
                res.render('movies', { movies: movies });
            }
        });
});

// The process will be the same for the remaining routes. We’ll make sure to get the acess_token first and then make the request to our 
// API to get the data.The key difference on the authors route, is that for our client, we’re naming the route /authors, but our API 
// endpoint is /reviewers. Our route on the client does not have to match the API endpoint route.
app.get('/authors', getAccessToken, function (req, res) {
    request
        .get('http://localhost:8080/reviewers')
        .set('Authorization', 'Bearer ' + req.access_token)
        .end(function (err, data) {
            console.log(data.body);
            if (data.status == 401) {
                res.status(401).send(err);
            } else {
                const authors = data.body;
                res.render('authors', { authors: authors });
            }
        });
});

app.get('/publications', getAccessToken, function (req, res) {
    request
        .get('http://localhost:8080/publications')
        .set('Authorization', 'Bearer ' + req.access_token)
        .end(function (err, data) {
            if (data.status == 401) {
                res.status(401).send(err);
            } else {
                const publications = data.body;
                res.render('publications', { publications: publications });
            }
        });
});

// We’ve added the pending route, but calling this route from the MovieAnalyst Website will always result in a 403 Forbidden error as this 
// client does not have the admin scope required to get the data.
app.get('/pending', getAccessToken, function (req, res) {
    request
        .get('http://localhost:8080/pending')
        .set('Authorization', 'Bearer ' + req.access_token)
        .end(function (err, data) {
            if (data.status == 401) {
                res.status(401).send(err);
            }
        });
});

// Our MovieAnalyst Website will listen on port 3000. Feel free to change this as you see fit, just know that you can’t
// have multiple processes listening on the same port.
app.listen(3000, function () {
    console.log('Movie-Analyst Web App listening on port 3000');
});