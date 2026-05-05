var paintID = 1;

class Offgrid{

    constructor(tilesWide, tilesTall, borderID){
        this.width = tilesWide;
        this.height = tilesTall;
        this.borderID = borderID;

        this.tileIDs = [tilesWide * tilesTall];
        this.displayTiles = [tilesWide + 1 * tilesTall + 1];
        for(var x = 0; x < tilesWide; x++){
            for(var y = 0; y < tilesTall; y++){
                this.setDataTile(x, y, tWalls);
            }
        }

        var oldCanvas = document.getElementById("mainCanvas");
        var canvas = oldCanvas.cloneNode(true); // 'true' means deep clone (includes children)
        oldCanvas.parentNode.replaceChild(canvas, oldCanvas);

        canvas.addEventListener("click", e => {
            this.placeTile(e);
        });
        canvas.addEventListener("mousedown", e => {this.dragging = true;});
        canvas.addEventListener("mouseup", e => {this.dragging = false;});
        canvas.addEventListener("mousemove", e => {
            if(!this.dragging) return;
            this.placeTile(e);
        });

        console.log(canvas);

        
        // canvas.width = 100;
        // canvas.scrollHeight = tilesTall * tileSize;
    }

    placeTile(mouseEvent){

            //since we are modifying the offset grid, add half the tilesize
            var clickX = mouseEvent.offsetX - tileSize / 2;
            var clickY = (document.getElementById("mainCanvas").height - mouseEvent.offsetY) - tileSize / 2;

            
            var tileX = Math.floor(clickX / tileSize);
            var tileY = Math.floor(clickY / tileSize);


            //this.setDisplayTile(tileX, tileY, this.getDisplayTile(tileX, tileY) + 1);
            if(mouseEvent.detail <= 1){
                this.setDataTile(tileX, tileY, paintID);
            }else if(mouseEvent.detail > 1){
                this.setDataTile(tileX, tileY, t_Wild);
            }
            this.drawCanvas();
    }

    isWithinData(xPos, yPos){
        //data uses the width/height saved within the offgrid
        if(xPos < 0) return false;
        if(xPos >= this.width) return false;
        if(yPos < 0) return false;
        if(yPos >= this.height) return false;
        return true;
    }

    isWithinDisplay(xPos, yPos){
        //display is 1 tile longer in both directions, and offset by 1/2 of tilessize
        if(xPos < 0) return false;
        if(xPos >= this.width + 1) return false;
        if(yPos < 0) return false;
        if(yPos >= this.height + 1) return false;
        return true;
    }
    updateNearbyTiles(xPos, yPos){
        for(var x=0;x<=1;x++){
            for(var y=0;y<=1;y++){
                //find which tile matches the pattern given
                for(var i = 0; i < tileDict.length; i++){
                    if(tileDict[i].checkPattern(
                        this.getDataTile(xPos + x - 1, yPos + y - 1),
                        this.getDataTile(xPos + x, yPos + y - 1),
                        this.getDataTile(xPos + x, yPos + y),
                        this.getDataTile(xPos + x - 1, yPos + y)
                    )){
                        this.setDisplayTile(xPos + x, yPos + y, i);
                        break;
                    }
                }
            }
        }
    }
    updateNearbyTilesLoose(xPos, yPos){
        for(var x=0;x<=1;x++){
            for(var y=0;y<=1;y++){
                //find which tile(s) match the pattern given
                var validTiles = new Array();
                for(var i = 0; i < tileDict.length; i++){
                    if(tileDict[i].checkPatternLoose(
                        this.getDataTile(xPos + x - 1, yPos + y - 1),
                        this.getDataTile(xPos + x, yPos + y - 1),
                        this.getDataTile(xPos + x, yPos + y),
                        this.getDataTile(xPos + x - 1, yPos + y)
                    )){
                        //this.setDisplayTile(xPos + x, yPos + y, i);
                        validTiles.push(i);
                    }
                }
                this.setDisplayTile(xPos + x, yPos + y, validTiles);
            }
        }
    }
    setDataTile(xPos, yPos, value){
        if(!this.isWithinData(xPos, yPos)){
            return;
        }
        this.tileIDs[yPos * this.width + xPos] = value;
        //once we set a data tile...
        //check the surrounding 4 tiles for an updated pattern
        this.updateNearbyTiles(xPos, yPos);
    }
    setDisplayTile(xPos, yPos, value){
        if(!this.isWithinDisplay(xPos, yPos)){
            return;
        }
        this.displayTiles[yPos * (this.width + 1) + xPos] = value;
    }

