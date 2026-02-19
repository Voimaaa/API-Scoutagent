const express = require('express')
const app = express()
const port = 8080

app.use(cors());

app.get('/UserEmail', (req, res) => {
    const email = req.query.email;
    res.json({ email });
    console.log("Folgende Email vom User wurde erhalten: " + email);
})

app.listen(port, () => {
  console.log(`Scoutagent Server API is running.`)
})
