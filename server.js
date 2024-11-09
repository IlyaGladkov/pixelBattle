const fs = require('fs')
const express = require('express');

const NUMBER_CELLS = 1024
const SIZE_CELL = 10

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
        numberCells: NUMBER_CELLS,
        sizeCells: SIZE_CELL
	}
    let lastX = 0;
    let lastY = 0;
    let numberCell = sizeMatrix / sizeCell

    for (let posY = 0; posY < numberCell; posY++) {
        for (let posX = 0; posX < numberCell; posX++) {
            let cell = {
                x: lastX,
                y: lastY,
                color: 'white'
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

let defaultMatrix = createMatrix(SIZE_CELL, NUMBER_CELLS)

app.ws('/', function(ws, req) {
	ws.on('message', function(msg) {
		let pickedPixel = JSON.parse(msg)

		defaultMatrix.cells = defaultMatrix.cells.map((cell) => {
			if (cell.x === pickedPixel.x && cell.y === pickedPixel.y) {
				return {
					...cell,
					color: pickedPixel.color
				}
			}
			return cell
		})
	})
	ws.send(JSON.stringify(defaultMatrix))
});

app.listen(3000);