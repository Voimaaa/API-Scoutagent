const fs = require('fs');
const path = require('path');

const folderName = process.argv[2];
const folderPath = path.join("/storage", folderName + "_storage");
const filePath = path.join(folderPath, "email.txt");  // ← DATEI im Ordner!

if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log('🆕 Ordner erstellt!');
}

// IMMER Datei schreiben (egal ob Ordner neu/existiert)
fs.writeFileSync(filePath, "Das ist meine Email!");
console.log('✅ Datei geschrieben:', filePath);

// Datei lesen
let emailContent = fs.readFileSync(filePath, 'utf8');
console.log('📄 Inhalt:', emailContent);
