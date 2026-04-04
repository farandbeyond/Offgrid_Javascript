const tileSize = 64;
const tileLayers = 5;
class Tile{
    constructor(imageURL, rotation, pattern){
        this.image = new Image(tileSize, tileSize);
        this.image.src = imageURL;

        this.degrees = rotation;
        this.radians = this.degrees * Math.PI / 180;
        //this.image.style = "rotate: "+rotation+"deg;";

        this.pTL = pattern[0];
        this.pTR = pattern[1];
        this.pBR = pattern[2];
        this.pBL = pattern[3];
    }

    checkPattern(TL, TR, BR, BL){
        if(this.pTL != TL) return false;
        if(this.pTR != TR) return false;
        if(this.pBR != BR) return false;
        if(this.pBL != BL) return false;

        return true;
    }

    checkPatternLoose(TL, TR, BR, BL){
        if(this.pTL != TL && this.pTL != 0) return false;
        if(this.pTR != TR && this.pTR != 0) return false;
        if(this.pBR != BR && this.pBR != 0) return false;
        if(this.pBL != BL && this.pBL != 0) return false;

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
var detailedTileDict = [];

function addTile(fileName, rotation, pattern){
    tileDict.push(new Tile("Tile Images/"+fileName, rotation, pattern));
}
function addTileRotated(fileName, numRotations, pattern){
    for(var i=0; i<numRotations; i++){
        addTile(fileName, i * 90, pattern);
        pattern.unshift(pattern.pop());
    }
}

function addDetailedTile(fileName, rotation, pattern){
    detailedTileDict.push(new Tile("Tile Images/"+fileName, rotation, pattern));
}
function addDetailedTileRotated(fileName, numRotations, pattern){
    for(var i=0; i<numRotations; i++){
        addDetailedTile(fileName, i * 90, pattern);
        pattern.unshift(pattern.pop());
    }
}

//0 is null, 1 is plains, 2 is shallow water, 3 is deep water, 4 is forest

//basic full tiles
addTileRotated("OffgridTiles_00.png", 1, new Array(1, 1, 1, 1));
addTileRotated("OffgridTiles_03.png", 1, new Array(2, 2, 2, 2));
addTileRotated("OffgridTiles_02.png", 1, new Array(3, 3, 3, 3));
addTileRotated("OffgridTiles_01.png", 1, new Array(4, 4, 4, 4));
//plains w/ null
addTileRotated("OffgridTiles_04.png", 4, new Array(0, 1, 0, 0));
addTileRotated("OffgridTiles_05.png", 4, new Array(1, 1, 1, 0));
addTileRotated("OffgridTiles_06.png", 2, new Array(0, 1, 0, 1));
addTileRotated("OffgridTiles_07.png", 4, new Array(0, 1, 1, 0));
//shallow water w/ null
addTileRotated("OffgridTiles_16.png", 4, new Array(0, 2, 0, 0));
addTileRotated("OffgridTiles_17.png", 4, new Array(2, 2, 2, 0));
addTileRotated("OffgridTiles_18.png", 2, new Array(0, 2, 0, 2));
addTileRotated("OffgridTiles_19.png", 4, new Array(0, 2, 2, 0));
//deep water w/ null
addTileRotated("OffgridTiles_12.png", 4, new Array(0, 3, 0, 0));
addTileRotated("OffgridTiles_13.png", 4, new Array(3, 3, 3, 0));
addTileRotated("OffgridTiles_14.png", 2, new Array(0, 3, 0, 3));
addTileRotated("OffgridTiles_15.png", 4, new Array(0, 3, 3, 0));
//forest w/ null
addTileRotated("OffgridTiles_08.png", 4, new Array(0, 4, 0, 0));
addTileRotated("OffgridTiles_09.png", 4, new Array(4, 4, 4, 0));
addTileRotated("OffgridTiles_10.png", 2, new Array(0, 4, 0, 4));
addTileRotated("OffgridTiles_11.png", 4, new Array(0, 4, 4, 0));

//tile Overlay pieces
//Plains and Deep Water w/ Cliff Borders
addDetailedTileRotated("OffgridTiles_20.png", 4, new Array(1, 3, 1, 0));
addDetailedTileRotated("OffgridTiles_21.png", 4, new Array(3, 0, 3, 1));
addDetailedTileRotated("OffgridTiles_22.png", 2, new Array(1, 3, 1, 3));
addDetailedTileRotated("OffgridTiles_23.png", 4, new Array(1, 3, 3, 1));

addDetailedTileRotated("OffgridTiles_24.png", 4, new Array(0, 0, 3, 1));
addDetailedTileRotated("OffgridTiles_25.png", 4, new Array(0, 0, 1, 3));


//plains w/ forest
// addTileRotated("OffgridTiles_20.png", 4, new Array(1, 2, 1, 1));
// addTileRotated("OffgridTiles_21.png", 4, new Array(2, 2, 2, 1));
// addTileRotated("OffgridTiles_22.png", 2, new Array(1, 2, 1, 2));
// addTileRotated("OffgridTiles_23.png", 4, new Array(1, 2, 2, 1));

//tileDict.push(new Tile("Tile Images/Offgrid Tiles_1.png", 0, new Array(1, 0, 0, 0)));

console.log(tileDict);