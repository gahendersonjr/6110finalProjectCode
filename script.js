this.PIXEL_SIZE = 25;
this.MAP_SIZE = 10;
let originalMap = {};
let map = {};
let borderCells = [];
let averages = {}
// let blueAverage;
// let redAverage;
let redStdDev;
let blueStdDev;

function start(){
  document.getElementById("start").disabled = true;
  this.makeMap();
  this.getRandomCellValues();
  // this.findBorderCells();
  // this.calculateStdDevs();
  for(let i = 0; i<10;i++){
    this.trade();
  }
  this.drawBoard(40);
  // this.calculateStdDevs();
}

function trade(){
  // this.calculateStdDevs();
  this.findBorderCells();
  //search for and execute border cells
  // this.calculateStdDevs();
  for(let i = 0; i<borderCells.length; i++){
    for(let j = 0; j<borderCells.length; j++){
      if(i!=j){
        let mapClone = Object.assign({}, map);
        //get averages
        calculateAverages();
        //if both candidates are closer to the others average, swap
        if(Math.abs(averages[borderCells[i].color] - borderCells[i].value) > Math.abs(averages[borderCells[i].color] - borderCells[j].value) &&
          Math.abs(averages[borderCells[j].color] - borderCells[j].value) > Math.abs(averages[borderCells[j].color] - borderCells[i].value)){
            console.log(borderCells[i]);
            console.log(borderCells[j]);
            toggleColor(getKey(borderCells[i].x, borderCells[i].y));
            toggleColor(getKey(borderCells[j].x, borderCells[j].y));
            return;
          }
      }
    }
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
  alert(" red std dev: " + redStdDev.toString() + "\n"
        +" blue std dev: " + blueStdDev.toString());
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
