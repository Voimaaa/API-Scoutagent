const express = require('express')
const { execSync } = require('child_process');
const app = express()
const port = 8080

app.get('/createStorageFolder', (req, res) => {
    const email = req.query.email;
    
    try {
        execSync(`node create-storage-folder.js "${email}"`, { 
            stdio: 'inherit',  // Logs anzeigen!
            cwd: process.cwd() // Working Directory
        });
        
        res.json({ 
            success: true, 
            folder: `${email}_storage`,
            message: 'Ordner erstellt!' 
        });
        
    } catch (error) {
        console.error('Script Fehler:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.listen(port, () => {
  console.log(`Scoutagent Server API is running.`)
})
