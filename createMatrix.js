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

export default function createMatrix(sizeCell, sizeMatrix) {
    let matrix = []
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
            matrix.push(cell)
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