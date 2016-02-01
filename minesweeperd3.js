/*
Minesweeper in D3
Jiayi Sun

This is a D3 implementation of the popular Minesweeper game in D3 and follows all of the traditional rules.  Players can choose one of the following difficulties:
  - Beginner, 10 mines on a 9x9 grid
  - Intermediate, 40 mines on a 16x16 grid
  - Advanced, 99 mines on a 16x30 grid
  - Custom players can choose height, width and number of mines
In some versions of minesweeper, players can designate mines in two ways, right clicking and shift clicking.  Shift clicking a tile with a designated mine count equal to the number of marked mines around it will either cause the player to lose if the mine is designated in correctly, or all of the squares not revealed around that number to be revealed.

Created : Janurary 18, 2016
*/

// Define difficulties dictionary
var difficulties = [
  {
    level: 'beginner',
    xTileN: 9,
    yTileN: 9,
    nMines: 10
  },
  {
    level:'intermediate',
    xTileN: 16,
    yTileN: 16,
    nMines: 40
  },
  {
    level:'advanced',
    xTileN: 30,
    yTileN: 16,
    nMines: 99,
  }
]

// Define minesweeper default variables
tileSize = 20
mineCols = ['#0100FE', '017F07', '#FE0000', '#010080', '#810102', '#008081', '#000000',
'#808080']

// Add input fields if selected difficulty is custom to the div #customgameopts

// Mine counter
var selDiff = d3.select("#difficulty").node().value
for (d = 0; d < difficulties.length; d++) {
  if (difficulties[d].level === selDiff) {
    var diffSelDict = difficulties[d]
  }
}
var mineCounter = diffSelDict.nMines
var xTiles = diffSelDict.xTileN
var yTiles = diffSelDict.yTileN
gameOver = false

// Time counter

// Mine field plotting logic, added to #minefield
var test = getMineMap(xTiles, yTiles, mineCounter)

d3.select("#difficulty")
  .on('change', function() {
    diffSelect = d3.select(this).property('value')
    for (d = 0; d < difficulties.length; d++) {
      if (difficulties[d].level === diffSelect) {
        var diffSelDict = difficulties[d]
      }
    }
    test = getMineMap(diffSelDict.xTileN, diffSelDict.yTileN, diffSelDict.nMines)
    console.log(test)
    updateTileGrid(test)
    updateTextGrid(test)
    var mineBorder = d3.select('svg')
    mineBorder.attr('width', tileSize * (diffSelDict.xTileN + 2))
    mineBorder.attr('height', tileSize * (diffSelDict.yTileN + 2))
  });

var minefield = d3.select("#minefield")
  .append("svg")
  .attr("width", tileSize * (xTiles + 2))
  .attr("height", tileSize * (yTiles + 2));

// var mineTiles = minefield.append('g');

var tiles = minefield.selectAll('rect')
  .data(test)
  .enter()
  .append('rect')
  .attr('class', function(d) {
    return (d.reveal ? 'tileRevealed' : 'tile')
  })
  .attr('width', tileSize)
  .attr('height', tileSize)
  .attr('x', function(d) {
    return d.x * tileSize;
  })
  .attr('y', function(d) {
    return d.y * tileSize;
  })
  .on('mouseover', function(d) console.log(d))
  .on('click', function(d, i) {
    test.forEach(function(a) {
      if (a.index-1 === i && !a.reveal) {
        a.reveal = true
      }
    })
    var tile = d3.select(this);
    tile.attr('class', 'tileRevealed')
    leftClickLogic(i, test, gameOver, xTiles, yTiles)
    updateTileGrid(test)
    updateTextGrid(test)
  })

var mineText = minefield.selectAll('text')
  .data(test)
  .enter()
  .append('g')

