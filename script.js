this.PIXEL_SIZE = 25;
this.MAP_SIZE = 40;
let map = {};

function start(){
  document.getElementById("start").disabled = true;
  this.drawBoardLines();
  this.getRandomCellValues();
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
      map[getKey(x,y)].value = Math.floor((Math.random() * 10) + 1);
      let cell = document.getElementById(getKey(x,y));
      let ctx = cell.getContext("2d");
      ctx.font = "10px Arial";
      ctx.fillText(map[getKey(x,y)].value, 0, 12);
    }
  }
}

function credits(){
  alert("Created by Alan Henderson for CS 6110");
}

function getKey(x,y){
  return x.toString() + "," + y.toString();
}
