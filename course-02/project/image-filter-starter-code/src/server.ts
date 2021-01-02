import express from 'express';
import bodyParser from 'body-parser';
import {deleteLocalFiles, filterImageFromURL} from "./util/util";

(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    // GET endpoint: /filteredimage
    // Example: /filteredimage?image_url=https://vladflore.tech/assets/images/me.jpeg
    app.get('/filteredimage', async (req, res) => {
        const imageUrl = req.query.image_url;
        if (!imageUrl) {
            return res.status(400).send({message: 'Image URL is missing, provide image_url query parameter.'})
        }
        filterImageFromURL(imageUrl).then(filteredImagePath => {
            res.sendFile(filteredImagePath, () => {
                deleteLocalFiles([filteredImagePath]);
            })
        });
    });

    // Displays a simple message to the user
    app.get("/", async (req, res) => {
        res.send("try GET /filteredimage?image_url={{}}")
    });


    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();
