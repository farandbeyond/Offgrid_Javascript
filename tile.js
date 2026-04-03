const tileSize = 32;
class Tile{
    constructor(imageURL, rotation, pattern){
        this.image = new Image(tileSize, tileSize);
        this.image.src = imageURL;

        this.degrees = rotation;
        this.radians = this.degrees * Math.PI / 180;
        //this.image.style = "rotate: "+rotation+"deg;";

        this.pTL = pattern[0];
        this.pTR = pattern[1];
        this.pBL = pattern[2];
        this.pBR = pattern[3];
    }

    checkPattern(TL, TR, BR, BL){
        if(this.pTL != TL) return false;
        if(this.pTR != TR) return false;
        if(this.pBR != BR) return false;
        if(this.pBL != BL) return false;

        return true;
    }

    draw(ctx, posX, posY){
        //console.log(this.image);
        //ctx.drawImage(this.image, posX * tileSize, posY * tileSize, tileSize, tileSize);
        if(this.radians != 0){
            
            ctx.save(); // Save current state (translation/rotation)
            ctx.translate(posX * tileSize + tileSize / 2, posY * tileSize + tileSize / 2); // Move to rotation center
            ctx.rotate(this.radians); // Rotate canvas
            ctx.translate(tileSize/2, tileSize/2);
            // Draw image centered at (0,0) of the new coordinate system
            ctx.drawImage(this.image, -tileSize, -tileSize);
            ctx.restore(); // Restore original state
        }else{
            ctx.drawImage(this.image, posX * tileSize, posY * tileSize);
        }

        
    }
}

var tileDict = [];

function addTile(fileName, rotation, pattern){
    tileDict.push(new Tile("Tile Images/"+fileName, rotation, pattern));
}
function addTileRotated(fileName, numRotations, pattern){
    for(var i=0; i<numRotations; i++){
        addTile(fileName, i * 90, pattern);
        pattern.unshift(pattern.pop());
    }
}

addTileRotated("Offgrid Tiles_0.png", 4, new Array(0, 0, 1, 0));
addTileRotated("Offgrid Tiles_1.png", 4, new Array(0, 0, 1, 1));
addTileRotated("Offgrid Tiles_2.png", 4, new Array(0, 1, 1, 1));
addTileRotated("Offgrid Tiles_3.png", 2, new Array(0, 1, 0, 1));
addTileRotated("Offgrid Tiles_4.png", 1, new Array(0, 0, 0, 0));
addTileRotated("Offgrid Tiles_5.png", 1, new Array(1, 1, 1, 1));
//tileDict.push(new Tile("Tile Images/Offgrid Tiles_1.png", 0, new Array(1, 0, 0, 0)));

console.log(tileDict);