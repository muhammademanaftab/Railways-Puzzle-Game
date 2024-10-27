document.addEventListener("DOMContentLoaded", function () {
    // Data Variables
    let container_menu = document.querySelector(".container-menu");
    let game_start = document.querySelector(".start_game");
    let rules_btn = document.querySelector("#rules");
    let instructions = document.querySelector(".instructions");
    let back_btn_rules = document.querySelector(".back-btn");
    let start_btn = document.querySelector("#start");
    let timerDisplay = document.querySelector(".time");
    const playerNameInput = document.getElementById("playerNameInput"); // Name input box
    const easyButton = document.querySelector(".btn.easy");
    const hardButton = document.querySelector(".btn.hard");

    let timer = null;
    let startTime;
    let selectedDifficulty = null;

    // Start Timer function
    function startTimer() {
        startTime = new Date();
        timer = setInterval(function() {
            const elapsedTime = new Date() - startTime;
            const seconds = Math.floor((elapsedTime / 1000) % 60);
            const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
            timerDisplay.textContent = formatTime(minutes) + ':' + formatTime(seconds);
    
            // Check if the game is complete each second
            const isWin = checkWinCondition(getCurrentBoardLayout());
            console.log("Win Condition Check:", isWin);
            if (isWin) {
                stopTimer();
                saveCompletionTime(minutes, seconds);
            }
        }, 1000);
    }
    
    // Save player completion time on winning
    function saveCompletionTime(minutes, seconds) {
        const playerName = localStorage.getItem("playerName") || "Player";
        const time = { minutes: minutes, seconds: seconds };

        saveScore(playerName, time);
        alert(`Congratulations, ${playerName}! Your time has been saved.`);
        
        // Return to menu
        container_menu.hidden = false;
        game_start.hidden = true;
    }

    function saveScore(playerName, time) {
        // Retrieve existing scores or create an empty array if none exist
        const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    
        // Add the new score
        scores.push({ name: playerName, minutes: time.minutes, seconds: time.seconds });
    
        // Save back to localStorage
        localStorage.setItem("leaderboard", JSON.stringify(scores));
    }

    function formatTime(time) {
        return time < 10 ? '0' + time : time;
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function resetTimer() {
        stopTimer();
        timerDisplay.textContent = "00:00";
        startTimer();
    }

    // Store player name in localStorage when they enter it
    playerNameInput.addEventListener("input", () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            localStorage.setItem("playerName", playerName);
        }
    }); 
    










    let resetButton = document.querySelector("#resetButton"); // Added resetButton declaration
    const paletteImageElements = document.querySelectorAll(".palette-image");

    let selectedTile = null; // Declare selectedTile

    // Map data with tile information
    const mapData = {
        "bridge": { name: "Bridge", angle: 0, src: "Images/bridge.png" },
        "empty": { name: "Empty Tile", angle: 0, src: "Images/empty.png" },
        "mountain": { name: "Mountain", angle: 0, src: "Images/mountain.png" },
        "oasis": { name: "Oasis", angle: 0, src: "Images/oasis.png" }
    };



    // Layouts
    // Layout for the 5x5 tables
    // 1
    const layout_5_1 = [
        [{ type: "empty", angle: 0 }, { type: "mountain", angle: 90 }, { type: "empty", angle: 0 }, { type: "empty", angle: 0 }, { type: "oasis", angle: 180 }],
        [{ type: "empty", angle: 0 }, { type: "empty", angle: 0 }, { type: "empty", angle: 0 }, { type: "bridge", angle: 0 }, { type: "oasis", angle: 180 }],
        [{ type: "bridge", angle: 0 }, { type: "empty", angle: 0 }, { type: "mountain", angle: 180 }, { type: "empty", angle: 0 }, { type: "empty", angle: 0 }],
        [{ type: "empty", angle: 0 }, { type: "empty", angle: 0 }, { type: "empty", angle: 0 }, { type: "oasis", angle: 180 }, { type: "empty", angle: 0 }],
        [{ type: "empty", angle: 0 }, { type: "empty", angle: 0 }, { type: "mountain", angle: 270 }, { type: "empty", angle: 0 }, { type: "empty", angle: 0 }]
    ];

    


    const layouts_5 = [
        layout_5_1,
        // layout_5_2,
        // layout_5_3,
        // layout_5_4,
        // layout_5_5,
        // layout_7_1,
        // layout_7_2
    ];

    if (selectedDifficulty == "5x5") {
        map_layout = layouts_5
    }
    else {
        map_layout = layouts_7
    }


   


    function getRandomLayout(map_layout) {
        const randomIndex = Math.floor(Math.random() * map_layout.length);
        return map_layout[randomIndex];
    }



    let initialLayout = getRandomLayout(); // Declare initialLayout

    // Call the function with the predefined layout
    populateGameBoard(initialLayout);

    function resetBoard() {
        populateGameBoard(initialLayout);  // Repopulate the board with the initial layout
    }

    function populateGameBoard(layout) {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
    
        layout.forEach((rowData, rowIndex) => {
            const row = document.createElement('tr');
            rowData.forEach((tile, colIndex) => {
                const cell = document.createElement('td');
                const tileData = mapData[tile.type];
                const imgElement = document.createElement('img');
                imgElement.src = tileData.src;
                imgElement.alt = tileData.name;
                imgElement.style.transform = `rotate(${tile.angle}deg)`;
                cell.appendChild(imgElement);
                row.appendChild(cell);
    
                // Right-click event to restore tile to initial state if modified
                imgElement.addEventListener('contextmenu', function (event) {
                    event.preventDefault(); // Prevent default context menu
                    restoreTileIfDifferent(rowIndex, colIndex, imgElement);
                });
    
                // Left-click event to change the tile based on selected tile
                imgElement.addEventListener('click', function (event) {
                    if (selectedTile) {
                        const currentTileType = tile.type; // Type of the tile currently in the cell
                        const selectedTileType = selectedTile.name; // Name/type of the selected tile
    
                        let canReplace = false;
                        // Rules for replacement based on current and selected tile types
                        if (currentTileType === "empty" && (selectedTileType === "straight_rail" || selectedTileType === "curve_rail")) {
                            canReplace = true;
                        } else if (currentTileType === "bridge" && selectedTileType === "bridge_rail") {
                            canReplace = true;
                        } else if (currentTileType === "mountain" && selectedTileType === "mountain_rail") {
                            canReplace = true;
                        }
    
                        if (canReplace) {
                            // Update the tile with the selected tile's properties
                            imgElement.src = selectedTile.src;
                            imgElement.alt = selectedTile.name;
                            if (selectedTileType !== "bridge_rail" && selectedTileType !== "mountain_rail") {
                                selectedTile.angle = (selectedTile.angle + 90) % 360;
                                imgElement.style.transform = `rotate(${selectedTile.angle}deg)`;
                            } else {
                                imgElement.style.transform = `rotate(${tile.angle}deg)`;
                            }
                        } else {
                            showMessage("Invalid move: Cannot replace this tile!");
                        }
                    }
                    // printCurrentBoardLayout();
                    // areRailsConnected(getCurrentBoardLayout());
                    // areRailsConnected(getCurrentBoardLayout());
                    // checkWinCondition(getCurrentBoardLayout())
                    
                    event.stopPropagation(); 
                });
            });
            gameBoard.appendChild(row);
        });
    }




    const messageBox = document.getElementById("messageBox");

    function showMessage(message) {
        messageBox.innerText = message;
        messageBox.style.display = "block"; // Show the message box
        setTimeout(() => {
            messageBox.style.display = "none"; // Hide the message box after 3 seconds
        }, 3000);    
    }    

    // General function to populate the game board based on the provided layout
   



// Define rail properties by type and angle
const railProperties = {
    straight_rail: {
        0: ["top", "bottom"],
        90: ["left", "right"],
        180: ["top", "bottom"],
        270: ["bottom", "right"]
    },
    curve_rail: {
        0: ["bottom", "right"],
        90: ["bottom", "left"],
        180: ["top", "left"],
        270: ["top", "right"]
    },
    mountain_rail: {
        0: ["bottom", "right"],
        90: ["bottom", "left"],
        180: ["top", "left"],
        270: ["top", "right"]
    },
    bridge_rail: {
        0: ["top", "bottom"],
        180: ["left", "right"]
    }
};


function isCompleteBoard(boardLayout) {
    for (let rowIndex = 0; rowIndex < boardLayout.length; rowIndex++) {
        for (let colIndex = 0; colIndex < boardLayout[rowIndex].length; colIndex++) {
            const tile = boardLayout[rowIndex][colIndex];
            if (tile.type !== "oasis" && !tile.type.includes("rail")) {
                console.log(`Tile at (${rowIndex}, ${colIndex}) is not a rail or oasis:`, tile);
                return false; // Found a non-oasis tile that isn't a rail
            }
        }
    }
    console.log("All non-oasis tiles are correctly replaced by rails.");
    return true; // All non-oasis tiles are rails
}

function areRailsConnected(boardLayout) {
    const rows = boardLayout.length;
    const cols = boardLayout[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const tile = boardLayout[i][j];

            if (!tile.type.includes("rail")) continue; // Skip non-rail tiles

            const connections = railProperties[tile.type][tile.angle];
            console.log(`Checking connections for rail at (${i}, ${j}) with type: ${tile.type} and angle: ${tile.angle}`);

            // Check top connection
            if (connections.includes("top") && i > 0) {
                const topTile = boardLayout[i - 1][j];
                const topConnected = topTile.type.includes("rail") && railProperties[topTile.type][topTile.angle].includes("bottom");
                console.log(`Top neighbor at (${i-1}, ${j}) - Connected: ${topConnected}`);
                if (!topConnected) return false;
            }

            // Check bottom connection
            if (connections.includes("bottom") && i < rows - 1) {
                const bottomTile = boardLayout[i + 1][j];
                const bottomConnected = bottomTile.type.includes("rail") && railProperties[bottomTile.type][bottomTile.angle].includes("top");
                console.log(`Bottom neighbor at (${i+1}, ${j}) - Connected: ${bottomConnected}`);
                if (!bottomConnected) return false;
            }

            // Check left connection
            if (connections.includes("left") && j > 0) {
                const leftTile = boardLayout[i][j - 1];
                const leftConnected = leftTile.type.includes("rail") && railProperties[leftTile.type][leftTile.angle].includes("right");
                console.log(`Left neighbor at (${i}, ${j-1}) - Connected: ${leftConnected}`);
                if (!leftConnected) return false;
            }

            // Check right connection
            if (connections.includes("right") && j < cols - 1) {
                const rightTile = boardLayout[i][j + 1];
                const rightConnected = rightTile.type.includes("rail") && railProperties[rightTile.type][rightTile.angle].includes("left");
                console.log(`Right neighbor at (${i}, ${j+1}) - Connected: ${rightConnected}`);
                if (!rightConnected) return false;
            }
        }
    }
    console.log("All rails are correctly connected.");
    return true; // All rail segments are correctly connected
}

