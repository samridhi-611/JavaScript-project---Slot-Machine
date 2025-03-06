// STEPS OR THE FLOW OF THE PROJECT

//1. deposit the money user want to bet with
//2. determine no. of line user wishes to bet on
//3. collect that amount
//4. spin the machine
//5. check for win or loose
//6. give the reward or collect the charges
//7. play again

// This function is used to take inputs from the user
const prompt = require("prompt-sync")();      // --> another set of paranthesis for calling the function for the input

const ROWS = 3;
const COLS = 3;

const SYM_COUNT = {
    7: 2,
    TREE: 4,
    STAR: 6,
    JOKER: 8
}

const SYM_VALUE = {
    7: 10,
    TREE: 5,
    STAR: 3,
    JOKER: 2
}

//STEP 1 :

const deposit = () => {

    while (true) {
        const deposit_amt = prompt("Enter the Amount to be deposited : "); // default for rompt is a string type------ to be converted to int type

        // for interge type
        const numeric_DA = parseFloat(deposit_amt);
        //ABOUT ParseFloat
        //1. convert string value to numeric type
        //2. "11.77" --> 11.7
        //3.if "sam" --> NaN (not a number)

        if (isNaN(numeric_DA) || numeric_DA <= 0) {
            console.log("Invalid data entry , try again")
        }
        else {
            return numeric_DA;
        }
    }
};

//STEP 2:

const line_count = () => {

    while (true) {
        const no_of_lines = prompt("Enter the Number of lines you want to bet on(1-3) : "); // default for prompt is a string type------ to be converted to int type

        const lines = parseFloat(no_of_lines);

        if (isNaN(no_of_lines) || no_of_lines <= 0 || no_of_lines > 3) {
            console.log("Invalid data entry , try again")
        }
        else {
            return no_of_lines;
        }
    }
};

//STEP 3:

const BET = (balance, lines) => {                             // BET() has 2 args as the value is for 1 row and it should bw within th balance amt 

    while (true) {
        const bet_amt = prompt("Enter the Bet Amount per line: "); // default for prompt is a string type------ to be converted to int type

        const bet_check = parseFloat(bet_amt);

        if (isNaN(bet_check) || bet_check <= 0 || bet_check > balance / lines) {
            console.log("Invalid data entry , try again")
        }
        else {
            return bet_check;
        }
    }
};

//STEP 4:

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYM_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [[], [], []];
    for (let i = 0; i < COLS; i++) {
        const reel_symbol = [...symbols];    // [...symbols]--> it wolud copy all the elements in th aray to the new array 
        // this reel is used to keep a track of used symbols as it should not exceed the given values
        for (let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reel_symbol.length);       // random give value btw 0 and 1 also math.floor is used as the index is within th length of array
            const selected_sym = reel_symbol[randomIndex];
            reels[i].push(selected_sym);
            reel_symbol.splice(randomIndex,1);          // remove the value from the array so it is not chosen again'
        }
    }
    return reels;
}

const transpose =(SPINS) =>{
    const rows = [];
    for(let i =0;i<ROWS ;i++){
        rows.push([]);
        for(let j =0;j<COLS;j++){
            rows[i].push(SPINS[j][i])
        }
    }
    return rows
}


const printMachine = (rows) =>{
    for(const row of rows){
        let rowString = "";
        for (const[i,symbol]of row.entries()){
            rowString += symbol
            if(i != row.length -1){
                rowString += ' | '
            }
        }
        console.log(rowString)
    }
}

//STEP 5: 

const getWinning =(SPINS,beting_amt,lines) =>{
    let winning =0;

    for(let row =0;row<lines;row++){
        const symbols =SPINS[row];
        let allSame = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if(allSame){
            winning += beting_amt * SYM_VALUE[symbols[0]]
        }
    }
    return winning;
}

const game = () => {
    let balance = deposit(); // Deposit only once at the beginning
    console.log("AMOUNT DEPOSITED IS: ", balance);

    while (true) {
        console.log("Your balance left is: ", balance);

        const Lines_to_bet_on = line_count();
        console.log("NO OF LINES CHOSEN ARE: ", Lines_to_bet_on);

        let lines = Lines_to_bet_on;

        const beting_amt = BET(balance, lines);
        console.log("AMOUNT FOR BETTING: ", beting_amt * lines);

        balance -= beting_amt * lines; // Deduct bet amount

        const SPINS = spin();
        const transposed = transpose(SPINS);
        printMachine(transposed);

        const winn = getWinning(transposed, beting_amt, Lines_to_bet_on);
        balance += winn; // Add winnings to balance
        console.log("YOU WIN , $" + winn.toString());
        console.log("UPDATED BALANCE AFTER THIS ROUND: " + balance); // Show updated balance

        if (balance <= 0) {
            console.log("You are out of money..! Game Over!");
            break;
        }

        const playAgain = prompt("DO YOU WANT TO PLAY AGAIN (y/n)? ");
        if (playAgain.toLowerCase() !== "y") {
            console.log("Thanks for playing! Your final balance is: $" + balance);
            break;
        }
    }
};

game();
