this.PIXEL_SIZE = 25;
this.MAP_SIZE = 16;
let originalMap = {};
let map = {};
let borderCells = [];
let averages = {}
let redStdDev;
let blueStdDev;
let originalRedStdDev;
let originalBlueStdDev;
let numTrades=0;
let redCells = {};
let blueCells = {};

function start(){
  document.getElementById("start").disabled = true;
  this.makeMap();
  this.getRandomCellValues();
  this.calculateStdDevs();
  originalRedStdDev = redStdDev;
  originalBlueStdDev = blueStdDev;
  while(this.trade()){
    numTrades++;
  }
  this.calculateStdDevs();
  this.drawBoard();
  this.isContinous();
}

function trade(){
  this.findBorderCells();
  //get averages
  calculateAverages();
  //search for and execute border cells
  for(let i = 0; i<borderCells.length; i++){
    for(let j = 0; j<borderCells.length; j++){
      if(i!=j){
        //if both candidates are closer to the others average, swap
        if(Math.abs(averages[borderCells[i].color] - borderCells[i].value) > Math.abs(averages[borderCells[i].color] - borderCells[j].value) &&
          Math.abs(averages[borderCells[j].color] - borderCells[j].value) > Math.abs(averages[borderCells[j].color] - borderCells[i].value)){
            toggleColor(getKey(borderCells[i].x, borderCells[i].y));
            toggleColor(getKey(borderCells[j].x, borderCells[j].y));
            if(isContinous()){
              return true;
            }else{
              //not isContinous, change back
              toggleColor(getKey(borderCells[i].x, borderCells[i].y));
              toggleColor(getKey(borderCells[j].x, borderCells[j].y));
            }
          }
      }
    }
  }
  return false;
}

function isContinous(){
  redCells = {};
  blueCells = {};
  let startingRed;
  let stargingBlue;
  for(let x = 0; x<MAP_SIZE; x++){
    for(let y = 0; y<MAP_SIZE; y++){
      if(map[getKey(x,y)].color=="red"){
        redCells[getKey(x,y)] = false;
        startingRed = [x,y];
      }else{
        blueCells[getKey(x,y)] = false;
        startingBlue = [x,y];
      }
    }
  }
  searchRed(startingRed[0], startingRed[1]);
  for(let key in redCells){
    if(redCells[key]==false){
      return false;
    }
  }
  searchBlue(startingBlue[0], startingBlue[1]);
  for(let key in blueCells){
    if(blueCells[key]==false){
      return false;
    }
  }
  return true;
}

function searchRed(x,y){
  redCells[getKey(x,y)] = true;
  if(x>0 && map[getKey(x-1,y)].color == "red" && redCells[getKey(x-1,y)]==false){
      searchRed(x-1,y);
  }
  if(x<MAP_SIZE-1 && map[getKey(x+1,y)].color == "red" && redCells[getKey(x+1,y)]==false){
      searchRed(x+1,y);
  }
  if(y>0 && map[getKey(x,y-1)].color == "red" && redCells[getKey(x,y-1)]==false){
      searchRed(x,y-1);
  }
  if(y<MAP_SIZE-1 && map[getKey(x,y+1)].color == "red" && redCells[getKey(x,y+1)]==false){
      searchRed(x,y+1);
  }
}

function searchBlue(x,y){
  blueCells[getKey(x,y)] = true;
  if(x>0 && map[getKey(x-1,y)].color == "blue" && blueCells[getKey(x-1,y)]==false){
      searchBlue(x-1,y);
  }
  if(x<MAP_SIZE-1 && map[getKey(x+1,y)].color == "blue" && blueCells[getKey(x+1,y)]==false){
      searchBlue(x+1,y);
  }
  if(y>0 && map[getKey(x,y-1)].color == "blue" && blueCells[getKey(x,y-1)]==false){
      searchBlue(x,y-1);
  }
  if(y<MAP_SIZE-1 && map[getKey(x,y+1)].color == "blue" && blueCells[getKey(x,y+1)]==false){
      searchBlue(x,y+1);
  }
}

function toggleColor(key){
  if(map[key].color=="blue"){
    map[key].color="red";
  }else if(map[key].color=="red"){
    map[key].color="blue";
  }
}

function findBorderCells(){
  borderCells = [];
  for(let x = 0; x < this.MAP_SIZE; x++){
    for(let y = 0; y< this.MAP_SIZE; y++){
      if(isBorderCell(x,y)){
        borderCells.push(map[getKey(x,y)]);
      }
  }
}}

function isBorderCell(x,y){
  if(map[getKey(x-1, y)] && map[getKey(x-1, y)].color != map[getKey(x,y)].color){
    return true;
  }else if(map[getKey(x+1, y)] && map[getKey(x+1, y)].color != map[getKey(x,y)].color){
    return true;
  }else if(map[getKey(x, y+1)] && map[getKey(x, y+1)].color != map[getKey(x,y)].color){
    return true;
  }else if(map[getKey(x, y-1)] && map[getKey(x, y-1)].color != map[getKey(x,y)].color){
    return true;
  }
  return false;
}

