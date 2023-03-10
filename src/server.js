const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;


const HASURA_OPERATION_USERLIST = `
query users($offset: INT, $limit: INT) {
  users(offset: 0, limit: 10) {
    first_name,
    last_name,
    gender
  }
}
`;

const HASURA_OPERATION_NEARUSER = `
query findbynear($radius: float) {
  findbynear(radius: 0) {
    first_name: String
    last_name: String
    gender: String
    location: {
      lat: Float
      lng: Float
    }
  }
}
`;



const getUserList = async (variables, reqHeaders) => {
  const fetchResponse = await fetch(
    "http://localhost:8080/v1/graphql",
    {
      method: 'POST',
      headers: reqHeaders || {},
      body: JSON.stringify({
        query: HASURA_OPERATION_USERLIST,
        variables
      })
    }
  );
  return await fetchResponse.json();
};

const getNearUsers = async (variables, reqHeaders) => {
  const fetchResponse = await fetch(
    "http://localhost:8080/v1/graphql",
    {
      method: 'POST',
      headers: reqHeaders || {},
      body: JSON.stringify({
        query: HASURA_OPERATION_NEARUSER,
        variables
      })
    }
  );
  return await fetchResponse.json();
};


app.use(bodyParser.json());

app.get('/userlist', async function(request, response)
{
    var {limit, offset} = request.query;
    if(limit && offset){
      const { data, errors } = await getUserList({limit:limit, offset:offset}, request.headers);
      if (errors) {
        return res.status(400).json({
          message: errors.message
        })
      }
      else{
        return res.json({
          ...data
        })
      }
    }
});

app.get('/findbynear', async function(request, response)
{
    var {lat, lng} = request.query;
    if(limit && offset){
      const { data, errors } = await getNearUsers({lat:lat, lng:lng}, request.headers);
      if (errors) {
        return res.status(400).json({
          message: errors.message
        })
      }
      else{
        return res.json({
          ...data
        })
      }
    }
});

app.listen(PORT);