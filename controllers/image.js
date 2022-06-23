const Clarifai = require('clarifai');
const fetch = (url) => import('node-fetch').then(({default: fetch}) => fetch(url));

//fetch issue 
//https://stackoverflow.com/questions/48433783/referenceerror-fetch-is-not-defined

//You must add your own API key here from Clarifai. 
const app = new Clarifai.App({
 apiKey: '72cd409cdab049d897ce3cbc80970669' 
});

//https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg
//https://www.clarifai.com/blog/use-clarifais-face-detection-model-to-find-faces-in-images
//https://docs.clarifai.com/api-guide/predict/prediction-parameters/#by-model-version-id
//https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js
//https://stackoverflow.com/questions/62516331/clarifai-face-detect-model-does-not-exist
//https://docs.clarifai.com/api-guide/data/


//TRY THIS 
//https://docs.clarifai.com/api-guide/predict/images

//curl example
//curl -X POST -H 'Authorization: Key 72cd409cdab049d897ce3cbc80970669' -H "Content-Type: application/json" -d '{ "inputs": [ { "data": { "image": { "url": "https://images.pexels.com/photos/4556737/pexels-photo-4556737.jpeg"}}}]}' https://api.clarifai.com/v2/models/{a403429f2ddf4b49b307e318f00e528b}/versions/{34ce21a40cc24b6b96ffee54aabff139}/outputs
//https://stackoverflow.com/questions/25515936/perform-curl-request-in-javascript


const handleApiCallFetch = (req, res) => {
  //const url = "https://api.clarifai.com/v2/models/{a403429f2ddf4b49b307e318f00e528b}/versions/{34ce21a40cc24b6b96ffee54aabff139}/outputs";

console.log(req)
const USER_ID = 'mcrdjr+clarifai@sfdc2max.com';
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = '72cd409cdab049d897ce3cbc80970669';
  const APP_ID = '941ecfbec2ec4ddca6156b5470f99388';
  const MODEL_ID = 'a403429f2ddf4b49b307e318f00e528b';
  const MODEL_VERSION_ID = '34ce21a40cc24b6b96ffee54aabff139';
  // Change this to whatever image URL you want to process
  //const IMAGE_URL = 'https://images.pexels.com/photos/4556737/pexels-photo-4556737.jpeg';
  const IMAGE_URL ='https://upload.wikimedia.org/wikipedia/commons/9/95/Face.JPG'
  
  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
});
//https://docs.clarifai.com/api-guide/predict/images/
const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};

// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
// this will default to the latest version_id
console.log('options:', requestOptions);
fetch('https://api.clarifai.com/v2/models/' + MODEL_ID + '/versions/' + MODEL_VERSION_ID + '/outputs', 
requestOptions
)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

const handleApiCall = (req, res) => {
  app.models
    // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
    // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
    // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
    // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
    // is to use a different version of their model that works like the ones found here: https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js
    // so you would change from:
    // .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    // to:
    //.predict('53e1df302c079b3db8a0a36033ed2d15', req.body.input)
    .predict('53e1df302c079b3db8a0a36033ed2d15', req.body.input)
    //.predict('a403429f2ddf4b49b307e318f00e528b', req.body.input)
    //.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    //.predict(
    //  {
    //    id: "a403429f2ddf4b49b307e318f00e528b"
    //  },req.body.input)
    .then(data => {
      res.json(data);
      console.log(JSON.parse(data));
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
    // entries[0] --> this used to return the entries
    // TO
    // entries[0].entries --> this now returns the entries
    res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall,
  handleApiCallFetch
}