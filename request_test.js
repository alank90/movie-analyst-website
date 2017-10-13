var request = require("request");

var options = { method: 'POST',
  url: 'https://movieapi.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: '{"client_id":"dzCiyQTwkL03gFRIdL4Wo3VlCuZD131N","client_secret":"9nffY7gvCFbCaSafZ9B3LAZgzQxbYLEciOKCR35-honwbvzU9qzgZbtkzBvcxgs6","audience":"movieanalyst","grant_type":"client_credentials"}' };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});