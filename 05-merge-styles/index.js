const { readdir, readFile, writeFile } = require('fs/promises');
const path = require('path');

const folderPathRead = path.join(__dirname, 'styles');
const filePathWrite = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundleCss(sourcePath, targetPath) {
  try {
    // Reading the source directory
    const files = await readdir(sourcePath, { withFileTypes: true });

    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    // Reading all CSS files and writing their contents to a variable
    let data = '';
    for (const file of cssFiles) {
      const filePath = path.join(sourcePath, file.name);
      const content = await readFile(filePath, 'utf-8');
      data += content + '\n';
    }

    // Writing styles to the bundle.css file
    await writeFile(targetPath, data);
  } catch (err) {
    console.error('Error while bundling CSS:', err.message);
  }
}

if (require.main === module) {
  // Default copy operation
  bundleCss(folderPathRead, filePathWrite).then(() => {
    console.log('CSS bundling completed successfully');
  });
}

module.exports = { bundleCss };
