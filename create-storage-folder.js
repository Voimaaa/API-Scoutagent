const fs = require('fs');
const path = require('path');

const folderName = process.argv[2];

const folderPath = path.join("/storage", folderName + "_storage");

if (fs.existsSync(folderPath)) {
    console.log('✅ Ordner "' + folderName + '" existiert bereits!');
} else {
    fs.mkdirSync(folderPath);
    console.log('🆕 Ordner "' + folderName + '" wurde erstellt!');
}
