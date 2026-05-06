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
        if(this.pTL != TL && this.pTL != t_Wild) return false;
        if(this.pTR != TR && this.pTR != t_Wild) return false;
        if(this.pBR != BR && this.pBR != t_Wild) return false;
        if(this.pBL != BL && this.pBL != t_Wild) return false;

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
const t_Wild = '@';

const tFloor = '0';
const tWalls = 'W';
const tWater = 'w';
const tDeepW = 'x';
const tMuddy = 'H';


const tileLayers = [tFloor, tWalls, tWater, tDeepW, tMuddy, t_Wild];


//basic full tiles

//plains w/ null
addTileRotated("OffgridTiles_00.png", 1, new Array(tFloor, tFloor, tFloor, tFloor));
addTileRotated("OffgridTiles_01.png", 4, new Array(t_Wild, tFloor, t_Wild, t_Wild));
addTileRotated("OffgridTiles_02.png", 4, new Array(tFloor, tFloor, tFloor, t_Wild));
addTileRotated("OffgridTiles_03.png", 2, new Array(t_Wild, tFloor, t_Wild, tFloor));
addTileRotated("OffgridTiles_04.png", 4, new Array(t_Wild, tFloor, tFloor, t_Wild));
//shallow water w/ null
addTileRotated("OffgridTiles_15.png", 1, new Array(tWater, tWater, tWater, tWater));
addTileRotated("OffgridTiles_16.png", 4, new Array(t_Wild, tWater, t_Wild, t_Wild));
addTileRotated("OffgridTiles_17.png", 4, new Array(tWater, tWater, tWater, t_Wild));
addTileRotated("OffgridTiles_18.png", 2, new Array(t_Wild, tWater, t_Wild, tWater));
addTileRotated("OffgridTiles_19.png", 4, new Array(t_Wild, tWater, tWater, t_Wild));
//deep water w/ null
addTileRotated("OffgridTiles_10.png", 1, new Array(tDeepW, tDeepW, tDeepW, tDeepW));
addTileRotated("OffgridTiles_11.png", 4, new Array(t_Wild, tDeepW, t_Wild, t_Wild));
addTileRotated("OffgridTiles_12.png", 4, new Array(tDeepW, tDeepW, tDeepW, t_Wild));
addTileRotated("OffgridTiles_13.png", 2, new Array(t_Wild, tDeepW, t_Wild, tDeepW));
addTileRotated("OffgridTiles_14.png", 4, new Array(t_Wild, tDeepW, tDeepW, t_Wild));
//forest w/ null
addTileRotated("OffgridTiles_05.png", 1, new Array(tWalls, tWalls, tWalls, tWalls));
addTileRotated("OffgridTiles_06.png", 4, new Array(t_Wild, tWalls, t_Wild, t_Wild));
addTileRotated("OffgridTiles_07.png", 4, new Array(tWalls, tWalls, tWalls, t_Wild));
addTileRotated("OffgridTiles_08.png", 2, new Array(t_Wild, tWalls, t_Wild, tWalls));
addTileRotated("OffgridTiles_09.png", 4, new Array(t_Wild, tWalls, tWalls, t_Wild));
//mud w/ null
addTileRotated("OffgridTiles_20.png", 1, new Array(tMuddy, tMuddy, tMuddy, tMuddy));
addTileRotated("OffgridTiles_21.png", 4, new Array(t_Wild, tMuddy, t_Wild, t_Wild));
addTileRotated("OffgridTiles_22.png", 4, new Array(tMuddy, tMuddy, tMuddy, t_Wild));
addTileRotated("OffgridTiles_23.png", 2, new Array(t_Wild, tMuddy, t_Wild, tMuddy));
addTileRotated("OffgridTiles_24.png", 4, new Array(t_Wild, tMuddy, tMuddy, t_Wild));

//tile Overlay pieces
//Plains and Deep Water w/ Cliff Borders
//more specific needs to go first; otherwise less specifics take priority
addDetailedTileRotated("OffgridTiles_27.png", 2, new Array(tFloor, tDeepW, tFloor, tDeepW));

addDetailedTileRotated("OffgridTiles_25.png", 4, new Array(tFloor, tDeepW, tFloor, t_Wild));
addDetailedTileRotated("OffgridTiles_26.png", 4, new Array(tDeepW, t_Wild, tDeepW, tFloor));
addDetailedTileRotated("OffgridTiles_28.png", 4, new Array(tFloor, tDeepW, tDeepW, tFloor));

addDetailedTileRotated("OffgridTiles_29.png", 4, new Array(t_Wild, t_Wild, tFloor, tDeepW));
addDetailedTileRotated("OffgridTiles_30.png", 4, new Array(t_Wild, t_Wild, tDeepW, tFloor));


//plains w/ forest
// addTileRotated("OffgridTiles_20.png", 4, new Array(1, 2, 1, 1));
// addTileRotated("OffgridTiles_21.png", 4, new Array(2, 2, 2, 1));
// addTileRotated("OffgridTiles_22.png", 2, new Array(1, 2, 1, 2));
// addTileRotated("OffgridTiles_23.png", 4, new Array(1, 2, 2, 1));

//tileDict.push(new Tile("Tile Images/Offgrid Tiles_1.png", 0, new Array(1, 0, 0, 0)));

console.log(tileDict);