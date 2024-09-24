import { print, askQuestion } from "./io.mjs"
import { debug, DEBUG_LEVELS } from "./debug.mjs";
import { ANSI } from "./ansi.mjs";
import DICTIONARY from "./language.mjs";
import showSplashScreen from "./splash.mjs";

const GAME_BOARD_SIZE = 3;
const PLAYER_1 = 1;
const PLAYER_2 = -1;

// These are the valid choices for the menu.
const MENU_CHOICES = {
    MENU_CHOICE_START_GAME: 1,
    MENU_CHOICE_SHOW_SETTINGS: 2,
    MENU_CHOICE_EXIT_GAME: 3
};

const SETTINGS_MENU_CHOICES = {
    SETTINGS_MENU_CHOICE_LANGUAGES: 1,
    SETTINGS_MENU_CHOICE_BACK: 2
}

const LANGUAGE_MENU_CHOICES = {
    LANGUAGE_MENU_CHOICE_NORWEGIAN: 1,
    LANGUAGE_MENU_CHOICE_ENGLISH: 2,
    LANGUAGE_MENU_CHOICE_BACK: 3
}

const NO_CHOICE = -1;

let chosenAction = NO_CHOICE;
let language = DICTIONARY.en;
let gameboard;
let currentPlayer;


clearScreen();
showSplashScreen();
setTimeout(start, 2500); // This waits 2.5seconds before calling the function. i.e. we get to see the splash screen for 2.5 seconds before the menue takes over. 


//#region game functions -----------------------------

async function start() {

    do {

        chosenAction = await showMenu();

        if (chosenAction == MENU_CHOICES.MENU_CHOICE_START_GAME) {
            await runGame();
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS) {
            await showSettingsMenu();
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_EXIT_GAME) {
            clearScreen();
            process.exit();
        }

    } while (true)

}

async function runGame() {

    let isPlaying = true;

    while (isPlaying) { // Do the following until the player dos not want to play anymore. 
        initializeGame(); // Reset everything related to playing the game
        isPlaying = await playGame(); // run the actual game 
    }
}

async function showMenu() {

    let choice = -1;  // This variable tracks the choice the player has made. We set it to -1 initially because that is not a valid choice.
    let validChoice = false;    // This variable tells us if the choice the player has made is one of the valid choices. It is initially set to false because the player has made no choices.

    while (!validChoice) {
        // Display our menu to the player.
        clearScreen();
        print(ANSI.COLOR.YELLOW + "MENU" + ANSI.RESET);
        print("1. Play Game");
        print("2. Settings");
        print("3. Exit Game");

        // Wait for the choice.
        choice = await askQuestion("");

        // Check to see if the choice is valid.
        if ([MENU_CHOICES.MENU_CHOICE_START_GAME, MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS, MENU_CHOICES.MENU_CHOICE_EXIT_GAME].includes(Number(choice))) {
            validChoice = true;
        }
    }

    return choice;
}

async function showSettingsMenu() {

    let choice = -1;  // This variable tracks the choice the player has made. We set it to -1 initially because that is not a valid choice.
    let validChoice = false;    // This variable tells us if the choice the player has made is one of the valid choices. It is initially set to false because the player has made no choices.

    while (!validChoice) {
        // Display our menu to the player.
        clearScreen();
        print(ANSI.COLOR.YELLOW + "MENU" + ANSI.RESET);
        print("1. Languages");
        print("2. Back");

        // Wait for the choice.
        choice = await askQuestion("");

        // Check to see if the choice is valid.
        if ([SETTINGS_MENU_CHOICES.SETTINGS_MENU_CHOICE_LANGUAGES].includes(Number(choice))){
            validChoice = true;
            await showLanguagesMenu();
        } else if ([, SETTINGS_MENU_CHOICES.SETTINGS_MENU_CHOICE_BACK].includes(Number(choice))){
            validChoice = true;
            await start();
        }
        
    }

    return choice;
}

async function showLanguagesMenu() {

    let choice = -1;  // This variable tracks the choice the player has made. We set it to -1 initially because that is not a valid choice.
    let validChoice = false;    // This variable tells us if the choice the player has made is one of the valid choices. It is initially set to false because the player has made no choices.

    while (!validChoice) {
        // Display our menu to the player.
        clearScreen();
        print(ANSI.COLOR.YELLOW + "MENU" + ANSI.RESET);
        print("1. Norwegian");
        print("2. English");
        print("3. Back");

        // Wait for the choice.
        choice = await askQuestion("");

        // Check to see if the choice is valid.
        if ([LANGUAGE_MENU_CHOICES.LANGUAGE_MENU_CHOICE_NORWEGIAN].includes(Number(choice))) {
            validChoice = true;
            language = DICTIONARY.no;
        } else if ([LANGUAGE_MENU_CHOICES.LANGUAGE_MENU_CHOICE_ENGLISH].includes(Number(choice))){
            validChoice = true;
            language = DICTIONARY.en;
        } else {
            showSettingsMenu();
        }
    }

    return choice;
}


