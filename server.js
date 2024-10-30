const fs = require('fs')
const express = require('express');

const NUMBER_CELLS = 1024
const SIZE_CELL = 10
const PIXELS_COLOR = {
    0: 'violet',
    1: 'blue',
    2: 'green',
    3: 'yellow',
    4: 'orange',
    5: 'red',
    6: 'white',
    7: 'black'
}

let app = express();

let expressWs = require('express-ws')(app);

app.use(express.static('public'))

app.get('/', async function (req, res, next) {
	console.log('get route', req.testing);
	try {
		let data = await fs.promises.readFile('index.html', 'utf8')
		res.send(data)
	} catch (err) {
		console.log('что-то пошло не так')
	}
	res.end()
})

function createMatrix(sizeCell, sizeMatrix) {
    let matrix = {
		cells: [],
		status: 200
	}
    let lastX = 0;
    let lastY = 0;
    let numberCell = sizeMatrix / sizeCell

    for (let posY = 0; posY < numberCell; posY++) {
        for (let posX = 0; posX < numberCell; posX++) {
            let cell = {
                x: lastX,
                y: lastY,
                color: PIXELS_COLOR[Math.floor(Math.random() * 7)]
            }
            matrix.cells.push(cell)
            if (lastX < sizeMatrix - sizeCell) {
                lastX = lastX + sizeCell
            } else {
                lastX = 0
            }
        }
        lastY += sizeCell
    }

    return matrix
}

app.ws('/', function (ws, req) {
	ws.send(JSON.stringify(createMatrix(SIZE_CELL, NUMBER_CELLS)))
});

app.listen(3000);