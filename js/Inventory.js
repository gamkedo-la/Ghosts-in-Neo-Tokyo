var inventoryItems = [
  {
    displayName: 'Karaage 1',
    image: null,
    itemObtained: false
  },
  {
    displayName: 'Karaage 2',
    image: null,
    itemObtained: false
  },
  {
    displayName: 'Karaage 3',
    image: null,
    itemObtained: false
  },
  {
    displayName: 'Karaage 4',
    image: null,
    itemObtained: false
  },
  {
    displayName: 'Avocado',
    image: null,
    itemObtained: false
  },
  {
    displayName: 'Toast',
    image: null,
    itemObtained: false
  },
  {
    displayName: 'Soil',
    image: null,
    itemObtained: false
  },
  {
    displayName: 'Plant Seed',
    image: null,
    itemObtained: false
  },
  {
    displayName: 'Waterbucket',
    image: null,
    itemObtained: false
  },
  {
    displayName: '[undefined10]',
    image: null,
    itemObtained: false
  },
  {
    displayName: '[undefined11]',
    image: null,
    itemObtained: false
  },
  {
    displayName: '[undefined12]',
    image: null,
    itemObtained: false
  },
];

var currentInventoryIndex = 0;

var menuX = 40;
var menuY = 20;
var menuWidth = 240;
var menuHeight = 140;
var numItems = 12;
var numCols = 4;
var itemCellWidth = 30;
var itemCellHeight = 30
var itemCellMarginX = 25;
var itemCellMarginY = 15;
var itemCellBetweenX = 25;
var itemCellBetweenY = 10;

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
  //canvasContext.save();
  canvasContext.fillStyle = 'black';
  canvasContext.strokeStyle = 'white';
  canvasContext.strokeRect(menuX, menuY, menuWidth, menuHeight);
  canvasContext.fillRect(menuX, menuY, menuWidth, menuHeight);

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
  }; 

  canvasContext.restore();

  drawPixelfont("ITEMS", 150, 25);
  drawPixelfont(inventoryItems[currentInventoryIndex].displayName, 135, 150);
};

function drawInventoryItems() {
  for (var i = 0; i < inventoryItems.length; i++) {
    var itemX = menuX + itemCellMarginX + ((itemCellWidth + itemCellBetweenX) * (i % numCols));
    var itemY = menuY + itemCellMarginY + ((itemCellHeight + itemCellBetweenY) * Math.floor(i / numCols));
    if (inventoryItems[i].itemObtained) {
      // TODO: select image based on item
      canvasContext.drawImage(worldPics[TILE_AVOCADO], itemX + 5, itemY + 5);
    }
  };
};