mineText.append("text")
  .each(function(d, i) {
      d3.select(this).append("tspan")
        .text(function(d) {return d.reveal ? (d.value == 0 ? null : d.value) : null})
        .attr("x", d.x * tileSize + tileSize/2)
        .attr("y", d.y * tileSize + tileSize*2/3)
        .attr("fill", function(d){
          return d.value > 0 ? mineCols[d.value-1] :
            (d.value < 0 ? 'pink' : 'white')
        })
        .attr("font-family", "courier")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("text-anchor","middle")
  })
  .on('click', function(d, i) {
    test.forEach(function(a) {
      if (a.index-1 === i && !a.reveal) {
        a.reveal = true
        var tile = d3.select(this);
        tile.attr('class', 'tileRevealed')
        leftClickLogic(i, test, gameOver, xTiles, yTiles)
        updateTextGrid(test)
        updateTileGrid(test)
      }
    })
  });

// Left click logic
function leftClickLogic(tileInd, mineM, gameOver, xT, yT) {
  tile = mineM[tileInd]
  if (tile.value < 0) {
    gameOver = true
  } else {
    calcRevealAreas(tileInd, mineM, xT, yT)
  }
}

// Shift left-click logic
function shiftLeftClick(tileInd, mineM, gameOver) {
  tile = mineM[tileInd]

  if (!tile.reveal) {
    mineM[tileInd].flag = true
  } else if (tile.flag) {
    mineM[tileInd].question = true
  } else if (tile.question) {
    mineM[tileInd].reveal = false
  } else {
    // Call calcRevealAreas
    // Update game board
  }
  return mineM
}

// If square has no flag, put a flag
// If square has flag, put a question mark
// If square has question mark, return to hidden state
// If square has number
  // Check surrounding tiles, if all surrounding tiles marked as mines are true mines then reveal function on flagged tile

// Right click logic

// Middle click logic

// Game over logic

// FUNCTION: Calculate large reveal areas: certain squares when clicked, will reveal a large area because they themselves have no surrounding mines and are further touching one or more squares without actual mines.  This extends to squares with numbers as well.  This proceeds in a recursive fashion.  In our script, these areas are calculated at the beginning and given a numerical ID.  When a tile with that ID is clicked to reveal it, all tiles with that area ID will be revealed. along with the first tile with a number indicating the mine forming a border
function calcRevealAreasWrong(mines, xT, yT) {

  // Starting off with a dictionary of all of the squares with no mines
  noMineTiles = [];
  noMineTilesInd = [];
  mines.forEach(function(x) {
    if (x.value >= 0) {
      noMineTiles.push(x)
      noMineTilesInd.push(x.index)
    }
  })

  // First square is by default in area 1
  noMineTiles[0].area = 1

  // Set current area to 2
  currAreaCounter = 2

  // Starting at the second square
  for (m=1; m<noMineTiles.length; m++) {

    tile = noMineTiles[m]

    // Save the indicies of the previous tiles and the previous tile objects themselves to a dictionary
    prevTile = []
    prevTileInd = []
    for (n=0; n<m; n++) {
      prevTile.push(noMineTiles[n])
      prevTileInd.push(noMineTiles[n].index)
    }

    // Get the surrounding tiles of the current square and see if they overlap with any of the previous indices
    surrInd = getSurroundingTileInd(tile.x, tile.y, xT, yT)
    surrIndWithMine = []
    surrInd.forEach(function(x) {
      surrIndCalc = (x[1]-1)*xT + x[0]
      checkOvWprevTile = prevTileInd.indexOf(surrIndCalc)
      if (checkOvWprevTile >= 0) {
        surrIndWithMine.push(prevTileInd[checkOvWprevTile])
      }
    })

  // If there is at least one overlap
    if (surrIndWithMine.length >= 1) {
      // Touching 1 square, set the area of the new square equal to that
      if (surrIndWithMine.length == 1) {
        noMineTiles[m].area = prevTile[prevTileInd.indexOf(surrIndWithMine[0])].area
      } else {
      // Touching multiple squares means that tile is a joining point for multiple regions and the regions with higher integer areas must be assigned to the lower one

        // Set the square to the lowest area designation
        areaList = [];

        surrIndWithMine.forEach(function(a) {
          areaList.push(prevTile[prevTileInd.indexOf(a)].area)
        })
        console.log(areaList);
        noMineTiles[m].area = Math.min.apply(null, areaList)

        // Set area of squares equal to the higher areas to the lower area
        notMinMineInd = [];
        areaList.forEach(function(r, i) {
          if (r > Math.min.apply(null, areaList)) {
            notMinMineInd.push(prevTileInd[i])
          }
        })

        console.log(notMinMineInd)
        if (notMinMineInd.length > 0) {
          notMinMineInd.forEach(function(p) {
            noMineTiles[notMinTilesInd.indexOf(p)].area = min(areaList)
          })
        }
      }
    } else {
    // If that square is not touching the first square, then assign that square the next area designation (previous area + 1)
      noMineTiles[m].area = currAreaCounter
      currAreaCounter += 1
    }
  }
  // At the end you can optionally change the areas all to be consecutive or not
  return noMineTiles
}

