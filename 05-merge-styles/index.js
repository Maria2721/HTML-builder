const fs = require('fs');
const { readdir, readFile, writeFile } = require('fs/promises');
const path = require('path');

const folderPathRead = path.join(__dirname, 'styles');
const filePathWrite = path.join(__dirname, 'project-dist', 'bundle.css');

let isProcessing = false;

async function bundleCss() {
  try {
    // Reading the source directory
    const files = await readdir(folderPathRead, { withFileTypes: true });

    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    // Reading all CSS files
    let data = '';
    for (const file of cssFiles) {
      const filePath = path.join(folderPathRead, file.name);
      const content = await readFile(filePath, 'utf-8');
      data += content + '\n';
    }

    // Writing styles to the bundle.css file
    await writeFile(filePathWrite, data);
    console.log('CSS files writing into bundle.css successfully');
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

// Tracking changes in the source directory
fs.watch(folderPathRead, { recursive: false }, async (eventType, filename) => {
  if (filename && path.extname(filename) === '.css') {
    console.log(`Change detected: ${eventType} in file ${filename}`);

    if (isProcessing) {
      console.log('Processing is already in progress!');
      return;
    }

    isProcessing = true;
    try {
      await bundleCss();
    } finally {
      isProcessing = false;
    }
  }
});

bundleCss();
