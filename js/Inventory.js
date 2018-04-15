var inventoryItems = [
  {
    displayName: 'Karaage',
    itemObtained: false
  },
  {
    displayName: 'Karaage',
    itemObtained: false
  },
  {
    displayName: 'Karaage',
    itemObtained: false
  },
  {
    displayName: 'Karaage',
    itemObtained: false
  },
  {
    displayName: 'Avocado',
    itemObtained: false
  },
  {
    displayName: 'Toast',
    itemObtained: false
  },
  {
    displayName: 'Soil',
    itemObtained: false
  },
  {
    displayName: 'Plant Seed',
    itemObtained: false
  },
  {
    displayName: 'Waterbucket',
    itemObtained: false
  },
  {
    displayName: 'Egg Sushi',
    itemObtained: false
  },
  {
    displayName: 'Salmon Sushi',
    image: null,
    itemObtained: false
  },
  {
    displayName: '',
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

function imageLoadingDoneSoAssignInventoryImages() {
  inventoryItems[ITEM_KARAAGE_ONE].image = worldPics[TILE_KARAAGE];
  inventoryItems[ITEM_KARAAGE_TWO].image = worldPics[TILE_KARAAGE];
  inventoryItems[ITEM_KARAAGE_THREE].image = worldPics[TILE_KARAAGE];
  inventoryItems[ITEM_KARAAGE_FOUR].image = worldPics[TILE_KARAAGE];
  inventoryItems[ITEM_AVOCADO].image = worldPics[TILE_AVOCADO];
  inventoryItems[ITEM_TOAST].image = worldPics[TILE_TOAST];
  inventoryItems[ITEM_SOIL].image = worldPics[TILE_SOIL];
  inventoryItems[ITEM_PLANT_SEED].image = worldPics[TILE_SEED];
  inventoryItems[ITEM_WATERBUCKET].image = worldPics[TILE_BUCKET];
  inventoryItems[ITEM_EGG_SUSHI].image = worldPics[TILE_EGG_SUSHI];
  inventoryItems[ITEM_SALMON_SUSHI].image = worldPics[TILE_SALMON_SUSHI];
}

// Special functionality for picking up karaage
function pickUpKaraage() {
  if (!inventoryItems[ITEM_KARAAGE_ONE].itemObtained) {
    pickUpItemType(ITEM_KARAAGE_ONE);
  }
  else if (!inventoryItems[ITEM_KARAAGE_TWO].itemObtained) {
    pickUpItemType(ITEM_KARAAGE_TWO);
  }
  else if (!inventoryItems[ITEM_KARAAGE_THREE].itemObtained) {
    pickUpItemType(ITEM_KARAAGE_THREE);
  }
  else if (!inventoryItems[ITEM_KARAAGE_FOUR].itemObtained) {
    pickUpItemType(ITEM_KARAAGE_FOUR);
  }
  else {
    console.log("Uh oh, can't pick up any more karaage!");
  }
}

function hasItem(itemType){
  return inventoryItems[itemType].itemObtained;
}

function pickUpItemType(itemType) {
  inventoryItems[itemType].itemObtained = true;
}

function moveInventory(keyCode) {
  if (keyCode === KEY_RIGHT_ARROW) {
    currentInventoryIndex++;
  }
  else if (keyCode === KEY_LEFT_ARROW) {
    currentInventoryIndex--;
  }
  else if (keyCode === KEY_UP_ARROW) {
    currentInventoryIndex = currentInventoryIndex - 4;
  }
  else if (keyCode === KEY_DOWN_ARROW) {
    currentInventoryIndex = currentInventoryIndex + 4;
  }
  else if (keyCode === KEY_SPACE) {
    if (currentInventoryIndex == ITEM_KARAAGE_ONE) {
      if (inventoryItems[currentInventoryIndex].itemObtained) {
        itemHealsPlayer();
        inventoryItems[currentInventoryIndex].itemObtained = false;
      }
    }
    else if (currentInventoryIndex == ITEM_KARAAGE_TWO) {
      if (inventoryItems[currentInventoryIndex].itemObtained) {
        itemHealsPlayer();
        inventoryItems[currentInventoryIndex].itemObtained = false;
      }
    }
    else if (currentInventoryIndex == ITEM_KARAAGE_THREE) {
      if (inventoryItems[currentInventoryIndex].itemObtained) {
        itemHealsPlayer();
        inventoryItems[currentInventoryIndex].itemObtained = false;
      }
    }
    else if (currentInventoryIndex == ITEM_KARAAGE_FOUR) {
      if (inventoryItems[currentInventoryIndex].itemObtained) {
        itemHealsPlayer();
        inventoryItems[currentInventoryIndex].itemObtained = false;
      }
    }
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

  //canvasContext.restore();

  drawPixelfont("ITEMS", 150, 25);
  drawPixelfont(inventoryItems[currentInventoryIndex].displayName, 135, 150);
};

function drawInventoryItems() {
  for (var i = 0; i < inventoryItems.length; i++) {
    var itemX = menuX + itemCellMarginX + ((itemCellWidth + itemCellBetweenX) * (i % numCols));
    var itemY = menuY + itemCellMarginY + ((itemCellHeight + itemCellBetweenY) * Math.floor(i / numCols));
    if (inventoryItems[i].itemObtained) {
      image = inventoryItems[i].image;
      canvasContext.drawImage(image, itemX + 5, itemY + 5);
    }
  };
};