// FUNCTION v2: On click, reveals a certain number of squares.  The traditional algorithm is that it looks recursively at revealed tiles until no new tile can be found.  A tile is revealed (along with its surrounding tiles if it is surrounded completely by empty tiles.
function calcRevealAreas(tileInd, mineM, xT, yT) {
  tile = mineM[tileInd]
  mineM[tileInd].reveal = true

  // Count mines adjacent to current square
  surrInd = getSurroundingTileInd(tile.x, tile.y, xT, yT)
  surrMineCount = 0
  surrMineRevealed = 0
  surrInd.forEach(function(a) {
    surrMine = mineM[(a[1]-1) * xT + a[0] - 1]
    surrMine.value < 0 ? (surrMineCount += 1) : (surrMineCount += 0)
    surrMine.reveal ? (surrMineRevealed += 1) : (surrMineRevealed += 0)
  })

  // If adjacent mine count is zero, uncover all adjacent covered squares and make a recursive call for every one of them, else return the mine matrix with that one mine revealed
  if (surrMineCount === 0) {
    surrInd.forEach(function(b) {
      if (mineM[(b[1]-1) * xT + b[0] - 1].reveal) {
        return mineM
      } else {
        return calcRevealAreas((b[1]-1) * xT + b[0] - 1, mineM, xT, yT)
      }
    })
  } else {
    return mineM
  }
}

// FUNCTION: Generate random matrix of mines for a given number of tiles in the x and y direction and a number of mines.  The resulting mine map is returned in the form of a dictionary with each tile having an x and y location and a number indicating the number of surrounding mines.  If the tile itself is a mine then the number returned is zero.
function getMineMap(xT, yT, nM) {

  // Construct an array of values representing each tile on the mine map
  tileMap = [];
  for (a=1; a<=xT*yT; a++) {
    tileMap.push(a)
  };

  // Get a random index, splice it from the tileMap and add it to the mine indicies and repeat nM times
  mineInd = [];
  for (m=1; m<=nM; m++) {
    randMine = getRandomInt(1, tileMap.length)
    mineInd.push(tileMap[randMine-1])
    tileMap.splice(randMine-1, 1)
  }

  // Construct matrix of tiles with -1 for tiles with mines and a placeholder of 0 for tiles without mines
  mineMat = []
  for (y=1; y<=yT; y++) {
    for (x=1; x<=xT; x++) {
      ind = ((y-1)*xT)+x
      if (mineInd.indexOf(ind) > -1) {
        tile = {
          value: -1,
          x: x,
          y: y,
          index: (y-1)*xT + x,
          reveal: false,
          flag: false,
          question: false
        }
      } else {
        tile = {
          value: 0,
          x: x,
          y: y,
          index: (y-1)*xT + x,
          reveal: false,
          flag: false,
          question: false
        }
      }
      mineMat.push(tile)
    }
  }

  // Add number of surrounding mines to the mine matrix as the value, if the tile has a mine the value stays at zero
  surrMineMat = mineMat
  for (m=0; m<mineMat.length; m++) {
    mine = mineMat[m]
    surrMineInd = getSurroundingTileInd(mine.x, mine.y, xT, yT)
    surrMineCount = 0
    for (t=0; t<surrMineInd.length; t++) {
      surrMineCount += mineMat[(surrMineInd[t][1]-1)*xT + surrMineInd[t][0] - 1].value <
        0 ? 1 : 0
    }
    surrMineMat[m].value = mineMat[m].value < 0 ? -1 : surrMineCount
  }

  return surrMineMat
}