function calculateAverages(){
  averages["blue"] = 0;
  averages["red"] = 0;
  for(let x = 0; x < this.MAP_SIZE; x++){
    for(let y = 0; y < this.MAP_SIZE; y++){
      let cell = map[getKey(x,y)];
      if(cell.color=="blue"){
        averages["blue"] += cell.value;
      }else if(cell.color=="red"){
        averages["red"] += cell.value;
      }
    }
  }
  averages["blue"] /= (Math.pow(MAP_SIZE, 2)/2);
  averages["red"] /= (Math.pow(MAP_SIZE, 2)/2);
}

function calculateStdDevs(){
  calculateAverages();
  let redAvgSquaredDifferece = 0;
  let blueAvgSquaredDifferece = 0;
  for(let x = 0; x < this.MAP_SIZE; x++){
    for(let y = 0; y < this.MAP_SIZE; y++){
      let cell = map[getKey(x,y)];
      if(cell.color=="blue"){
        blueAvgSquaredDifferece += Math.pow(cell.value-averages["blue"], 2);
      }else if(cell.color=="red"){
        redAvgSquaredDifferece += Math.pow(cell.value-averages["red"], 2);
      }
    }
  }
  redAvgSquaredDifferece /= (Math.pow(MAP_SIZE, 2)/2);
  blueAvgSquaredDifferece /= (Math.pow(MAP_SIZE, 2)/2);

  redStdDev = Math.sqrt(redAvgSquaredDifferece);
  blueStdDev = Math.sqrt(blueAvgSquaredDifferece);
}

function makeMap() {
  for(let x = 0; x < this.MAP_SIZE; x++){
    for(let y = 0; y< this.MAP_SIZE; y++){
      if(x<MAP_SIZE/2){
          map[getKey(x,y)] = {x: x, y:y, color: "blue"};
          originalMap[getKey(x,y)] = {x: x, y:y, color: "blue"};
      }else{
        map[getKey(x,y)] = {x: x, y:y, color: "red"};
        originalMap[getKey(x,y)] = {x: x, y:y, color: "red"};
      }
    }
  }
}

function drawBoard(){
  //remove existing canvas elements
  let board = document.getElementById("board");
  while(board.firstChild){
    board.removeChild(board.firstChild);
  }
  for(let x = 0; x < this.MAP_SIZE; x++){
    for(let y = 0; y< this.MAP_SIZE; y++){
      //original
      let tile = document.createElement("canvas");
      tile.id = getKey(x,y);
      tile.height= PIXEL_SIZE;
      tile.width= PIXEL_SIZE;
      tile.style.position = "absolute";
      tile.style.left = (x*PIXEL_SIZE) + "px";
      tile.style.top = (y*PIXEL_SIZE + 40) + "px";
      tile.classList.add(originalMap[getKey(x,y)].color);
      document.getElementById("board").appendChild(tile);
      let ctx = tile.getContext("2d");
      ctx.font = "12px Arial";
      ctx.fillText(originalMap[getKey(x,y)].value, 0, 13);
      //end
      tile = document.createElement("canvas");
      tile.id = getKey(x,y);
      tile.height= PIXEL_SIZE;
      tile.width= PIXEL_SIZE;
      tile.style.position = "absolute";
      tile.style.left = (x*PIXEL_SIZE+MAP_SIZE*PIXEL_SIZE+20) + "px";
      tile.style.top = (y*PIXEL_SIZE + 40) + "px";
      tile.classList.add(map[getKey(x,y)].color);
      document.getElementById("board").appendChild(tile);
      ctx = tile.getContext("2d");
      ctx.font = "12px Arial";
      ctx.fillText(map[getKey(x,y)].value, 0, 13);
    }
  }

  let body = document.getElementsByTagName("BODY")[0];
  let originalText = document.createElement("p");
  originalText.innerText="original red stddev: " + originalRedStdDev.toString() + "\n"
                          +" original blue stddev: " + originalBlueStdDev.toString()+ "\n\n\n"
                          + "number of trades: " + numTrades.toString();
  originalText.style.position = "absolute";
  originalText.style.top = (MAP_SIZE*PIXEL_SIZE + 30).toString() + "px";
  body.appendChild(originalText);

  let finalText = document.createElement("p");
  finalText.innerText="final red stddev: " + redStdDev.toString() + "\n"
                          +" final blue stddev: " + blueStdDev.toString();
  finalText.style.position = "absolute";
  finalText.style.top = (MAP_SIZE*PIXEL_SIZE + 30).toString() + "px";
  finalText.style.left = (MAP_SIZE*PIXEL_SIZE + 20).toString() + "px";
  body.appendChild(finalText);
}

function getRandomCellValues(){
  for (let x = 0; x<this.MAP_SIZE; x++){
    for (let y = 0; y<this.MAP_SIZE; y++){
      let value = Math.floor((Math.random() * 999) + 1);
      map[getKey(x,y)].value = value;
      originalMap[getKey(x,y)].value = value;
    }
  }
}

function credits(){
  alert("Created by Alan Henderson for CS 6110");
}

function getKey(x,y){
  return x.toString() + "," + y.toString();
}
