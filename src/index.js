const express = require('express');
const bodyParser = require('body-parser');
const getFollowers = require('./followers');

/* This file sets up a local Express Server
This acts as an API with multiple endpoints. Endpoints are as follows:
http://localhost:3003/
http://localhost:3003/directory
http://localhost:3003/getFollowers

The enpoint for getFollowers accepts POST requests with application/json bodies

=====/Pangrams POST Request Example====
Content-Type: application/json
body: { "githubId" : "zacharibarnes" }

The enpoints for getFollowers also accepts get requests with query parameters

=====/Pangrams GET Request Examples====
http://localhost:3003/getFollowers?githubId=zachariBarnes

*/
// Setup the express app
const app = express();
app.use(bodyParser()); // allows us to parse bodies
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true,
}));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// Each app.get sets up a GET endpoint that can be reached in a browser
// Res.send is what is returned to the browser
app.get('/Directory', (req, res) => { res.send('Valid endpoints are as follows: /Directory, /, /getFollowers'); });
app.get('/', (req, res) => { res.send('Valid endpoints are as follows: /Directory, /, /getFollowers'); });

// This Endpoint will display the result of getFollowers(githubID)
// A githubId query parameter  must be provided
// otherwise if no parameters are given it will provide instructions
app.get('/getFollowers', async (req, res) => {
  const id = req.query.githubId;
  if (id) {
    const result = await getFollowers(id);
    console.log('Returning: ', result); // eslint-disable-line no-console
    res.send(result);
  } else {
    res.send('<h3>This endpoint Accepts POST requests and returns a response.</h3> <br>'
      + '<h4>Post body should be similar to: </br>'
      + '{<br>"githubId": "syntaqx"<br>}'
      + '<br><br><br>Additionally you can hit this endpoint with a query parameter instead.<br>'
      + 'just add: <br>?githubId="laurenmarieh" </br>'
      + 'to the end of the url in your browser </br>'
      + 'You can change the githubId to any valid github userId</h4>');
  }
});

// Given a sentence parameter This Post endpoint will return the response of getFollowers(githubID)
// A githubId must be provided
app.post('/getFollowers', async (req, res) => {
  const { githubId: id } = req.body;
  if (id) {
    const result = await getFollowers(id);
    console.log('Returning: ', result); // eslint-disable-line no-console
    res.send(result);
  } else {
    res.send('<h3>This endpoint Accepts POST requests and returns a response.</h3> <br>'
      + '<h4>Post body should be similar to: </br>'
      + '{<br>"githubId": "syntaqx"<br>}'
      + '<br><br><br>Additionally you can hit this endpoint with a query parameter instead.<br>'
      + 'just add: <br>?githubId="laurenmarieh" </br>'
      + 'to the end of the url in your browser </br>'
      + 'You can change the githubId to any valid github userId</h4>');
  }
});

// app.listen allows the express app to listen to REST requests on a given port
// eslint-disable-next-line no-console
app.listen(3003, () => { console.log('API Endpoints live at: http://localhost:3003/'); });
// module.exports = app;
// The above line is used instead of app.listen when deploying to AWS lambda