async function playGame() {
    // Play game..
    let outcome;
    do {
        clearScreen();
        showGameBoardWithCurrentState();
        showHUD();
        let move = await getGameMoveFromCurrentPlayer();
        updateGameBoardState(move);
        outcome = evaluateGameState();
        changeCurrentPlayer();
    } while (outcome == 0)

    showGameSummary(outcome);

    return await askWantToPlayAgain();
}

async function askWantToPlayAgain() {
    let answer = await askQuestion(language.PLAY_AGAIN_QUESTION);
    let playAgain = true;
    if (answer && answer.toLowerCase()[0] != language.CONFIRM) {
        playAgain = false;
    }
    return playAgain;
}

function showGameSummary(outcome) {
    clearScreen();
    let winningPlayer = (outcome > 0) ? 1 : 2;
    print("Winner is player " + winningPlayer);
    showGameBoardWithCurrentState();
    print("GAME OVER");
}

function changeCurrentPlayer() {
    currentPlayer *= -1;
}

function evaluateGameState() {
    let sum = 0;
    let sumPosDiagonal = 0;
    let sumNegDiagonal = 0;
    let state = 0;

    for (let row = 0; row < GAME_BOARD_SIZE; row++) {

        for (let col = 0; col < GAME_BOARD_SIZE; col++) {
            sum += gameboard[row][col];
        }

        if (Math.abs(sum) == 3) {
            state = sum;
        }
        sum = 0;
    }

    for (let col = 0; col < GAME_BOARD_SIZE; col++) {

        for (let row = 0; row < GAME_BOARD_SIZE; row++) {
            sum += gameboard[row][col];
        }

        if (Math.abs(sum) == 3) {
            state = sum;
        }

        sum = 0;
    }

    for (let i = 0; i < GAME_BOARD_SIZE; i++) {
        sumNegDiagonal += gameboard[i][GAME_BOARD_SIZE - i - 1];
        sumPosDiagonal += gameboard[i][i];

        if (Math.abs(sumPosDiagonal) == 3)
            state = sumPosDiagonal;
        else if (Math.abs(sumNegDiagonal) == 3)
            state = sumNegDiagonal;

        sum = 0;
    }

    return state / 3;
}

function updateGameBoardState(move) {
    const ROW_ID = 0;
    const COLUMN_ID = 1;
    let rowMove = move[ROW_ID] - 1;
    let colMove = move[COLUMN_ID] - 1;
    if (rowMove >= 0 && rowMove <= 2 && colMove >= 0 && colMove <= 2)
        gameboard[rowMove][colMove] = currentPlayer;
}


async function getGameMoveFromCurrentPlayer() {
    let position = null;
    do {
        let rawInput = await askQuestion("Place your mark at: ");
        position = rawInput.split(" ");
    } while (isValidPositionOnBoard(position) == false)

    return position
}

function isValidPositionOnBoard(position) {

    if (position.length < 2) {
        // We where not given two numbers or more.
        return false;
    }
    
    let inputWasCorrect;

    let isValidInput = true;
    if (position[0] * 1 != position[0] && position[1] * 1 != position[1]) {
        // Not Numbers
        inputWasCorrect = false;
    } else if (position[0] > GAME_BOARD_SIZE && position[1] > GAME_BOARD_SIZE) {
        // Not on board
        inputWasCorrect = false;
    }
    else if (Number.parseInt(position[0]) != position[0] && Number.parseInt(position[1]) != position[1]) {
        // Position taken.
        inputWasCorrect = false;
    } else if (gameboard[position[0]][position[1]] != 0) {
        inputWasCorrect = false;
    } 
    console.log(gameboard[position[0]][position[1]])

    return isValidInput;
}

function showHUD() {
    let playerDescription = language.PLAYER_ONE_DESCRIPTION;
    if (PLAYER_2 == currentPlayer) {
        playerDescription = language.PLAYER_TWO_DESCRIPTION;
    }
    print(language.PLAYER_TEXT + playerDescription + language.YOUR_TURN_TEXT);
}

function showGameBoardWithCurrentState() {
    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let rowOutput = "";
        for (let currentCol = 0; currentCol < GAME_BOARD_SIZE; currentCol++) {
            let cell = gameboard[currentRow][currentCol];
            if (cell == 0) {
                rowOutput += "_ ";
            }
            else if (cell > 0) {
                rowOutput += "X ";
            } else {
                rowOutput += "O ";
            }
        }

        print(rowOutput);
    }
}

function initializeGame() {
    gameboard = createGameBoard();
    currentPlayer = PLAYER_1;
}

function createGameBoard() {

    let newBoard = new Array(GAME_BOARD_SIZE);

    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let row = new Array(GAME_BOARD_SIZE);
        for (let currentColumn = 0; currentColumn < GAME_BOARD_SIZE; currentColumn++) {
            row[currentColumn] = 0;
        }
        newBoard[currentRow] = row;
    }

    return newBoard;

}

function clearScreen() {
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME, ANSI.RESET);
}


//#endregion

