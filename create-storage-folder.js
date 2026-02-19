const fs = require('fs');
const path = require('path');

const email = process.argv[2];
const folderPath = path.join("/storage", email + "_storage");
const filePath = path.join(folderPath, "email.txt");  

if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log("Storage-Folder für neuen Benutzer wurde angelegt! Folder: " + folderPath);
}

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, email);
    console.log('E-Mail wurde gespeichert! Speicher-Ort: ' + filePath);
}

let emailContent = fs.readFileSync(filePath, 'utf8');
console.log('Email des Benutzers lautet wie folgt: ' + emailContent);
