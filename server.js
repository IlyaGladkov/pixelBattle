const express = require("express")
const fs = require('fs')

const app = express()

app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
		let data = await fs.promises.readFile('index.html', 'utf8');
		res.send(data)
	} catch (err) {
		console.log('что-то пошло не так');
	}
})

app.listen(3000, () => console.log("Server started"))