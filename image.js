const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries)
    })
}

const returnClarifaiRequestOptions = (imageUrl) => {
  
    // const MODEL_ID = 'face-detection';  
    const IMAGE_URL = imageUrl;
  
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": process.env.USER_ID,
          "app_id": process.env.APP_ID
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
  
  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + process.env.PAT
      },
      body: raw
    };
  
    return requestOptions;
  
  }

const handleApiCall = (req, res) => {
  fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(req.body.input))
  .then(response => response.json())
  .then(data => res.json(data))
  .catch(err => res.status(400).json('unable to work with API'))
}

module.exports = {
	handleImage: handleImage,
  handleApiCall: handleApiCall
}