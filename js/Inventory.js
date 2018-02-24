console.log('connected');

function drawInventory() {

  console.log(canvasContext.currentTransform);

  canvasContext.save();
  canvasContext.fillStyle = 'white';
  canvasContext.rect(100, 50, 150, 100);
  canvasContext.fill();
  canvasContext.restore();
}