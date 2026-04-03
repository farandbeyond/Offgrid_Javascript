class Offgrid{

    constructor(tilesWide, tilesTall){
        this.width = tilesWide+1;
        this.height = tilesTall+1;

        this.tileIDs = [tilesWide * tilesTall];
        for(var x = 0; x < tilesWide; x++){
            for(var y = 0; y < tilesTall; y++){
                this.tileIDs[x * tilesWide + y] = 0;
            }
        }
        
        this.displayTiles = [tilesWide + 1 * tilesTall + 1];
        for(var x = 0; x < tilesWide + 1; x++){
            for(var y = 0; y < tilesTall + 1; y++){
                this.displayTiles[x * (tilesWide + 1) +  y] = 0;
            }
        }

        var canvas = document.getElementById("mainCanvas");
        canvas.addEventListener("click", e => {
            //console.log("Clicked");
            //console.log(e);

            var clickX = e.offsetX;
            var clickY = e.offsetY;

            var tileX = Math.floor(clickX / tileSize);
            var tileY = Math.floor(clickY / tileSize);

            //this.setDisplayTile(tileX, tileY, this.getDisplayTile(tileX, tileY) + 1);
            this.setDataTile(tileX, tileY, this.getDataTile(tileX, tileY) + 1);
            this.drawCanvas();
        });
    }

    isWithin(xPos, yPos){
        if(xPos < 0) return false;
        if(xPos > this.width) return false;
        if(yPos < 0) return false;
        if(yPos > this.height) return false;
        return true;
    }

    setDataTile(xPos, yPos, value){
        if(!this.isWithin(xPos, yPos)){
            return;
        }
        this.tileIDs[xPos * this.width + yPos] = value;
        for(var x=0;x<=1;x++){
            for(var y=0;y<=1;y++){
                //find which tile matches the pattern given
                for(var i = 0; i < tileDict.length; i++){
                    if(tileDict[i].checkPattern(
                        this.getDataTile(xPos, yPos),
                        this.getDataTile(xPos + 1, yPos),
                        this.getDataTile(xPos + 1, yPos + 1),
                        this.getDataTile(xPos, yPos + 1)
                    )){
                        this.setDisplayTile(xPos + x, yPos + y, i);
                        break;
                    }
                }
            }
        }
    }
    setDisplayTile(xPos, yPos, value){
        if(!this.isWithin(xPos, yPos)){
            return;
        }
        this.displayTiles[xPos * this.width + yPos] = value;
    }

    getDataTile(xPos, yPos){
        if(!this.isWithin(xPos, yPos)){
            return 0;
        }
        return this.tileIDs[xPos * this.width + yPos];
    }
    getDisplayTile(xPos, yPos){
        if(!this.isWithin(xPos, yPos)){
            return 0;
        }
        return this.displayTiles[xPos * this.width + yPos];
    }

    drawCanvas() {
        var canvas = document.getElementById("mainCanvas");
        canvas.width = this.width * tileSize;
        canvas.height = this.height * tileSize;
        const ctx = canvas.getContext("2d");

        for(var x = 0; x < this.width; x++){
            for(var y = 0; y < this.height; y++){
                tileDict[this.getDisplayTile(x,y)].draw(ctx, x, y);

                ctx.strokeStyle = "black";
                ctx.strokeText(this.getDataTile(x, y), x * tileSize + tileSize/2, y * tileSize + tileSize/2);
                    //ctx.fillStyle = "green";
                //ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                //ctx.strokeStyle = "black";
                //ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
}

var grid = new Offgrid(8, 5);
console.log(grid);
grid.drawCanvas();