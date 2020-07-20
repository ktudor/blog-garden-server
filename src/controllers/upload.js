const multer = require("multer");
const sharp = require("sharp");

const imageDirectory = "C:/Files/Development/Angular/blog-garden-server/uploaded_images";
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const uploadFiles = upload.array("images[]", 10);

const uploadImages = (req, res, next) => {
  uploadFiles(req, res, err => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Too many files to upload.");
      }
    } else if (err) {
      return res.send(err);
    }

    next();
  });
};

const resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async file => {
      const filename = file.originalname.replace(/\..+$/, "");
      const newFilename = `gblog-${filename}-${Date.now()}.jpg`;

      // From https://sharp.pixelplumbing.com/api-input
      const image = sharp(file.buffer);
      await image
        .metadata()
        .then(function (metadata) {
          image
            .rotate()
            .resize(Math.round(metadata.width / 2))
            .withMetadata()
            .toFormat("jpeg")
            .jpeg({ quality: 72 })
            .toFile(`${imageDirectory}/${newFilename}`);
            });

      req.body.images.push(newFilename);
    })
  );

  next();
};

const getResult = async (req, res) => {
  if (req.body.images.length <= 0) {
    return res.send(`You must select at least 1 image.`);
  }

  const images = req.body.images
    .map(image => "" + image + "")
    .join("");

  return res.send(`Images were uploaded:${images}`);
};

const uploadSingleFile = upload.single("image");

const uploadSingleImage = (req, res, next) => {
  uploadSingleFile(req, res, err => {
    if (err instanceof multer.MulterError) {
      // TODO: What error codes should be specifically caught?
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Only select a single file.");
      }
    } else if (err) {
      return res.send(err);
    }

    next();
  });
};

const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  req.body.images = [];
  const filename = req.file.originalname.replace(/\..+$/, "");
  const newFilename = `gblog-${filename}-${Date.now()}.jpg`;

  // From https://sharp.pixelplumbing.com/api-input
  // and https://github.com/lovell/sharp/issues/1897
  const processedImage = sharp(await sharp(req.file.buffer).rotate().toBuffer());

  // Process main file
  await processedImage.metadata()
  .then(info => {
    const md = info;
    console.log(`File: ${filename}`);
    console.log(`Metadata height/width/size: ${md.height}/${md.width}/${md.size}`);
    if (md.width > md.height) {
      console.log(`resizing width from ${md.width}`);
      processedImage.resize(600, null, {fit: 'cover'});
    } else {
      console.log(`resizing height from ${md.height}`);
      processedImage.resize(null, 600, {fit: 'cover'});
    }
  
    processedImage
      .jpeg({ quality: 72 })
      .withMetadata()
      .toFormat("jpg")
      .toFile(`${imageDirectory}/${newFilename}`)
      .then(info => {
        console.log(`File: ${newFilename}`);
        console.log(`Metadata height/width/size/format: ${info.height}/${info.width}/${info.size}/${info.format}`);

        req.body.images.push(`${newFilename}`);
      })
      .catch(err => {
        console.log(err);
      });
  });

  // Create thumbnail
  const processedThumbnailImage = sharp(await sharp(req.file.buffer).rotate().toBuffer());

  await processedThumbnailImage
    .resize(300, 300, {fit: 'cover'})
    .jpeg({ quality: 72 })
    .withMetadata()
    .toFormat("jpg")
    .toFile(`${imageDirectory}/thumbnail/${newFilename}`)
    .then(info => {
      console.log(`File: ${newFilename}`);
      console.log(`Metadata height/width/size/format: ${info.height}/${info.width}/${info.size}/${info.format}`);
    })
    .catch(err => {
      console.log(err);
    });

  next();
};

const returnImageName = async (req, res) => {
  return res.send(req.body.images[0]);
};

module.exports = {
  uploadImages: uploadImages,
  uploadSingleImage: uploadSingleImage,
  resizeImages: resizeImages,
  resizeImage: resizeImage,
  getResult: getResult,
  returnImageName: returnImageName
};