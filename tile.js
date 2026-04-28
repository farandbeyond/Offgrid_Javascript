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
        if(this.pTL != TL && this.pTL != tWild) return false;
        if(this.pTR != TR && this.pTR != tWild) return false;
        if(this.pBR != BR && this.pBR != tWild) return false;
        if(this.pBL != BL && this.pBL != tWild) return false;

        return true;
    }

    draw(ctx, posX, posY, height){
        //console.log(this.image);
        //ctx.drawImage(this.image, posX * tileSize, posY * tileSize, tileSize, tileSize);
        if(this.radians != 0){
            
            ctx.save(); // Save current state (translation/rotation)
            ctx.translate(
                posX * tileSize + tileSize / 2, 
                (height * tileSize - posY * tileSize) + tileSize / 2); // Move to rotation center
            ctx.rotate(this.radians); // Rotate canvas
            ctx.translate(tileSize/2, tileSize/2);
            // Draw image centered at (0,0) of the new coordinate system
            ctx.drawImage(this.image, -tileSize, -tileSize, tileSize, tileSize);
            ctx.restore(); // Restore original state
        }else{
            ctx.drawImage(this.image, posX * tileSize, height * tileSize - posY * tileSize, tileSize, tileSize);
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
const tWild = '@';

const tFloor = '0';
const tWall = '1';
const tWater = 'w';
const tDeep = 'W'


const tileLayers = [tFloor, tWall, tWater, tDeep, tWild];


//basic full tiles
addTileRotated("OffgridTiles_00.png", 1, new Array(tFloor, tFloor, tFloor, tFloor));
addTileRotated("OffgridTiles_03.png", 1, new Array(tWater, tWater, tWater, tWater));
addTileRotated("OffgridTiles_02.png", 1, new Array(tDeep, tDeep, tDeep, tDeep));
addTileRotated("OffgridTiles_01.png", 1, new Array(tWall, tWall, tWall, tWall));
//plains w/ null
addTileRotated("OffgridTiles_04.png", 4, new Array(tWild, tFloor, tWild, tWild));
addTileRotated("OffgridTiles_05.png", 4, new Array(tFloor, tFloor, tFloor, tWild));
addTileRotated("OffgridTiles_06.png", 2, new Array(tWild, tFloor, tWild, tFloor));
addTileRotated("OffgridTiles_07.png", 4, new Array(tWild, tFloor, tFloor, tWild));
//shallow water w/ null
addTileRotated("OffgridTiles_16.png", 4, new Array(tWild, tWater, tWild, tWild));
addTileRotated("OffgridTiles_17.png", 4, new Array(tWater, tWater, tWater, tWild));
addTileRotated("OffgridTiles_18.png", 2, new Array(tWild, tWater, tWild, tWater));
addTileRotated("OffgridTiles_19.png", 4, new Array(tWild, tWater, tWater, tWild));
//deep water w/ null
addTileRotated("OffgridTiles_12.png", 4, new Array(tWild, tDeep, tWild, tWild));
addTileRotated("OffgridTiles_13.png", 4, new Array(tDeep, tDeep, tDeep, tWild));
addTileRotated("OffgridTiles_14.png", 2, new Array(tWild, tDeep, tWild, tDeep));
addTileRotated("OffgridTiles_15.png", 4, new Array(tWild, tDeep, tDeep, tWild));
//forest w/ null
addTileRotated("OffgridTiles_08.png", 4, new Array(tWild, tWall, tWild, tWild));
addTileRotated("OffgridTiles_09.png", 4, new Array(tWall, tWall, tWall, tWild));
addTileRotated("OffgridTiles_10.png", 2, new Array(tWild, tWall, tWild, tWall));
addTileRotated("OffgridTiles_11.png", 4, new Array(tWild, tWall, tWall, tWild));

//tile Overlay pieces
//Plains and Deep Water w/ Cliff Borders
addDetailedTileRotated("OffgridTiles_20.png", 4, new Array(tFloor, tDeep, tFloor, tWild));
addDetailedTileRotated("OffgridTiles_21.png", 4, new Array(tDeep, tWild, tDeep, tFloor));
addDetailedTileRotated("OffgridTiles_22.png", 2, new Array(tFloor, tDeep, tFloor, tDeep));
addDetailedTileRotated("OffgridTiles_23.png", 4, new Array(tFloor, tDeep, tDeep, tFloor));

addDetailedTileRotated("OffgridTiles_24.png", 4, new Array(tWild, tWild, tDeep, tFloor));
addDetailedTileRotated("OffgridTiles_25.png", 4, new Array(tWild, tWild, tFloor, tDeep));


//plains w/ forest
// addTileRotated("OffgridTiles_20.png", 4, new Array(1, 2, 1, 1));
// addTileRotated("OffgridTiles_21.png", 4, new Array(2, 2, 2, 1));
// addTileRotated("OffgridTiles_22.png", 2, new Array(1, 2, 1, 2));
// addTileRotated("OffgridTiles_23.png", 4, new Array(1, 2, 2, 1));

//tileDict.push(new Tile("Tile Images/Offgrid Tiles_1.png", 0, new Array(1, 0, 0, 0)));

console.log(tileDict);