const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("./../controllers/upload");
const uploadOriginalController = require("./../controllers/upload-original");

let routes = app => {
  router.get("/", homeController.getHome);

  router.post(
    "/multiple-upload",
    uploadController.uploadImages,
    uploadController.resizeImages,
    uploadController.getResult
  );

  router.post(
    "/uploadOriginal",
    uploadOriginalController.uploadOriginal
  );

  return app.use("/", router);
};

module.exports = routes;