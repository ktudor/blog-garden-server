const express = require('express');
const server = express();

// Allow Cross Origin Resource Sharing
const cors = require('cors');
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

server.use(cors(corsOptions));

server.use(express.urlencoded({ extended: true }));

const initRoutes = require("./src/routes/web");
initRoutes(server);

// Add images route. Could not get it working otherwise.
server.use('/images', express.static(__dirname + '/uploaded_images'));

let port = 3000;
server.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});