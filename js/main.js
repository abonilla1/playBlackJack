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
}

const dealer = {
    isWinner: false,
}

/*----- app's state (variables) -----*/
let gameDeck, gameOver, playerHand, dealerHand, playerPoints, dealerPoints, Bust


/*----- cached element references -----*/


const messageOutput = document.getElementById('message');
const wallet = document.getElementById('wallet');
const currentBet = document.getElementById('current-bet');
const newGameBtn = document.getElementById('newGame');
const doubleBtn = document.getElementById('dd');
const standBtn = document.getElementById('stand');
const hitBtn = document.getElementById('hit');
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
    //handle dealers actions
    //Checkwin
})   
       
standBtn.addEventListener('click', () => {     
    console.log('nerves of steel');
    //handle dealers actions
    //checkWin

})      
hitBtn.addEventListener('click', () => {
    console.log('going for broke');
    //hit();
    //renderHit();
    //checkforwin
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
})
quitBtn.addEventListener('click', () => {
    console.log('better luck next time');
    window.open('','_parent','');
	window.close()
})    

bet.addEventListener('keyup', () => {
    if (keyCode === 13) 
    getbet();
    renderStatus();
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
 


    // all conditional rendering, all rendering decisions will be based on previous functions and results
    // i.e. take classes away from stuff, show hide stuff
    // append cards to div
    // all update messages should be here
    // call other functions from here if it starts getting unweildy  
}
function renderWin(){

}

function renderDeal(){

}

function renderHit(){

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
    renderDeal();
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

function hit () {
    playerHand = playerHand.concat(gameDeck.splice(0,1));
    renderHit();
}

function checkBlackJack(p) {
    playerPoints = calcPoints(p);
    if (playerPoints===21) {
        player.isWinner;
    }
    renderWin();
}

function dealersTurn(d) {

}
// function checkWin (player, dealer) {
//     playerPoints = calcPoints(player);
//     dealerPoints = calcPoints(dealer);
//     if (playerPoints > dealerPoints && playerPoints < 21) {
//         player.isWinner = 'True';
//     if( playerPoints === dealerPoints)
//         player.isWinner = 'False' && dealer.isWinner = 'False'
    


function doubleDown() {
    table.bet = table.bet * 2;
    table.wallet = table.wallet - table.bet;
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
