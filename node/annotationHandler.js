const fs = require('fs');
const multer = require('multer');
const path = require('path');
const upload = multer();



module.exports = (app) => {
    app.post('/node/annotationHandler.js', upload.any(), async (req, res) => {
      const filename = req.query.filename;
  
      try {
       
        const directoryPath = 'public';  
  
  
        if (!fs.existsSync(directoryPath)) {
          fs.mkdirSync(directoryPath, { recursive: true });
        }
  
     
        const filePath = path.join(directoryPath, filename);
  
      
        fs.writeFileSync(filePath, req.files[0].buffer);
  
        res.status(200).send('scuess');
      } catch (e) {
      
        console.error(`error on ${filename}:`, e);
        res.status(500).send(`error writng to ${filename}`);
      }
    });
  };