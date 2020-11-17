/*----- constants -----*/
const suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts']
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']; 
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10 , 10, 10, 11]; 
//values and ranks are parallel arrays 

const Dealer = {
    name: Dealer,
    points: null
}

const table = {
    trackBet() {

    },
    calcPayout() {

    },
    updateCashFlow() {
    
    }
}

class card {
    constructor(suit, rank, value) {
        this.name = `${rank} of ${suit}`;
        this.value = value;
        this.suit = suit 
    }
} //creates card class
/* At some point I want to create a deck constructor for cleaner syntax however will address that after getting basic syntax down */

class player {
    constructor(name, points) {
        this.name = name;
        this.cash = 250;
        this.points = null;
    }
    bet(x) {

    }
}
//new players start with $250

/*----- app's state (variables) -----*/
let isWinner, turn 

/*----- cached element references -----*/


// let messageOutput = document.getElementById('message');
// let playerCash = document.getElementById('cash');
// let cashBalance = document.getElementById('cash-balance');


/*----- event listeners -----*/

// body.addEventListener('click')




/*----- functions -----*/
function createDeck() {
    deck = [];
    for(let i =0; i < suits.length; i++){
        for(let j=0; j <ranks.length; j++){
            newCard = new card(suits[i], ranks[j], values[j]);
            deck.push(newCard);
        }
    }
    return deck;
}  //creates initial deck of cards
//need to find a way to make ace also equal to 1//

function shuffle(deck) {       //will shuffle using Fisher-Yates method 
    let m = deck.length, temp, idx;
    while (m) {
      idx = Math.floor(Math.random() * m--);
      temp = deck[m];
      deck[m] = deck[idx];
      deck[idx] = temp;
    }
    return deck;
}                                      

function play() {    
    let newDeck = createDeck();
    let gameDeck = shuffle(newDeck);
    let playername = getName();
    let player1 = player.constructor(playername);
    isWinner = null;
    turn = 1;
    render();
}

function render () {

}

play();

//continue()
// deal()
// getPoints()
// splitHand()
// push() //this will be similar to split hand because you are carrying over data
// hit()
// checkWin()
// update$()
// bet() //this will work in conjunction with update$ because the total amount of money will be related to the bet amount/payout