// FUNCTION: Get matrix indicies of surrounding tiles given and x and y and a tile size, this is based on 1 starting system matrix
function getSurroundingTileInd(x, y, xTile, yTile) {
  ind = [];

  for (a=x-1; a<=x+1; a++) {
    for (b=y-1; b<=y+1; b++) {
      if (a >= 1 && a <= xTile && b >= 1 && b <= yTile) {
        if (!(a == x && b == y)) {
          ind.push([a,b])
        }
      }
    }
  }
  return ind
}

// FUNCTION: Returns a random integer between min (included) and max (included)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// FUNCTION: Converts a index (1 - total number of tiles) to its x and y coordinates
function convertToXY(ind, xT, yT) {
  return [ind % xT + 1, ind % yT]
}

// FUNCTION: Converts an x and y coordinate into an index
function convertToInd(xyCoord, xT, yT) {
  return ((xyCoord[1] - 1) * xT + xyCoord[0] - 1)
}

// TILE UPDATE FUNCTION: Updates the tile grid based on the data
function updateTileGrid(data) {
  var tiles = minefield.selectAll('rect')
    .data(data)

  tiles
    .enter()
    .append('rect')

  tiles
    .attr('class', function(d) {
      return (d.reveal ? 'tileRevealed' : 'tile')
    })
    .attr('width', tileSize)
    .attr('height', tileSize)
    .attr('x', function(d) {
      return d.x * tileSize;
    })
    .attr('y', function(d) {
      return d.y * tileSize;
    })
    .on('mouseover', function(d) console.log(d))
    .on('click', function(d, i) {
      data.forEach(function(a) {
        if (a.index-1 === i && !a.reveal) {
          a.reveal = true
        }
      })
      var tile = d3.select(this);
      tile.attr('class', 'tileRevealed')
      leftClickLogic(i, data, gameOver, xTiles, yTiles)
      updateTileGrid(data)
      updateTextGrid(data)
    });

    // if data is removed
    tiles.exit().remove();
}

// TILE TEXT UPDATE FUNCTION: Updates the text on the tile grid based on the data
function updateTextGrid(data) {
  var mineText = minefield.selectAll('tspan')
    .data(data)

  mineText
    .enter()
    .append('tspan')

  mineText
    .each(function(d, i) {
        d3.select(this)
          .text(function(d) {return d.reveal ? (d.value == 0 ? null : d.value) : null})
          .attr("x", d.x * tileSize + tileSize/2)
          .attr("y", d.y * tileSize + tileSize*2/3)
          .attr("fill", function(d){
            return d.value > 0 ? mineCols[d.value-1] :
              (d.value < 0 ? 'pink' : 'white')
          })
          .attr("font-family", "courier")
          .attr("font-size", "14px")
          .attr("font-weight", "bold")
          .attr("text-anchor","middle")
    })
    .on('click', function(d, i) {
      data.forEach(function(a) {
        if (a.index-1 === i && !a.reveal) {
          a.reveal = true
          var tile = d3.select(this);
          tile.attr('class', 'tileRevealed')
          leftClickLogic(i, data, gameOver, xTiles, yTiles)
          updateTextGrid(data)
          updateTileGrid(data)
        }
      })
    });

    // exit
    mineText.exit().remove();
}
