const fs = require("fs");
const multer = require("multer");
const path = require("path");
const upload = multer();

module.exports = (app) => {
  app.post("/node/annotationHandler.js", upload.any(), async (req, res) => {
    const filename = req.query.filename;

    try {
      const tempFolderPath = path.resolve(__dirname, "../public/");
      if (!fs.existsSync(tempFolderPath)) {
        fs.mkdirSync(tempFolderPath);
      }

      const filePath = path.join(tempFolderPath, filename);
      console.log(filePath);

      fs.writeFileSync(filePath, req.files[0].buffer);

      res.status(200).send("success");
    } catch (e) {
      console.error(`error on ${filename}:`, e);
      res.status(500).send(`error writing to ${filename}`);
    }
  });
};
