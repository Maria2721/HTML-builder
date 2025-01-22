const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');

function copyDir() {
  const folderPathWrite = path.join(__dirname, 'files-copy');

  // Delete the target directory if it exists
  fs.rm(folderPathWrite, { recursive: true, force: true }, (rmErr) => {
    if (rmErr) {
      console.error(`Error deleting folder: ${rmErr.message}`);
      return;
    }

    // Create a target directory
    fs.mkdir(folderPathWrite, { recursive: true }, (mkdirErr) => {
      if (mkdirErr) {
        console.error(`Error creating folder: ${mkdirErr.message}`);
        return;
      }

      // Reading the source directory
      fs.readdir(folderPath, { withFileTypes: true }, (readErr, files) => {
        if (readErr) {
          console.error(`Error reading folder: ${readErr.message}`);
          return;
        }

        // Copying files from source directory to target directory
        files.forEach((file) => {
          if (file.isFile()) {
            const filePath = path.join(folderPath, file.name);
            const filePathWrite = path.join(folderPathWrite, file.name);

            fs.copyFile(filePath, filePathWrite, (copyErr) => {
              if (copyErr) {
                console.error(
                  `Error copying file ${file.name}: ${copyErr.message}`,
                );
              } else {
                console.log(`File ${file.name} copied successfully`);
              }
            });
          }
        });
      });
    });
  });
}

// Tracking changes in the source directory
fs.watch(folderPath, { recursive: false }, (eventType, filename) => {
  if (filename) {
    console.log(`Change detected: ${eventType} in file ${filename}`);
    copyDir();
  }
});

copyDir();