function checkWinCondition(boardLayout) {
    const completeBoard = isCompleteBoard(boardLayout);
    console.log("Complete Board Check:", completeBoard);

    const railsConnected = areRailsConnected(boardLayout);
    console.log("Rails Connected Check:", railsConnected);

    const winCondition = completeBoard && railsConnected;
    console.log("Win Condition:", winCondition);
    return winCondition;
}


    function restoreTileIfDifferent(rowIndex, colIndex, imgElement) {
        const currentTile = getCurrentBoardLayout()[rowIndex][colIndex];
        const originalTile = initialLayout[rowIndex][colIndex]; // Use initialLayout which should be globally accessible
        if (currentTile.type !== originalTile.type || currentTile.angle !== originalTile.angle) {
            // Restore original state
            const tileData = mapData[originalTile.type];
            imgElement.src = tileData.src;
            imgElement.alt = tileData.name;
            imgElement.style.transform = `rotate(${originalTile.angle}deg)`;
            console.log(`Tile at row ${rowIndex}, column ${colIndex} restored to original.`);
        }
    }

   
    function getCurrentBoardLayout() {
        const gameBoard = document.getElementById('gameBoard');
        const rows = gameBoard.querySelectorAll('tr');
        const currentLayout = Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td');
            return Array.from(cells).map(cell => {
                const img = cell.querySelector('img');
                const altText = img.alt.toLowerCase(); // Get the full alt text
                const type = altText.replace(' tile', ''); // Remove additional text to match the expected types
                const angleMatch = img.style.transform.match(/rotate\((\d+)deg\)/);
                const angle = angleMatch ? parseInt(angleMatch[1], 10) % 360 : 0;
                return { type: type, angle: angle };
            });
        });
        return currentLayout;
    }
    
    function printCurrentBoardLayout() {
        const layout = getCurrentBoardLayout();
        console.log("Current Board Layout:");
        console.log(layout);
    }
    
    function layoutsAreEqual(layout1, layout2) {
        if (layout1.length !== layout2.length) return false;
        for (let i = 0; i < layout1.length; i++) {
            if (layout1[i].length !== layout2[i].length) return false;
            for (let j = 0; j < layout1[i].length; j++) {
                if (layout1[i][j].type !== layout2[i][j].type || layout1[i][j].angle !== layout2[i][j].angle) {
                    console.log(`Mismatch at row ${i}, column ${j}: Expected { type: ${layout2[i][j].type}, angle: ${layout2[i][j].angle} }, Found { type: ${layout1[i][j].type}, angle: ${layout1[i][j].angle} }`);
                    return false;
                }
            }
        }
        return true;
    }
    

    
    // Example of using the comparison
    // const currentLayout = getCurrentBoardLayout();
    // const targetLayout = layout_5_1; // Assuming this is a layout you are checking against
    // const isEqual = layoutsAreEqual(currentLayout, targetLayout);
    // console.log("Layouts are equal:", isEqual);
    // console.log(isEqual);
    
    

    function rotateTile(imgElement, tile) {
        tile.angle = (tile.angle + 90) % 360; // Increment the angle by 90 degrees and ensure it wraps around at 360 degrees
        imgElement.style.transform = `rotate(${tile.angle}deg)`; // Apply the new rotation
    }
    


    // Add event listener to the reset button if it exists
    if (resetButton) {
        resetButton.addEventListener("click", resetBoard);
    }

    const paletteImages = document.querySelectorAll(".palette-image");
    paletteImages.forEach((img) => {
        img.addEventListener("click", function () {
            selectedTile = {
                src: img.src,  // The source of the selected palette image
                name: img.alt.includes("rail") ? img.alt : "",  // Set the name based on the alt text
                angle: 0  // Default angle (can be adjusted later if needed)
            };
            console.log("Selected tile:", selectedTile);
        });
    });











    // UI interaction functions

    playerNameInput.addEventListener("input", () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            localStorage.setItem("playerName", playerName);
        }
    });

    easyButton.addEventListener("click", () => {
        selectedDifficulty = "5x5";
        easyButton.classList.add("selected");
        hardButton.classList.remove("selected");
    });

    hardButton.addEventListener("click", () => {
        selectedDifficulty = "7x7";
        hardButton.classList.add("selected");
        easyButton.classList.remove("selected");
    });

    // Validate and start the game only if name and difficulty are set
    start_btn.addEventListener("click", function () {
        const playerName = playerNameInput.value.trim();

        if (!playerName) {
            alert("Please enter your name.");
            return;
        }

        if (!selectedDifficulty) {
            alert("Please select a difficulty level.");
            return;
        }

        // Start game and hide the menu
        container_menu.hidden = true;
        game_start.hidden = false;
        startTimer();
    });


    rules_btn.addEventListener("click", function () {
        container_menu.hidden = true;
        instructions.hidden = false;
    });

    back_btn_rules.addEventListener("click", function () {
        container_menu.hidden = false;
        instructions.hidden = true;
    });

    

});