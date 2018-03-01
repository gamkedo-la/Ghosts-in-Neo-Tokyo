var inventoryItems = [
  {
    displayName: 'Karaage 1'
  },
  {
    displayName: 'Karaage 2'
  },
  {
    displayName: 'Karaage 3'
  },
  {
    displayName: 'Karaage 4'
  },
  {
    displayName: 'Avocado'
  },
  {
    displayName: 'Toast'
  },
  {
    displayName: 'Soil'
  },
  {
    displayName: 'Plant Seed'
  },
  {
    displayName: 'Waterbucket'
  },
  {
    displayName: '[undefined10]'
  },
  {
    displayName: '[undefined11]'
  },
  {
    displayName: '[undefined12]'
  },
];

var currentInventoryIndex = 0;

function moveInventory(keyName) {
  if (keyName === 'right') {
    currentInventoryIndex++;
  }
  else if (keyName === 'left') {
    currentInventoryIndex--;
  }
  else if (keyName === 'up') {
    currentInventoryIndex = currentInventoryIndex - 4;
  }
  else if (keyName === 'down') {
    currentInventoryIndex = currentInventoryIndex + 4;
  }

  if (currentInventoryIndex >= inventoryItems.length) {
    currentInventoryIndex = currentInventoryIndex - inventoryItems.length;
  }
  else if (currentInventoryIndex < 0) {
    currentInventoryIndex = currentInventoryIndex + inventoryItems.length;
  }
}

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
    
    if (i === currentInventoryIndex) {
      canvasContext.fillStyle = 'yellow';
    }
    else {
      canvasContext.fillStyle = 'DarkSlateBlue';
    }
    canvasContext.fillRect(itemCellX, itemCellY, itemCellWidth, itemCellHeight);
    canvasContext.restore();
  }

  canvasContext.restore();

  pixelfont_draw("ITEMS", 150, 25);
  pixelfont_draw(inventoryItems[currentInventoryIndex].displayName, 135, 150);
}
