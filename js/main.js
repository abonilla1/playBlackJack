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
    calcPayout() {

    },
    updateCashFlow() {
    
    },
    trackBets() {

    }
}

function calcPoints (rival) {
    let points = 0;
    rival.hand.forEach((element) => {
        points += element.value;
            if (points > 21 && element.rank == 'Ace') {
                element.value =1;
            }
    })
    return points;
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
    }
}    
    
//move the cash/bet/payout/wallet all to table object to handle


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
    }
}

/*----- app's state (variables) -----*/
let isWinner, turn, gameDeck, gameStart, gameOver

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

// function render() {
//     table.calcPayout
//     table.updateCashFlow
//     table.trackBets

// }

function play() {    
    let newDeck = createDeck();
    gameDeck = shuffle(newDeck);
    isWinner = null;
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



// function calcPoints (rival) {
//     let points = 0;
//     rival.hand.forEach((element) => {
//         points += element.value;
//             if (points > 21 && element.rank == 'Ace') {
//                 element.value =1;
//             }
//     })
//     return points;
// }



play();
deal();
console.log(player.hand)
player.calcPoints()
console.log(player.points)





//continue()
// splitHand()
// push() //this will a condition, should not be a function
// checkWin()
// update$()
// bet() //this will work in conjunction with update$ because the total amount of money will be related to the bet amount/payout
