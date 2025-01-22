const { readFile, writeFile, mkdir, rm } = require('fs/promises');
const path = require('path');
const { bundleCss } = require('../05-merge-styles/index');
const { copyDir } = require('../04-copy-directory/index');

const filePathTemplate = path.join(__dirname, 'template.html');
const folderPathComponents = path.join(__dirname, 'components');
const folderPathStyles = path.join(__dirname, 'styles');
const folderPathAssets = path.join(__dirname, 'assets');

const folderPathWrite = path.join(__dirname, 'project-dist');
const filePathHtmlWrite = path.join(folderPathWrite, 'index.html');
const filePathStylesWrite = path.join(folderPathWrite, 'style.css');
const folderPathAssetsWrite = path.join(folderPathWrite, 'assets');

async function createHtml() {
  try {
    const content = await readFile(filePathTemplate, 'utf-8');
    let updatedContent = content;

    const matches = content.match(/{{(.*?)}}/g);
    if (matches) {
      const matchesName = matches.map((match) => match.replace(/{{|}}/g, ''));

      for (const match of matchesName) {
        const filePath = path.join(folderPathComponents, `${match}.html`);

        try {
          const component = await readFile(filePath, 'utf-8');
          updatedContent = updatedContent.replace(
            new RegExp(`{{${match}}}`, 'g'),
            component,
          );
        } catch (err) {
          console.error(
            `Error while reading component ${match}.html: ${err.message}`,
          );
        }
      }
    }

    await writeFile(filePathHtmlWrite, updatedContent);
  } catch (err) {
    console.error('Error while bundling HTML:', err.message);
  }
}

async function createProject() {
  try {
    await mkdir(folderPathWrite, { recursive: true });

    await createHtml().then(() => {
      console.log('HTML bundling completed successfully');
    });

    await bundleCss(folderPathStyles, filePathStylesWrite).then(() => {
      console.log('CSS bundling completed successfully');
    });

    await copyDir(folderPathAssets, folderPathAssetsWrite).then(() => {
      console.log('Assets folder copying completed successfully');
    });
  } catch (err) {
    console.error('Error while creating the project:', err.message);
  }
}

createProject().then(() => {
  console.log('Project build successfully');
});
