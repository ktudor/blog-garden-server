const express = require('express');
const uploadOriginalController = require("./controllers/upload-original");

const server = express();

// Allow Cross Origin Resource Sharing
const cors = require('cors');
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

server.use(cors(corsOptions));

//Is this messing with cors?
server.use(express.urlencoded({ extended: true }));

const initRoutes = require("./routes/web");
initRoutes(server);
// Try manually set single route
//server.post('/uploadOriginal', uploadOriginalController.uploadOriginal);

let port = 3000;
server.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});