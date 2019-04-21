this.PIXEL_SIZE = 25;
this.MAP_SIZE = 40;
let map = {};
let blueAverage;
let redAverage;
let yellowAverage;
let greenAverage;
let greenStdDev;
let redStdDev;
let blueStdDev;
let yellowStdDev;

function start(){
  document.getElementById("start").disabled = true;
  this.drawBoardQuadrants();
  this.getRandomCellValues();
  this.calculateStdDevs();
}

function calculateAverages(){
  blueAverage = 0;
  redAverage = 0;
  yellowAverage = 0;
  greenAverage = 0;
  for(let x = 0; x < this.MAP_SIZE; x++){
    for(let y = 0; y < this.MAP_SIZE; y++){
      let cell = map[getKey(x,y)];
      if(cell.color=="blue"){
        blueAverage += cell.value;
      }else if(cell.color=="red"){
        redAverage += cell.value;
      }else if(cell.color=="yellow"){
        yellowAverage += cell.value;
      }else if(cell.color=="green"){
        greenAverage += cell.value;
      }
    }
  }
  blueAverage /=400;
  redAverage /=400;
  yellowAverage /=400;
  greenAverage /=400;
}

function calculateStdDevs(){
  calculateAverages();
  let greenAvgSquaredDifferece = 0;
  let redAvgSquaredDifferece = 0;
  let blueAvgSquaredDifferece = 0;
  let yellowAvgSquaredDifferece = 0;
  for(let x = 0; x < this.MAP_SIZE; x++){
    for(let y = 0; y < this.MAP_SIZE; y++){
      let cell = map[getKey(x,y)];
      if(cell.color=="blue"){
        blueAvgSquaredDifferece += Math.pow(cell.value-blueAverage, 2);
      }else if(cell.color=="red"){
        redAvgSquaredDifferece += Math.pow(cell.value-redAverage, 2);
      }else if(cell.color=="yellow"){
        yellowAvgSquaredDifferece += Math.pow(cell.value-yellowAverage, 2);
      }else if(cell.color=="green"){
        greenAvgSquaredDifferece += Math.pow(cell.value-greenAverage, 2);
      }
    }
  }
  greenAvgSquaredDifferece /= 400;
  redAvgSquaredDifferece /= 400;
  blueAvgSquaredDifferece /= 400;
  yellowAvgSquaredDifferece /= 400;

  let greenStdDev = Math.sqrt(greenAvgSquaredDifferece);
  let redStdDev = Math.sqrt(redAvgSquaredDifferece);
  let blueStdDev = Math.sqrt(blueAvgSquaredDifferece);
  let yellowStdDev = Math.sqrt(yellowAvgSquaredDifferece);
  alert("green average: " + greenAverage.toString()
        +" red average: " + redAverage.toString()
      +" blue average: " + blueAverage.toString()
    +" yellow average: " + yellowAverage.toString()
    +"green std dev: " + greenStdDev.toString()
          +" red std dev: " + redStdDev.toString()
        +" blue std dev: " + blueStdDev.toString()
      +" yellow std dev: " + yellowStdDev.toString());
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
      if(x<20){
        if(y<20){
          map[getKey(x,y)] = {x: x, y:y, color: "blue"};
        }else{
          map[getKey(x,y)] = {x: x, y:y, color: "red"};
        }
      }else{
        if(y<20){
          map[getKey(x,y)] = {x: x, y:y, color: "yellow"};
        }else{
          map[getKey(x,y)] = {x: x, y:y, color: "green"};
        }
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
      }else if(x<30){
        map[getKey(x,y)] = {x: x, y:y, color: "yellow"};
      }else{
        map[getKey(x,y)] = {x: x, y:y, color: "green"};
      }
      tile.classList.add(map[getKey(x,y)].color);
      document.getElementById("board").appendChild(tile);
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
