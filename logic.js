let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;


// array of arrays in board

function setGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
   for (let r = 0; r < rows; r++){
    for (let c = 0; c < columns; c++) {
        let tile =document.createElement("div");
        tile.id = r + "-" + c;
        let num = board[r][c];
        updateTile(tile, num);
        document.getElementById("board").append(tile);
                
        }
    }
// THis will set two random tile into 2
    setOne();
    setOne();

}
// setGame();

function updateTile(tile, num){
    tile.innerText = "";
    // clear the classlist 
    tile.classList.value = "";
    tile.classList.add("tile");

    if (num > 0){
        tile.innerText = num;
        if(num <= 4096){
            tile.classList.add("x" + num);
        } else{
            tile.classList.add("x8192");
        }

    }
}

// event that triggers when the web page finishes loading.
window.onload = function(){
    setGame();
  
}


function handleSlide(e){
// console.log(event.code);
event.preventDefault();
if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)){
    // if statement that will be base on which arrow was pressed.
    if (event.code == "ArrowLeft" && canMoveLeft()){
        slideLeft();
        setOne();
    } else if(event.code == "ArrowRight" && canMoveRight()){
        slideRight();
        setOne();
    } else if(event.code =="ArrowUp" && canMoveUp()){
        slideUp();
        setOne();
    }else if(event.code =="ArrowDown" && canMoveDown()){
        slideDown();
        setOne();
    }
}

document.getElementById('score').innerText = score;


setTimeout(()=>{
    if(hasLost()){
        alert("You Lost!");
        restartGame();
        alert("Click any arrow key to restart")
    }
    else{
        checkWin();
    }
}, 100);

}

function restartGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
setOne();
}


document.addEventListener("keydown", handleSlide);

function slideLeft(){
	for(let r= 0; r < rows; r++){
		// current array from the row
		let row = board[r]; //[0, 2, 2, 8] => [4, 8, 0, 0] / [16, 0, 0, 0]
		let originalRow = row.slice();


		//[2, 0, 2, 4] => [4, 4, 0, 0]
		row = slide(row);

		// updating the current state of the board.
		board[r] = row;

		// add for loop that will change the tiles.
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r + "-" + c)
			let num = board[r][c];
			if(originalRow[c] != num && num != 0){
				tile.style.animation = "slide-from-right 0.3s"

				setTimeout(() => {
					tile.style.animation = ""

				}, 300)
			}
			
			updateTile(tile, num);
		}
    }
}


function slideRight(){
    //reverse direction
    for (let r=0; r < rows; r++){
        let row = board[r];
        let originalRow = row.slice();
        row = row.reverse();
        row = slide(row);
        row =row.reverse();
        board[r] = row;
        // update the tile
        for(let c=0; c < columns; c++){
            let tile = document.getElementById(r + "-" + c);
            let num = board[r][c];
            if (originalRow[c] !=num && num!=0){
                tile.style.animation = "slide-from-left 0.3s"
                setTimeout(() => {
                    tile.style.animation = "";
                   
                }, 300)
            }
            updateTile(tile, num);

            
        }
        
    }

}

function slideUp(){
    for (let c=0; c < columns; c++){
//the elements of the col from the current iteration
        let col = board.map(row => row[c]);
        let originalCol = col.slice();
        col = slide(col);
        // update the current state of the board
        // update the tile
        for(let r=0; r < rows; r++){
            board[r][c] = col[r];
            let tile = document.getElementById(r + "-" + c);
            let num = board[r][c];
            if (originalCol[r] !=num && num!=0){
                tile.style.animation = "slide-from-bottom 0.3s"
                setTimeout(() => {
                    tile.style.animation = "";
                   
                }, 300)
            }

            updateTile(tile, num);
        }
    
    }
}

