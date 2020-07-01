  
const express = require('express');
const uploadOriginalController = require("./src/controllers/upload-original");

const server = express();

const cors = require('cors');
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

server.use(cors(corsOptions));

server.post('/uploadOriginal', uploadOriginalController.uploadOriginal);

let port = 3000;
server.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});