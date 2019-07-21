# GitFollowers
## In order to test the functionality of this API you can easily send requests to my AWS lambda at the following url

### https://x7t7y7ixzh.execute-api.us-east-1.amazonaws.com/latest/getFollowers

### For ease of use I suggest using query parameters ex:
### https://x7t7y7ixzh.execute-api.us-east-1.amazonaws.com/latest/getFollowers?githubId=laurenmarieh

### This AWS lamda also accepts POST requests. sample request:
           Content-Type: application/json
           body: { "githubId" : "zacharibarnes" }

# Running the API Locally

This Node.js express app sets up a local Express Server.

### To Get started you will need to have Node.js installed 

  #### Please note this was developed on a Windows machine so there may be some minor changes required for MAC or Linux
   1. Download and Extract the contents of GitFollowers.zip OR Clone the repo from github then
     Open the GitFollowers folder in a command prompt or terminal (or an IDE with integrated terminal)

  2. In the terminal run: `npm install`
        This might take a few minutes to complete.
  3. When that completes, in the terminal run the command: `npm test` or `npm run test`
        This will display tests that pass and coverage percentages.
  4. In the terminal run: `npm start`
        This command will start the express app.
  5. Once the app starts you can choose to either use your browser to proceed or use a HTTP client like Postman or Insomnia
        (I tested with Postman and Google Chrome)
        BROWSER
        * Navigate to http://localhost:3003/ to see the list of valid endpoints.
        * Navigate to http://localhost:3003/getFollowers to use the getFollowers function or get further instructions
                this endpoint accepts a query parameter of 'githubId' Ex http://localhost:3003/getFollowers?githubId=zachariBarnes
### HTTP CLIENT (Postman)
* Create a new POST Request set the Content-Type to 'application/json'
* Set the URL to either http://localhost:3003/GetFollowers
* In the Body add your parameters ("githubId" and the value of a github ID you want to serach)
  * if you are using RAW instead of x-www-form-urlencoded make sure you format your body as a JSON object
                   and select JSON(application/JSON) in the dropdown (the default is text)
* /getFollowers endpoint Example body:
                  
                    { "githubId" : "zacharibarnes" }


This acts as an API with multiple endpoints. Endpoints are as follows:

http://localhost:3003/

http://localhost:3003/directory

http://localhost:3003/getFollowers

#### The enpoint for getFollowers accepts POST requests with application/json bodies

=====/getFollowers POST Request Example====

    Content-Type: application/json
    body: { "githubId" : "zacharibarnes" }
    

#### The enpoint for getFollowers also accepts get requests with query parameters


=====/getFollowers GET Request Examples====

http://localhost:3003/getFollowers?githubId=zachariBarnes
