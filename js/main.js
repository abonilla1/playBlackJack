/*----- constants -----*/
const suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts']
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']; 
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10 , 10, 10, 11]; 
//values and ranks are parallel arrays 

class card {
    constructor(suit, rank, value) {
        this.name = `${rank} of ${suit}`;
        this.value = value;
        this.suit = suit; 
        this.rank = rank;
    }
} //creates card class
/* At some point I want to create a deck constructor for cleaner syntax however will address that after getting basic syntax down */

const table = {
    bet: null,
    sidebet: null,
    wallet: 100,
    getbet() {
        this.bet = parseInt(document.getElementById('bet').value);
        this.wallet -= this.bet;
        if (this.sidebet != null) {
            this.sidebet = parseInt(document.getElementById('side-bet').value);
            this.wallet -= this.sidebet;
        }
    },
    calcPayout() {
        if (player.isWinner) {
            if (player.hand.length === 2 && player.points === 21) {
                this.wallet += (this.bet * 1.5);
            }
            else {
                this.wallet += this.bet;
            }
        } else {
            if (dealer.points === 21 && this.sidebet != null){
                this.wallet += this.sidebet;
            }
        }
    }
}

const player = {
    points: 0,
    hand: null,
    calcPoints() {
        this.hand.forEach((element) => {
            this.points += element.value;
                if (this.points > 21 && element.rank == 'Ace') {
                    element.value =1;
                }
        })
        return this.points;
    },
    isWinner: false
}    
    
const dealer = {
    points: 0,
    hand: null,
    calcPoints() {
        this.hand.forEach((element) => {
            this.points += element.value;
                if (this.points > 21 && element.rank == 'Ace') {
                    element.value =1;
                }
        })
        return this.points;
    },
    isWinner: false
}

/*----- app's state (variables) -----*/
let turn, gameDeck, gameStart, gameOver, stageOne, stageTwo

/*----- cached element references -----*/


let messageOutput = document.getElementById('message');
let playerCash = document.getElementById('cash');
let cashBalance = document.getElementById('cash-balance');


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

// function render() {
//     wallet.inn
    
// }


function play() {    
    let newDeck = createDeck();
    gameDeck = shuffle(newDeck);
    turn = 1;
    // render();
    return gameDeck;
}


function deal() {
    player.hand = gameDeck.splice(0,2);
    dealer.hand = gameDeck.splice(0,2);
}

function hit () {
    player.hand = player.hand.concat(gameDeck.splice(0,1));
}

function checkWin () {

}
function splitHand() {

}

function playNewGame () {
        //ability to carry over wallet data 
}


play();
deal();
console.log(player.hand)
player.calcPoints()
console.log(player.points)






// push() //this will a condition, should not be a function

