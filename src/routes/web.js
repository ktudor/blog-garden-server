const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("./../controllers/upload");
const galleryController = require("../controllers/gallery");

let routes = app => {
  router.get("/", homeController.getHome);

  router.post(
    "/multiple-upload",
    uploadController.uploadImages,
    uploadController.resizeImages,
    uploadController.getResult
  );

  router.post(
    "/single-upload",
    uploadController.uploadSingleImage,
    uploadController.resizeImage,
    uploadController.returnImageName
  );

  router.get(
    "/gallery",
    galleryController.getGallery
  );

  router.get(
    "/thumbnail",
    galleryController.getThumbnail
  );

  return app.use("/", router);
};

module.exports = routes;