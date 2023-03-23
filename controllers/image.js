const fetch = require("node-fetch");

const returnClarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PATH = '234250562bd64755a1abe637df5f970a';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'jojo99';       
  const APP_ID = 'Smartbrain';
  // Change these to whatever model and image URL you want to use
  const IMAGE_URL = imageUrl;

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
	return {
	  method: 'POST',
	  headers: {
	      'Accept': 'application/json',
	      'Authorization': 'Key ' + PATH
	  },
	  body: raw
	};
}

const handleApiCall = (req, res) => {
	fetch("https://api.clarifai.com/v2/models/face-detection/outputs", returnClarifaiRequestOptions(req.body.input))
	.then(response => response.json())
    .then(data => {
    	res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries);
	})
	.catch(err => res.status(400).json('unable to get entries'))
};

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
};