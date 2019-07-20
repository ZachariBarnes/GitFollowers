import { getFollowersRecursive } from './followers';

const express = require('express');
const bodyParser = require('body-parser');

// const { getMissingLetters } = require('./pangramProcessor');
// const { animate } = require('./animation');

/* This file sets up a local Express Server
This acts as an API with multiple endpoints. Endpoints are as follows:
http://localhost:3003/
http://localhost:3003/directory

The enpoints for Pargrams and Animate accept POST requests with application/json bodies
=====/Pangrams POST Request Example====
Content-Type: application/json
body: { "sentence" : "The quick brown fox jumped over the lazy dog" }

=====/Animate POST Request Example====
Content-Type: application/json
body: {
  "speed" : 2,
  "init": "...L..R.."
  }

The enpoints for Pargrams and Animate also accept get requests with query parameters

=====/Pangrams GET Request Examples====
http://localhost:3003/pangrams?sentence=The lazy dog just slept

OR use URL encoded (not needed Your browser will interpret the spaces)

http://localhost:3003/pangrams?sentence=The%20lazy%20dog%20just%20slept

=====/Animate GET Request Example====

http://localhost:3003/animate?speed=2&init=LRR....R.
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
app.get('/Directory', (req, res) => { res.send('Valid endpoints are as follows: /Directory, /'); });
app.get('/', (req, res) => { res.send('Valid endpoints are as follows: /Directory, /'); });

// This Endpoint will display the result of getMissingLetters() if a query parameter is provided
// otherwise if no parameters are given it will provide instructions
app.get('/Pangrams', async (req, res) => {
  const id = req.query.githubId;
  console.log(`Id is ${id}`);
  if (id) {
    const result = await getFollowersRecursive(id);
    console.log('Returning: ', result); // eslint-disable-line no-console
    res.send(result);
  } else {
    res.send('<h3>This endpoint Accepts POST requests and returns a response.</h3> <br>'
      + '<h4>Post body should be similar to: </br>'
      + '{<br>"sentence": "A quick brown fox jumps over the lazy dog"<br>}'
      + '<br><br><br>Additionally you can hit this endpoint with a query parameter instead.<br>'
      + 'just add: <br>?sentence="Your sentence here" </br>'
      + 'to the end of the url in your browser </h4>');
  }
});

// This Endpoint will display the result of animate() if a query parameters are provided
// otherwise if no parameters are given it will provide instructions
// app.get('/Animate', (req, res) => {
//   const speed = req.param('speed');
//   const init = req.param('init');
//   if (speed && init) {
//     const result = animate(parseInt(speed, 10), init);
//     console.log('Returning: ', result); // eslint-disable-line no-console
//     res.send(result);
//   } else {
//     res.send('<h3>This endpoint Accepts POST requests and returns a response.</h3> <br>'
//       + '<h4>Post body should be similar to: </br>'
//       + '{<br>"speed": 2,<br>"init": "...L..R.."<br>}'
//       + '<br><br><br>Additionally you can hit this endpoint with query parameters instead.<br>'
//       + 'just add: <br>?speed="Your speed here"&init="your Init string here" </br>'
//       + 'to the end of the url in your browser </h4>');
//   }
// });

// Given a sentence parameter This Post endpoint will return the response of getMissingLetters()
// app.post('/Pangrams', (req, res) => {
//   const { sentence } = req.body;
//   const result = getMissingLetters(sentence.toString());
//   console.log('Returning: ', result); // eslint-disable-line no-console
//   res.send(result);
// });

// Given valid parameters (speed, init) This Post endpoint will return the response of animate()
// app.post('/Animate', (req, res) => {
//   const { speed, init } = req.body;
//   const result = animate(parseInt(speed, 10), init);
//   console.log('Returning: ', result); // eslint-disable-line no-console
//   res.send(result);
// });

// app.listen allows the express app to listen to REST requests on a given port
// eslint-disable-next-line no-console
app.listen(3003, () => { console.log('API Endpoints live at: http://localhost:3003/'); });
