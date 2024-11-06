const width = window.innerWidth
const height = window.innerHeight
const SIZE_CELL = 10
const STROKE_WIDTH = 0.5
const NUMBER_CELLS = 150

let pickedColor = null

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
  y: height / 2,
  offset: { x: NUMBER_CELLS / 2, y: NUMBER_CELLS / 2 }
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

socket.onmessage = function(event) {
  let dataMatrix = JSON.parse(event.data).cells
  console.log(dataMatrix)

  for (let { x, y, color } of dataMatrix) {
    let newCell = new Konva.Rect({
      x: x,
      y: y,
      width: SIZE_CELL - STROKE_WIDTH,
      height: SIZE_CELL - STROKE_WIDTH,
      fill: color
    })
  
    newCell.addEventListener('click', function () {
      if (pickedColor) this.fill(pickedColor)
      
      socket.send(JSON.stringify({
        x: this.attrs.x,
        y: this.attrs.y,
        color: pickedColor
      }))
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
}

//create matrix with konva
let scale = 1

stage.addEventListener('wheel', function (e) {
  e.preventDefault()

  scale += e.deltaY * -0.01

  if (scale <= 0.125) scale = 0.125

  matrix.scale({
    x: scale,
    y: scale
  })
})

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