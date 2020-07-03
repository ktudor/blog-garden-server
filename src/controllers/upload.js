const multer = require("multer");
const sharp = require("sharp");

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
      const newFilename = `gblog-${filename}-${Date.now()}.jpeg`;

      await sharp(file.buffer)
        //.resize(640, 320)
        .withMetadata()
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`C:/Files/Development/Angular/blog-garden images/${newFilename}`);

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
  const newFilename = `gblog-${filename}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    //.resize(640, 320)
    .withMetadata()
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`C:/Files/Development/Angular/blog-garden images/${newFilename}`);

  req.body.images.push(newFilename);

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