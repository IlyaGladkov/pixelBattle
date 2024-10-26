import createMatrix from "./createMatrix.js"

const width = window.innerWidth
const height = window.innerHeight
const SIZE_CELL = 10
const STROKE_WIDTH = 1
const NUMBER_CELLS = 150

const stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
  scale: { x: 1, y: 1 },
  draggable: true
})

const layer = new Konva.Layer()

let matrix = new Konva.Group({
  x: width / 2.2,
  y: height / 2.5,
  offset: {x: NUMBER_CELLS / SIZE_CELL,y: NUMBER_CELLS / SIZE_CELL}
})

for (let { x, y, color } of createMatrix(SIZE_CELL, 150)) {
  let newCell = new Konva.Rect({
    x: x,
    y: y,
    width: SIZE_CELL - STROKE_WIDTH,
    height: SIZE_CELL - STROKE_WIDTH,
    fill: color
  })

  newCell.addEventListener('click', function () {
    this.fill('red')
  })

  newCell.addEventListener('mouseover', function () {
    this.stroke('white');
    this.strokeWidth(STROKE_WIDTH);
  })

  newCell.addEventListener('mouseout', function () {
    this.stroke('');
    this.strokeWidth(0);
  })

  matrix.add(newCell)
}

let scale = 1

stage.addEventListener('wheel', function (e) {
  e.preventDefault()

  scale += e.deltaY * -0.05

  if (scale <= 1) {
    scale = 1
  }

  matrix.scale({
    x: scale,
    y: scale
  })
})

layer.add(matrix)
stage.add(layer)