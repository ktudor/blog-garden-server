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

let port = 3000;
server.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});