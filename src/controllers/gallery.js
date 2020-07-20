// Source: https://www.codexpedia.com/node-js/node-js-http-server-displaying-images-from-a-directory/

const url = require('url');
const fs = require('fs');
const path = require('path');

const getGallery = async (req, res) => {
  //use the url to parse the requested url and get the image name
  const query = url.parse(req.url,true).query;
  const pic = query.image;
  const imageDir = './uploaded_images/';

  if (typeof pic === 'undefined') {
    getImages(imageDir, function (err, files) {
      let items = []; 
      // TODO: Get rid of hard-coded url
      for (i=0; i<files.length; i++) {
        items.push({ title: files[i], link: `http://localhost:3000/gallery?image=${files[i]}` })
      }
      res.writeHead(200, {'Content-type':'application/json'});
      let imageLists = { title: 'Gallery Images', items: items };
      res.end(JSON.stringify(imageLists));
      /*
      let imageLists = '<ul>';
      for (i=0; i<files.length; i++) {
        imageLists += '<li><a href="/?image=' + files[i] + '">' + files[i] + '</li>';
      }
      imageLists += '</ul>';
      res.writeHead(200, {'Content-type':'text/html'});
      res.end(imageLists);
      */
    });
  } else {
    //read the image using fs and send the image content back in the response
    fs.readFile(imageDir + pic, function (err, content) {
      if (err) {
        res.writeHead(400, {'Content-type':'text/html'})
        console.log(err);
        res.end("No such image");
      } else {
        //specify the content type in the response will be an image
        res.writeHead(200,{'Content-type':'image/jpg'});
        res.end(content);
      }
    });
  }

  return res;
}

const getThumbnail = async (req, res) => {
  //use the url to parse the requested url and get the image name
  const query = url.parse(req.url,true).query;
  const pic = query.image;
  const thumbnailDir = './uploaded_images/thumbnail/';

  if (typeof pic === 'undefined') {
    res.writeHead(400, {'Content-type':'text/html'})
    console.log(err);
    res.end("No such image");
  } else {
    //read the image using fs and send the image content back in the response
    fs.readFile(thumbnailDir + pic, function (err, content) {
      if (err) {
        res.writeHead(400, {'Content-type':'text/html'})
        console.log(err);
        res.end("No such image");
      } else {
        //specify the content type in the response will be an image
        res.writeHead(200,{'Content-type':'image/jpg'});
        res.end(content);
      }
    });
  }

  return res;
}
 
//get the list of jpg files in the image dir
function getImages(imageDir, callback) {
  var fileType = '.jpg',
      files = [], i;
  fs.readdir(imageDir, function (err, list) {
    for(i=0; i<list.length; i++) {
      if(path.extname(list[i]) === fileType) {
        files.push(list[i]); //store the file name into the array files
      }
    }
    callback(err, files);
  });
}

module.exports = {
  getGallery: getGallery,
  getThumbnail: getThumbnail
}