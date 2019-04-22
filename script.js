this.PIXEL_SIZE = 25;
this.MAP_SIZE = 10;
let map = {};
let borderCells = [];
let averages = {}
// let blueAverage;
// let redAverage;
let redStdDev;
let blueStdDev;

function start(){
  document.getElementById("start").disabled = true;
  this.drawBoardQuadrants();
  this.getRandomCellValues();
  // this.findBorderCells();
  // this.calculateStdDevs();
  for(let i = 0; i<100;i++){
    this.trade();
  }
  this.drawBoard();
  // this.calculateStdDevs();
}

function trade(){
  // this.calculateStdDevs();
  this.findBorderCells();
  //search for and execute border cells
  // this.calculateStdDevs();
  for(let i = 0; i<borderCells.length; i++){
    for(let j = 0; j<borderCells.length; j++){
      if(i!=j && borderCells[i].neighborColor == borderCells[j].cell.color && borderCells[j].neighborColor == borderCells[i].cell.color){
        let mapClone = Object.assign({}, map);
        console.log("hi");
        //get averages
        calculateAverages();
        //if both candidates are closer to the others average, swap
        if(Math.abs(averages[borderCells[i].cell.color] - borderCells[i].cell.value) > Math.abs(averages[borderCells[i].cell.color] - borderCells[j].cell.value) &&
          Math.abs(averages[borderCells[j].cell.color] - borderCells[j].cell.value) > Math.abs(averages[borderCells[j].cell.color] - borderCells[i].cell.value)){
            map[getKey(borderCells[i].cell.x, borderCells[i].cell.y)] = borderCells[j].cell;
            map[getKey(borderCells[j].cell.x, borderCells[j].cell.y)] = borderCells[i].cell;
            console.log("swap");
            return;
          }
      }
    }
  }

}

function findBorderCells(){
  borderCells = [];
  for(let x = 0; x < this.MAP_SIZE; x++){
    for(let y = 0; y< this.MAP_SIZE; y++){
      let cell = isBorderCell(x,y);
      if(cell[0]){
        borderCells.push({cell: map[getKey(x,y)], neighborColor: cell[1]});
      }
  }
}}

function isBorderCell(x,y){
  if(map[getKey(x-1, y)] && map[getKey(x-1, y)].color != map[getKey(x,y)].color){
    return [true, map[getKey(x-1,y)].color];
  }else if(map[getKey(x+1, y)] && map[getKey(x+1, y)].color != map[getKey(x,y)].color){
    return [true, map[getKey(x+1,y)].color];
  }else if(map[getKey(x, y+1)] && map[getKey(x, y+1)].color != map[getKey(x,y)].color){
    return [true, map[getKey(x,y+1)].color];
  }else if(map[getKey(x, y-1)] && map[getKey(x, y-1)].color != map[getKey(x,y)].color){
    return [true, map[getKey(x,y-1)].color];
  }
  return [false];
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

function drawBoardQuadrants() {
  for(let x = 0; x < this.MAP_SIZE; x++){
    for(let y = 0; y< this.MAP_SIZE; y++){
      let tile = document.createElement("canvas");
      tile.id = getKey(x,y);
      tile.height= PIXEL_SIZE;
      tile.width= PIXEL_SIZE;
      tile.style.position = "absolute";
      tile.style.left = (x*PIXEL_SIZE) + "px";
      tile.style.top = (y*PIXEL_SIZE + 40) + "px";
      if(x<MAP_SIZE/2){
          map[getKey(x,y)] = {x: x, y:y, color: "blue"};
      }else{
        map[getKey(x,y)] = {x: x, y:y, color: "red"};
      }
      tile.classList.add(map[getKey(x,y)].color);
      document.getElementById("board").appendChild(tile);
    }
  }
}

function drawBoardLines() {
  for(let x = 0; x < this.MAP_SIZE; x++){
    for(let y = 0; y< this.MAP_SIZE; y++){
      let tile = document.createElement("canvas");
      tile.id = getKey(x,y);
      tile.height= PIXEL_SIZE;
      tile.width= PIXEL_SIZE;
      tile.style.position = "absolute";
      tile.style.left = (x*PIXEL_SIZE) + "px";
      tile.style.top = (y*PIXEL_SIZE + 40) + "px";
      if(x<10){
        map[getKey(x,y)] = {x: x, y:y, color: "blue"};
      }else if (x<20){
        map[getKey(x,y)] = {x: x, y:y, color: "red"};
      }
      tile.classList.add(map[getKey(x,y)].color);
      document.getElementById("board").appendChild(tile);
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
      let tile = document.createElement("canvas");
      tile.id = getKey(x,y);
      tile.height= PIXEL_SIZE;
      tile.width= PIXEL_SIZE;
      tile.style.position = "absolute";
      tile.style.left = (x*PIXEL_SIZE) + "px";
      tile.style.top = (y*PIXEL_SIZE + 40) + "px";
      tile.classList.add(map[getKey(x,y)].color);
      document.getElementById("board").appendChild(tile);
      let ctx = tile.getContext("2d");
      ctx.font = "12px Arial";
      ctx.fillText(map[getKey(x,y)].value, 0, 13);
    }
  }
}

function getRandomCellValues(){
  for (let x = 0; x<this.MAP_SIZE; x++){
    for (let y = 0; y<this.MAP_SIZE; y++){
      map[getKey(x,y)].value = Math.floor((Math.random() * 999) + 1);
      let cell = document.getElementById(getKey(x,y));
      let ctx = cell.getContext("2d");
      ctx.font = "12px Arial";
      ctx.fillText(map[getKey(x,y)].value, 0, 13);
    }
  }
}

function credits(){
  alert("Created by Alan Henderson for CS 6110");
}

function getKey(x,y){
  return x.toString() + "," + y.toString();
}
