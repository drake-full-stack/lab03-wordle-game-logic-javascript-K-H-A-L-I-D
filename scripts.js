// ===== GAME STATE VARIABLES =====
const TARGET_WORD = "WORDS";  // Our secret word for testing
let currentRow = 0;           // Which row we're filling (0-5)
let currentTile = 0;          // Which tile in the row (0-4)
let gameOver = false;         // Is the game finished?

// DOM element references (set up on page load)
let gameBoard, rows, debugOutput;

// ===== HELPER FUNCTIONS (PROVIDED) =====

// Debug/Testing Functions
function logDebug(message, type = 'info') {
    // Log to browser console
    console.log(message);
    
    // Also log to visual testing area
    if (!debugOutput) {
        debugOutput = document.getElementById('debug-output');
    }
    
    if (debugOutput) {
        const entry = document.createElement('div');
        entry.className = `debug-entry ${type}`;
        entry.innerHTML = `
            <span style="color: #666; font-size: 12px;">${new Date().toLocaleTimeString()}</span> - 
            ${message}
        `;
        
        // Add to top of debug output
        debugOutput.insertBefore(entry, debugOutput.firstChild);
        
        // Keep only last 20 entries for performance
        const entries = debugOutput.querySelectorAll('.debug-entry');
        if (entries.length > 20) {
            entries[entries.length - 1].remove();
        }
    }
}

function clearDebug() {
    const debugOutput = document.getElementById('debug-output');
    if (debugOutput) {
        debugOutput.innerHTML = '<p style="text-align: center; color: #999; font-style: italic;">Debug output cleared - ready for new messages...</p>';
    }
}

// Helper function to get current word being typed
function getCurrentWord() {
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    let word = '';
    tiles.forEach(tile => word += tile.textContent);
    return word;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    gameBoard = document.querySelector('.game-board');
    rows = document.querySelectorAll('.row');
    debugOutput = document.getElementById('debug-output');
    
    logDebug("🎮 Game initialized successfully!", 'success');
    logDebug(`🎯 Target word: ${TARGET_WORD}`, 'info');
    logDebug("💡 Try typing letters, pressing Backspace, or Enter", 'info');
});

// ===== YOUR CHALLENGE: IMPLEMENT THESE FUNCTIONS =====

// TODO: Add keyboard event listener
document.addEventListener("keydown", (event) => {
    const key = event.key.toUpperCase();
    
    logDebug(`Key pressed: "${event.key}"`, 'info');
    
    // Check if game is over first
    if (gameOver) {
        logDebug("Game is over!", 'warning');
        return;
    }
    
    // Handle different key types
    if (key === "BACKSPACE") {
        deleteLetter();
    } else if (key === "ENTER") {
        submitGuess();
    } else if (/^[A-Z]$/.test(key)) {
        addLetter(key);
    } else {
        logDebug(`Ignored key: "${event.key}" (not a valid letter, Enter, or Backspace)`, 'warning');
    }
 });

// TODO: Implement addLetter function
 function addLetter(letter) {
    logDebug(`addLetter("${letter}") called`, 'info');
    
    // Check if current row is full
    if (currentTile >= 5) {
        logDebug("Row is full! Cannot add more letters.", 'error');
        return;
    }
    
    // Get the current row element
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    const tile = tiles[currentTile];
    
    // Set the tile content and styling
    tile.textContent = letter;
    tile.classList.add('filled');
    
    // Move to next position
    currentTile++;
    
    logDebug(`Added "${letter}" to position ${currentTile - 1} in row ${currentRow}`, 'success');
    logDebug(`Current word progress: "${getCurrentWord()}"`, 'info');
 }

// TODO: Implement deleteLetter function  
 function deleteLetter() {
    logDebug(`deleteLetter() called`, 'info');
    
    // Check if there are letters to delete
    if (currentTile <= 0) {
        logDebug("No letters to delete in current row", 'error');
        return;
    }
    
    // Move back one position first
    currentTile--;
    
    // Get the current row element and the tile to clear
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    const tile = tiles[currentTile];
    
    // Store the letter being deleted for logging
    const letterBeingDeleted = tile.textContent;
    
    // Clear the tile
    tile.textContent = '';
    tile.classList.remove('filled');
    
    logDebug(`Deleted "${letterBeingDeleted}" from position ${currentTile} in row ${currentRow}`, 'success');
    logDebug(`Current word progress: "${getCurrentWord()}"`, 'info');
 }

