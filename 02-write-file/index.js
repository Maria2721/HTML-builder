const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const filePath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(filePath);

stdout.write('Hello, enter your message!\n');

stdin.on('data', (data) => {
  const dataString = data.toString().trim();
  if (dataString === 'exit') {
    exit();
  } else {
    output.write(data);
  }
});

process.on('SIGINT', () => exit());

process.on('exit', () => stdout.write('Thanks for your messages, goodbye!\n'));