    getDataTile(xPos, yPos){
        if(!this.isWithinData(xPos, yPos)){
            return this.borderID;
        }
        return this.tileIDs[yPos * this.width + xPos];
    }
    getDisplayTile(xPos, yPos){
        if(!this.isWithinDisplay(xPos, yPos)){
            return 0;
        }
        return this.displayTiles[yPos * (this.width + 1) + xPos];
    }
    getDisplayPattern(xPos, yPos){
        var pattern = new Array(
            this.getDataTile(xPos - 1, yPos),
            this.getDataTile(xPos, yPos),
            this.getDataTile(xPos, yPos - 1),
            this.getDataTile(xPos - 1, yPos - 1)
        );

        return pattern;
    }

    drawCanvas() {
        var canvas = document.getElementById("mainCanvas");
        canvas.width = (this.width + 1) * tileSize;
        canvas.height = (this.height + 1) * tileSize;
        const ctx = canvas.getContext("2d");

        //for each tile, draw the tile within the dictionary whose ID matches our display list
        for(var x = 0; x < this.width + 1; x++){
            for(var y = 0; y < this.height + 1; y++){

                var pattern = this.getDisplayPattern(x, y);
                //console.log(pattern);
                var useSpecificTile = false;
                var specificTile = null;
                for(var tile of detailedTileDict){
                    if(tile.checkPatternLoose(pattern[0], pattern[1], pattern[2], pattern[3])){
                        useSpecificTile = true;
                        // console.log(tile);
                        specificTile = tile;
                        break;
                    }
                }
                for(var i = 0; i < tileLayers.length; i++){
                    var layerPattern = new Array();
                    pattern.forEach(e => {
                        if(e == tileLayers[i]){
                            layerPattern.push(e);
                        }else{
                            layerPattern.push(t_Wild);
                        }
                    });
                    tileDict.forEach(e => {
                        if(e.checkPattern(layerPattern[0], layerPattern[1], layerPattern[2], layerPattern[3])){
                            e.draw(ctx, x, y, this.height);
                            return;
                        }
                    });
                }
                if(useSpecificTile){
                    specificTile.draw(ctx, x, y, this.height);
                }
            }
        }
    }
}

var grid = new Offgrid(8, 5, tWalls);
console.log(grid);
grid.drawCanvas();

//setting up the controls
document.getElementById("newMap").addEventListener("click", e => {
    var width = parseInt(document.getElementById("width").value);
    var height = parseInt(document.getElementById("height").value);
    grid = new Offgrid(width, height, tWalls);
    console.log(grid);
    grid.drawCanvas();
});

document.getElementById("loadMap").addEventListener("click", e => {
    var mapString = document.getElementById("mapString").value;
    console.log(mapString);
    for(var i=0;i<mapString.length;i++){
        grid.tileIDs[i] = mapString[i];
    }
    grid.drawCanvas();
});
document.getElementById("saveMap").addEventListener("click", e => {
    var mapString = "";
    
    for(var i=0;i<grid.tileIDs.length;i++){
        mapString += grid.tileIDs[i];
    }
    console.log(mapString);
    document.getElementById("mapString").value = mapString;
});

//setting up the palette
function paletteClick(value, clickedNode){
    paintID = value;
    document.getElementById("palette").childNodes.forEach(node => {
        node.setAttribute("class", "");
    });
    clickedNode.setAttribute("class", "selected");
}
var palette1 = tileDict[0].image;
palette1.addEventListener("click", e => paletteClick(tFloor, palette1));
document.getElementById("palette").appendChild(palette1);

var palette2 = tileDict[15].image;
palette2.addEventListener("click", e => paletteClick(tWater, palette2));
document.getElementById("palette").appendChild(palette2);

var palette3 = tileDict[30].image;
palette3.addEventListener("click", e => paletteClick(tDeepW, palette3));
document.getElementById("palette").appendChild(palette3);

var palette4 = tileDict[45].image;
palette4.addEventListener("click", e => paletteClick(tWalls, palette4));
document.getElementById("palette").appendChild(palette4);

var palette5 = tileDict[60].image;
palette5.addEventListener("click", e => paletteClick(tMuddy, palette5));
document.getElementById("palette").appendChild(palette5);

paletteClick(tFloor, palette1);
