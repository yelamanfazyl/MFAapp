const dotenv = require('dotenv');
dotenv.config();
// const fs = require("fs");

module.exports = {    
    compareFaces: async (source, target) => {
        const AWS = require('aws-sdk')
        const config = new AWS.Config({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        })

        const client = new AWS.Rekognition();

        target = target.substr(22);
        source = source.substr(22);

        const source_buffer = Buffer.from(source, 'base64');
        const target_buffer = Buffer.from(target, 'base64');
        
        const params = {
            SourceImage: {
                Bytes: source_buffer
            },
            TargetImage: {
                Bytes: target_buffer
            },
            SimilarityThreshold: 0
          }
        client.compareFaces(params, function(err, response) {
            if (err) {
            console.log(err, err.stack); // an error occurred
            } else {
            response.FaceMatches.forEach(data => {
                let position   = data.Face.BoundingBox
                let similarity = data.Similarity
                console.log(`The face at: ${position.Left}, ${position.Top} matches with ${similarity} % confidence`)
                return similarity;
            }) // for response.faceDetails
            } // if
        });
    }
};
