const width = window.innerWidth
const height = window.innerHeight
const STROKE_WIDTH = 0.5

let pickedColor = 'white'
let SIZE_CELL
let NUMBER_CELLS

// creation stage and layer
const stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
  scale: { x: 0.5, y: 0.5 },
  draggable: true
})

stage.addEventListener('mousedown', function () {
  document.body.style.cursor = 'grab'
})

stage.addEventListener('mouseup', function () {
  document.body.style.cursor = 'default'
})

const layer = new Konva.Layer()

let matrix = new Konva.Group({
  x: width / 1.3,
  y: height / 2
})

matrix.on('click', function (e) {
  if (pickedColor !== undefined) e.target.fill(pickedColor)

  socket.send(JSON.stringify({
    x: e.target.attrs.x,
    y: e.target.attrs.y,
    color: pickedColor
  }))
})

matrix.on('click', function (e) {
  console.log(e.target)
  if (pickedColor !== undefined) e.target.fill(pickedColor)

  socket.send(JSON.stringify({
    x: e.target.attrs.x,
    y: e.target.attrs.y,
    color: pickedColor
  }))
})

// WebSocket 
let socket = new WebSocket("ws://localhost:3000")

socket.onopen = function () {
    console.log('Start')
}

socket.onclose = function (event) {
    if (event.wasClean) {
        alert('Соединение закрыто чисто')
    } else {
        alert('Обрыв соединения')
    }
    alert('Код: ' + event.code + ' причина: ' + event.reason)
}

function createPull(data) {
  matrix.destroyChildren()
  for (let { x, y, color } of data) {
    let newCell = new Konva.Rect({
      x: x,
      y: y,
      width: SIZE_CELL - STROKE_WIDTH,
      height: SIZE_CELL - STROKE_WIDTH,
      fill: color
    })

    newCell.on('mouseover', function () {
      this.stroke('white');
      this.strokeWidth(STROKE_WIDTH);
    })

    newCell.on('mouseout', function () {
      this.stroke('');
      this.strokeWidth(0);
    })

    matrix.add(newCell)
  }
}

//create matrix with konva
socket.onmessage = function(event) {
  SIZE_CELL = JSON.parse(event.data).sizeCells
  NUMBER_CELLS = JSON.parse(event.data).numberCells
  let dataMatrix = JSON.parse(event.data).cells
  createPull(dataMatrix)
}

// wheel event
stage.addEventListener('wheel', function (e) {
  e.preventDefault()

  const scaleBy = 1.1
  const oldScale = stage.scaleX()
  const mousePointTo = {
    x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
    y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
  }
  const newScale = e.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

  stage.scale({ x: newScale, y: newScale });

  const newPos = {
    x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
    y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
  };
  stage.position(newPos);

  stage.batchDraw();
})

// active or not palette
let palette = document.querySelector('.palette')
let paletteColor = document.querySelectorAll('.palette-color')
palette.addEventListener('click', function (e) {
  pickedColor = e.target.dataset.color
  for (let item of paletteColor) {
    item.classList.remove('active')
  }
  e.target.classList.add('active')
})

layer.add(matrix)
stage.add(layer)