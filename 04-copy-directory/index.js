const { readdir, copyFile, mkdir, rm } = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const folderPathWrite = path.join(__dirname, 'files-copy');

async function copyDir(sourcePath, targetPath) {
  try {
    // Delete the target directory if it exists
    await rm(targetPath, { recursive: true, force: true });

    // Create a target directory
    await mkdir(targetPath, { recursive: true });

    // Reading the source directory
    const files = await readdir(sourcePath, { withFileTypes: true });

    // Copy the files or recursively copy subdirectories from the source directory
    for (const file of files) {
      const sourceFilePath = path.join(sourcePath, file.name);
      const targetFilePath = path.join(targetPath, file.name);

      if (file.isFile()) {
        await copyFile(sourceFilePath, targetFilePath);
      } else if (file.isDirectory()) {
        await copyDir(sourceFilePath, targetFilePath);
      }
    }
  } catch (err) {
    console.error(`Error while copying directory: ${err.message}`);
  }
}

if (require.main === module) {
  // Default copy operation
  copyDir(folderPath, folderPathWrite).then(() => {
    console.log('Directory copying completed successfully');
  });
}

module.exports = { copyDir };