// TODO: Implement submitGuess function
 function submitGuess() {
    logDebug(`submitGuess() called`, 'info');
    
    // Check if row has exactly 5 letters
    if (currentTile !== 5) {
        alert("Please enter exactly 5 letters!");
        logDebug("Cannot submit - need exactly 5 letters", 'error');
        return;
    }
    
    // Get the current row element and build the guess
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    let guess = '';
    
    tiles.forEach(tile => {
        guess += tile.textContent;
    });
    
    logDebug(`Submitting guess: "${guess}" (Target: "${TARGET_WORD}")`, 'info');
    
    // Check the guess and apply colors
    const result = checkGuess(guess, tiles);
    logDebug(`Guess result: ${JSON.stringify(result)}`, 'info');
    
    // Move to next row
    currentRow++;
    currentTile = 0;
    
    // Check win condition
    if (guess === TARGET_WORD) {
        gameOver = true;
        setTimeout(() => alert("🎉 Congratulations! You won!"), 500);
        logDebug("GAME WON!", 'success');
    } else if (currentRow >= 6) {
        // Check lose condition
        gameOver = true;
        setTimeout(() => alert(`Game Over! The word was "${TARGET_WORD}"`), 500);
        logDebug("GAME LOST - Used all 6 rows", 'error');
    } else {
        logDebug(`Moving to row ${currentRow}. ${6 - currentRow} guesses remaining.`, 'info');
    }
 }

// TODO: Implement checkGuess function (the hardest part!)
 function checkGuess(guess, tiles) {
    logDebug(`Starting analysis for "${guess}" against target "${TARGET_WORD}"`, 'info');
    
    // Split words into arrays for easier manipulation
    const target = TARGET_WORD.split('');
    const guessArray = guess.split('');
    const result = ['absent', 'absent', 'absent', 'absent', 'absent'];
    
    logDebug(`Target array: [${target.join(', ')}]`, 'info');
    logDebug(`Guess array: [${guessArray.join(', ')}]`, 'info');
    
    // STEP 1: Find exact matches (correct position)
    logDebug(`STEP 1: Finding exact matches...`, 'info');
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] === target[i]) {
            result[i] = 'correct';
            // Mark both as used by setting to null
            target[i] = null;
            guessArray[i] = null;
            logDebug(`Position ${i}: "${guess[i]}" is CORRECT`, 'success');
        }
    }
    
    logDebug(`After Step 1 - remaining target: [${target.join(', ')}]`, 'info');
    logDebug(`After Step 1 - remaining guess: [${guessArray.join(', ')}]`, 'info');
    
    // STEP 2: Find wrong position matches (present)
    logDebug(`STEP 2: Finding wrong position matches...`, 'info');
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] !== null) { // Only check unused letters from guess
            // Look for this letter in remaining target letters
            for (let j = 0; j < 5; j++) {
                if (target[j] === guessArray[i]) {
                    result[i] = 'present';
                    target[j] = null; // Mark target letter as used
                    logDebug(`Position ${i}: "${guess[i]}" is PRESENT (found at target position ${j})`, 'info');
                    break; // Found one match, stop looking
                }
            }
            if (result[i] === 'absent') {
                logDebug(`Position ${i}: "${guess[i]}" is ABSENT`, 'info');
            }
        }
    }
    
    // Apply CSS classes to tiles based on results
    tiles.forEach((tile, index) => {
        // Remove any existing color classes
        tile.classList.remove('correct', 'present', 'absent');
        // Add the new class based on result
        tile.classList.add(result[index]);
        logDebug(`Tile ${index}: Applied class "${result[index]}"`, 'info');
    });
    
    logDebug(`🏁 Final result: [${result.join(', ')}]`, 'success');
    return result;
 }