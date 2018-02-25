function drawInventory() {
  var menuX = 40;
  var menuY = 20;
  var menuWidth = 240;
  var menuHeight = 140;

  canvasContext.save();
  canvasContext.fillStyle = 'black';
  canvasContext.strokeStyle = 'white';
  canvasContext.strokeRect(menuX, menuY, menuWidth, menuHeight);
  canvasContext.fillRect(menuX, menuY, menuWidth, menuHeight);

  var numItems = 12;
  var numCols = 4;
  var itemCellWidth = 30;
  var itemCellHeight = 30
  var itemCellMarginX = 25;
  var itemCellMarginY = 15;
  var itemCellBetweenX = 25;
  var itemCellBetweenY = 10;
  for (var i = 0; i < numItems; i++) {
    var itemCellX = menuX + itemCellMarginX + ((itemCellWidth + itemCellBetweenX) * (i % numCols));
    var itemCellY = menuY + itemCellMarginY + ((itemCellHeight + itemCellBetweenY) * Math.floor(i / numCols));
    canvasContext.save();
    canvasContext.fillStyle = 'yellow';
    canvasContext.fillRect(itemCellX, itemCellY, itemCellWidth, itemCellHeight);
    canvasContext.restore();
  }

  canvasContext.restore();
}