function slideDown(){
    
    for (let c=0; c < columns; c++){

        let col = board.map(row => row[c]);
        let originalCol = col.slice();
        col = col.reverse();
        col = slide(col);
        col = col.reverse();
        // update the current state of the board
        for(let r=0; r < rows; r++){
            board[r][c] = col[r];
            let tile = document.getElementById(r + "-" + c);
            let num = board[r][c];
            if (originalCol[r] !=num && num!=0){
                tile.style.animation = "slide-from-top 0.3s"
                setTimeout(() => {
                    tile.style.animation = "";
                   
                }, 300)
            }

            updateTile(tile, num);
        }

}
}

function filterZero(row){
    // filter removes the zero from the array
    return row.filter(num => num != 0);
}
// check the adjacent number equal and combine
function slide(row){
    row = filterZero(row);
    for (let i=0; i < row.length; i++){
        if (row[i] == row[i+1]){
            row[i]*=2;
            row[i+1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    // add zeros back
    while(row.length < columns){
        row.push(0);
    }
    return row;
}

// create a function that will check if there is an empty or none in the board.
//return boolean

function hasEmptyTile(){

    for (let r=0; r < rows; r++){
        for(let c=0; c < columns; c++){
            if (board[r][c] == 0){
                return true;
            }
        }
    }
    return false;
    
}

// create a function called setOne()
//It will randomly create/add tile in the board

function setOne(){
//    early exit if there is no available slot for the tile.
    if(!hasEmptyTile()){
        return;
    }
    // found variable will if we are able to find a slot or position or coordinate for the tile
        let found = false;
        while(!found){
            let r = Math.floor(Math.random() * rows);
            let c = Math.floor(Math.random() * columns);
            if (board[r][c] == 0){
                board[r][c] = 2;
                let tile = document.getElementById(r + "-" + c);
                updateTile(tile, board[r][c]);
                found = true;
            }
        }
}

// create a function that will check if there is possible to move going left.

function canMoveLeft(){
    for (let r=0; r < rows; r++){
        for(let c=0; c < columns; c++){
            if (board[r][c] != 0 ){
                if (board[r][c] == board[r][c-1] || board[r][c-1] == 0 ){
                return true;
            }
        }
    }
    

}
return false;
}

// create a function that will check if there is possible to move going right.

function canMoveRight(){
    for (let r=0; r < rows; r++){
        for(let c=0; c < columns; c++){
            if (board[r][c] != 0 ){
                // to check if the value to the right is 0 or equal to its
                if (board[r][c] == board[r][c+1] || board[r][c+1] == 0 ){
                return true;
            }
        }
    }
    
}
return false;
}

function canMoveUp(){
    for (let c=0; c < columns; c++){
        for(let r=1; r < rows; r++){
            if (board[r][c] != 0 ){
                // to check if the value to the up is 0 or equal to its
                if (board[r-1][c] == 0 || board[r-1][c] == board [r][c] ){
                return true;
            }
        }
    }
   

}
return false;
}

function canMoveDown(){
    for (let c=0; c < columns; c++){
        for(let r= rows - 2; r >= 0 ; r--){
            if (board[r][c] != 0 ){
                // to check if the value to the down is 0 or equal to its
                if (board[r+1][c] == 0 || board[r+1][c] == board [r][c] ){
                return true;
            }
        }
    }
  

}
return false;
}



// function check winning

function checkWin(){
    for (let r=0; r < rows; r++){
        for(let c=0; c < columns; c++){
            if (board[r][c] == 2048 && is2048Exist == false){
                alert('You win! you got the 2048');
                is2048Exist = true;   
            }else if (board[r][c] == 4096 && is4096Exist ==false){
                alert('You win! you got the 4096');
                is4096Exist = true;
            }else if (board[r][c] == 8192 && is4096Exist ==false){
                alert('You win! you got the 8192');
                is8192Exist = true;
            }
    
    }
    
}
}

//function that will check if the user lost

function hasLost(){
	for(let r= 0; r < rows; r++){
		for(let c= 0; c < columns; c++){
			if(board[r][c] == 0){
				return false;
			}


			let currentTile = board[r][c];

			if(r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile){
				return false
			}

		}
	}

	return true;
}