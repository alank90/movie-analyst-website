var request = require('superagent');

const NON_INTERACTIVE_CLIENT_ID = 'dzCiyQTwkL03gFRIdL4Wo3VlCuZD131N';
const NON_INTERACTIVE_CLIENT_SECRET = '9nffY7gvCFbCaSafZ9B3LAZgzQxbYLEciOKCR35-honwbvzU9qzgZbtkzBvcxgs6';

// Next, we’ll define an object that we’ll use to exchange our credentials for an access token.
const authData = {
    client_id: NON_INTERACTIVE_CLIENT_ID,
    client_secret: NON_INTERACTIVE_CLIENT_SECRET,
    grant_type: 'client_credentials',
    audience: 'movieanalyst'
};

function getAccessToken(req, res, next) {
    request
        .post('https://movieapi.auth0.com/oauth/token')
        .set('Content-Type', 'application/json')
        .send(authData)
        .end(function(err, res) {
            console.log(res.body.token_type);
          });
}

getAccessToken();