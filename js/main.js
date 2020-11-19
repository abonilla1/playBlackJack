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
    bet: 0,
    wallet: 100,
}

const player = {
    isWinner: false,
    blackjack: null,
}

const dealer = {
    isWinner: false,
}

/*----- app's state (variables) -----*/
let gameDeck, playerHand, dealerHand, playerPoints, dealerPoints


/*----- cached element references -----*/


const messageOutput = document.getElementById('message');
const wallet = document.getElementById('wallet');
const currentBet = document.getElementById('current-bet');
const newGameBtn = document.getElementById('newGame');
const doubleBtn = document.getElementById('dd');
const standBtn = document.getElementById('stand');
const hitBtn = document.getElementById('hit');
const pushBtn = document.getElementById('push');
const foldBtn = document.getElementById('fold');
const dealBtn = document.getElementById('deal');
const quitBtn = document.getElementById('quit');
const bet = document.getElementById('bet')
//const actionDiv = document.getElementById('action');

/*----- event listeners -----*/

newGameBtn.addEventListener('click', () =>{
    console.log('party');
    location.reload()  
})

doubleBtn.addEventListener('click', () => {
    console.log('extra party');
    //doubleDown();
    //renderStatus();
    //dealersTurn(dealersHand);
})   
       
standBtn.addEventListener('click', () => {     
    console.log('nerves of steel');
    //dealersTurn(dealersHand);

})      
hitBtn.addEventListener('click', () => {
    console.log('going for broke');
    playerHand = playerHand.concat(gameDeck.splice(0,1));
    //renderNextCard;
    //checkforwin => renderWin
})
pushBtn.addEventListener('click', () => {
    console.log('good luck');
    //push
})    
foldBtn.addEventListener('click', () => {
    console.log('-$$$$$');
    //return cards to deck, shuffle
    //update tablestatus if necessary
})
dealBtn.addEventListener('click', () => {
    console.log('feelin lucky?');
    //deal();
    //renderDeal();
    //checkBlackJack => render win if True
})
quitBtn.addEventListener('click', () => {
    console.log('better luck next time');
    window.open('','_parent','');
	window.close()
})    

bet.addEventListener('keyup', (e) => {
    if (e.keyCode == 13) {
        getbet();
        renderStatus();
    }
});

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
}  //creates initial deck of cards by creating an array of objects

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
    gameDeck = shuffle(newDeck);
    renderStatus();
    return gameDeck;
}

function getbet(){
    table.bet = Number(bet.value);
    table.wallet -= table.bet;
}


function renderStatus() {
    (table.bet == 0) ? messageOutput.innerHTML = 'Place your Bet' : messageOutput.innerHTML = 'Select Next Action';
    wallet.innerHTML = `${table.wallet}`;
    currentBet.innerHTML = `${table.bet}`;
    
    if(player.isWinner){

    }
}

function calcPayout() {
    if (player.isWinner) {
        if (player.hand.length === 2 && player.points === 21) {
            table.wallet += (table.bet * 1.5);
        }
        else {
            table.wallet += table.bet;
        }
    }
}


function deal(gameDeck) {
    playerHand = gameDeck.splice(0,2);
    dealerHand = gameDeck.splice(0,2);
    //renderDeal();
}
function renderDeal(){

}

function calcPoints(hand) {
    let points = 0;
    hand.forEach((element) => {
        points += element.value;
    })    
    if (hand.includes(element.rank === 'Ace' && points > 21) ){
        element['Ace'].value = 1;
    }
    return points;
}


function checkBlackJack(p) {
    playerPoints = calcPoints(p);
    if (playerPoints===21) {
        player.isWinner;
    }
    renderWin();
}



function doubleDown() {
    table.bet = table.bet * 2;
    table.wallet = table.wallet - table.bet;
}

function renderNextCard(){

}

function dealersTurn(d) {
    //render 2nd card face up at this time
    dealerPoints = calcPoints(d);
    while (dealerPoints < 17) {
        dealerHand.concat(gameDeck.splice(0,1));
        //render next card
        dealerPoints = calcPoints(d);
        if (dealerPoints > 21); {
            player.isWinner = true;
            dealer.isBust = true;
        }
        if (dealerPoints >= 17 && dealerPoints <= 21) {
            if (dealerPoints> playerPoints) {
                dealer.isWinner = true;
            }
            else if (dealerPoints === playerPoints){
                player.isWinner = false;
                dealer.isWinner = false;
            }
            else {
                player.isWinner = true;
                dealer.isWinner = false;
            }
        }
    };
    renderWin();
}

function renderWin(){
    if (player.isWinner) && (player.blackjack) {
        messageOutput.innerHTML = 'BlackJack!!';
        //lots of styling extras
        renderStatus();
    }
    if (player.isWinner) {
        messageOutput.innerHTML = 'YOU WON!!!!';
        //confetti drop
        //large overlay message saying You won
        renderStatus();
    }
    if (dealer.isWinner) {
        // large overlay message saying you lost
    }
    if (!(dealer.isWinner) && !(player.isWinner)) {
        renderStatus();
    }
}

gameDeck = play();
//~~~~~~~~~~~~~Stage 1 of Round~~~~~~~~~~~~~
// render player cards both face up and render 1 dealer card face up
// check for blackjack
    //if natural blackjack, player.isWinner = true, calcPayout
    // render status-box
    //render win
// if above conditions not met
// ~~~~~~~~~~~Stage 2 of Round~~~~~~~~~~~~

// ~~~~~~~~~~~~~~user actions~~~~~~~~~~~~~~
// user may double down, hit, or fold,
// if fold, ask if user wants next hand, if yes ==> next hand, else gameOver = true.
// if double down, current bet *=2 and wallet - bet*2 AND end 
// if hit, hit();
// 
// calc points 
// ~~~~~~~~ dealer actions~~~~~~~~~~
