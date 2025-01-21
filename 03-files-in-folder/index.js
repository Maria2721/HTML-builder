const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    console.log('Information about files:');
    files.forEach((file) => {
      if (file.isFile()) {
        let fileName = path.parse(file.name).name;
        let extension = path.extname(file.name).slice(1);

        const filePath = path.join(folderPath, file.name);
        fs.stat(filePath, (err, stats) => {
          if (err) console.log(err);
          else {
            let fileSize = (stats.size / 1024).toFixed(3);
            console.log(`${fileName} - ${extension} - ${fileSize}kb`);
          }
        });
      }
    });
  }
});
