const express = require('express')
const { execSync } = require('child_process');
const app = express()
const port = 8080

app.get('/createStorageFolder', (req, res) => {
    const email = req.query.email;
    res.json({ email });
    console.log("Folgende Email vom User wurde erhalten: " + email);

    try {
      execSync(`node create-storage-folder.js "${email}"`, { stdio: 'pipe' });
    } catch {
      res.status(500).json({ error: error.message });
    }
})

app.listen(port, () => {
  console.log(`Scoutagent Server API is running.`)
})
