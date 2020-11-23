/*-------------------------------------------------- constants ------------------------------------------*/
const suits = ['spades', 'clubs', 'diamonds', 'hearts']
const ranks = ['r02', 'r03', 'r04', 'r05', 'r06', 'r07', 'r08', 'r09', 'r10', 'J', 'Q', 'K', 'A']; 
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10 , 10, 10, 11]; 
//values and ranks are parallel arrays 

class Card {
    constructor(suit, rank, value) {
        this.name = `${suit} ${rank}`;
        this.value = value;
        this.suit = suit; 
        this.rank = rank;
    }
} //creates card class, Ace is generated with a value of 11 
    
const table = {
    bet: '',
    wallet: 100,
}
//table object for user interface related to betting and game updates

class Player {
    constructor() {
    this.isWinner = null;
    this.blackjack = null;
    this.bust = null;
    this.tie = null;
    }
}

// player prototype object holding booleans that control state of the game

class Dealer {
    constructor() {
    this.isWinner = null;
    this.bust =null;
    }
}
// dealer prototype object also holding state of game variables. Different combinations of dealer and player booleans will trigger different win/loss scenarios

/*-------------------------------------------------- app's state (variables) ------------------------*/
let gameDeck, playerHand, dealerHand, playerPoints, dealerPoints, push
//push was originally a button but the logic is very similar to starting a new hand so it is now
//a Boolean 

/*--------------------------------------- cached element references ---------------------------------*/


const messageOutput = document.getElementById('message');
const wallet = document.getElementById('wallet');
const field = document.getElementById('playing-field')
const currentBet = document.getElementById('current-bet');
const playerField= document.getElementById('player-side');
const dealerField= document.getElementById('dealer-side');
const newGameBtn = document.getElementById('newGame');
const nextBtn= document.getElementById('next-hand');
const doubleBtn = document.getElementById('dd');
const standBtn = document.getElementById('stand');
const hitBtn = document.getElementById('hit');
const foldBtn = document.getElementById('fold');
const dealBtn = document.getElementById('deal');
const quitBtn = document.getElementById('quit');
const bet = document.getElementById('bet');

/*---------------------------------- event listeners ---------------------------------*/

newGameBtn.addEventListener('click', () =>{
    console.log('party');
    location.reload() 
    table.bet =''; 
})  
//Resets the browser window and initial variables

doubleBtn.addEventListener('click', () => {
    console.log('extra party');
    doubleDown();
    dealersTurn(dealerHand, playerHand, gameDeck);
    checkForDealerWin(dealerPoints, playerPoints);      
})  
//player doubles their bet, receives one additional card and then dealers turn begins 
       
standBtn.addEventListener('click', () => {     
    console.log('nerves of steel');
    dealersTurn(dealerHand, playerHand, gameDeck);
    checkForDealerWin(dealerPoints, playerPoints);      
})
//player takes no more actions, dealers turn begins

hitBtn.addEventListener('click', () => {
    console.log('going for broke');
    doubleBtn.disabled = true;
    dealBtn.disabled = true;
    playerHand = playerHand.concat(gameDeck.splice(0,1));
    renderhit(playerHand);
    playerPoints = calcPoints(playerHand)
    checkBust();
    checkBlackJack(playerHand);
})
// player receives one card, 'bust' state is checked for, double down disabled after first hit
/* future upgrade: blackjack state checked for and win generated */

foldBtn.addEventListener('click', () => {
    messageOutput.innerHTML = 'Click Next Hand to Try Again';
    playerField.innerHTML = '';
    dealerField.innerHTML= '';
    dealBtn.disabled = true;
    hitBtn.disabled = true;
    doubleBtn.disabled = true;
})
// player takes no more actions, board is reset

dealBtn.addEventListener('click', () => {
    console.log('feelin lucky?');
    gameVariables = play();
    gameDeck = gameVariables[0];
    dealer = gameVariables[1];
    player = gameVariables[2];
    deal(gameDeck);
    renderCards(playerHand, dealerHand);
    checkBlackJack(playerHand); 
    doubleBtn.disabled = false;
    hitBtn.disabled = false;
    dealBtn.disabled = true;
    
})
//deal is only available at the start of the game, AFTER betting. Two card objects each to dealerHand and playerHand which become arrays of objects

nextBtn.addEventListener('click', () => {
    if (table.wallet === 0){
        renderEndGame();
    }   
    else if (table.wallet < 0 ){
        console.log('Here come the loan sharks XO ')
        renderEndGame();
    }
    else {
        confetti.stop();
        playerHand = [];
        dealerHand = [];
        push = false;
        hitBtn.disabled = true;
        playerField.innerHTML = '';
        dealerField.innerHTML= '';
        currentBet.innerHTML = '0';
        table.bet = '';
        renderTable();
    }       
})
//This button does the majority of the work for this game. It resets all the values, including state variables. It generates and shuffles a new card deck and calls the renderTable() function to prompt the user to bet and begin a new hand.

quitBtn.addEventListener('click', () => {
    console.log('better luck next time');
    window.open('','_parent','');
	window.close()
})    
//force closes window and ends the game. --Attribution!!!---This syntax obtained from StackOverflow!!---

bet.addEventListener('keyup', (e) => {
    if (e.keyCode == 13) {
       getBet(); 
       renderTable();
       bet.value= 0;
       bet.innerHTML='';
    }    
});
//listens for user to enter a bet and submit it. Calls renderTable() to check for appropriate bet value, resets the inner values of the fields AFTER getting the bet


/*--------------------------------------- FUNCTIONS -------------------------------------------*/
/*------------------------------------Creation Functions---------------------------------------*/

function createDeck() {
    deck = [];
    for(let i =0; i < suits.length; i++){
        for(let j=0; j <ranks.length; j++){
            newCard = new Card(suits[i], ranks[j], values[j]);
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
// ----ATTRIBUTION!!!----I DID NOT COME UP WITH FISHER-YATES SHUFFLE-- syntax obtained from frankmitchell.org 

function play() {    
    let newDeck = createDeck();
    gameDeck = shuffle(newDeck);
    let d = new Dealer;
    let p = new Player;
    return [gameDeck, d, p];
}

/*------------------------------------Calculation Functions---------------------------------*/

function calcPayout() { 
    if (player.blackjack) {
        table.wallet += (table.bet * 3 / 2);
        renderWallet();
    }
    else if (player.isWinner && dealer.bust) {
        table.wallet += (table.bet * 3 / 2);
        renderWallet();
    }
    else if (player.isWinner) {
        table.wallet += (table.bet*2);
        renderWallet();
    }
    else if (player.tie) {
        table.wallet += table.bet
        renderWallet();
    }
    else {
        table.bet='';
    }
}
//This function uses object state properties to calculate the appropriate payout.

function checkForAce(hand) {
    hand.forEach((element)=> {
        if (element.rank === 'A'){
            element.value = 1;
        }
    })
    return hand
}
// Helper function to handle Round Aces. Since it mutates the Ace Card object, an entirely new deck is created at the beginning of each next hand

function calcPoints(hand) {
    let points = 0;
    hand.forEach((element) => {
        points += parseInt(element.value);
    })
    if (points > 21) {
        let adjustedHand = checkForAce(hand)
        points = 0;
        adjustedHand.forEach((element) => {
            points += parseInt(element.value);
        }) 
    }   
    return points    
}

function checkBlackJack(playerHand) {
    playerPoints = calcPoints(playerHand);
    if (playerPoints === 21) {
        player.blackjack = true;
        player.isWinner = true;
        dealer.isWinner = false;
        renderWallet();
        renderEndRound();
    }  
}
function checkBust() {
    if (playerPoints > 21) {
        player.bust = true;
        player.isWinner = false;
        renderEndRound();
    }
    else if (dealerPoints > 21){
        dealer.bust = true;
        dealer.isWinner = false;
        player.isWinner = true;
        renderEndRound();
    }
    else {
        console.log('No Bust!')
    }
}

/*-------------------------------------Rendering Functions-----------------------------------*/

function renderTable() {
    if (table.bet === 0 || table.bet === ''){
        messageOutput.innerText = 'Place your Bet'
        dealBtn.disabled = true;
        hitBtn.disabled = true;
        doubleBtn.disabled = true;
    } 
    else if (table.bet <10 || table.bet > 75){
        messageOutput.innerText = 'Table Minimum of 10 and Maximum of 75';
        dealBtn.disabled = true;
    }    
    else {
        dealBtn.disabled = false;
        messageOutput.innerText = `Select next action`
        updateWallet();
        renderWallet();
    }    
} //The render table function holds state of game information, prompts the user to bet and disables/enables buttons accordingly

function updateWallet(){
    table.bet = Number(bet.value);
    table.wallet -= table.bet;
}

function renderWallet() {
    wallet.innerHTML = `${table.wallet}`;
    currentBet.innerHTML = `${table.bet}`;
}

function renderCards(playerHand, dealerHand){
    playerHand.forEach((element) => {
        let newCard = document.createElement('div')
        let className1 = `card large ${element.name}`;
        newCard.className = className1;
        playerField.appendChild(newCard); 
    })
    let newCard2 = document.createElement('div');
    let cardToRender2 = dealerHand[0];
    let className2 = `card large ${cardToRender2.name}`
    newCard2.className = className2
    dealerField.appendChild(newCard2);
    let newCard3 = document.createElement('div');
    let className3 = `card large back-blue`;
    newCard3.className = className3;
    dealerField.appendChild(newCard3);
} //dealer cards were originally handled with a for each loop but since the second of the dealer's cards needed to be handled separately this function 

function renderhit(playerHand) {
    let newCard3 = document.createElement('div');
    let length = playerHand.length;
    let cardToRender = playerHand[length-1];
    let className3 = `card large ${cardToRender.name}`;
    newCard3.className = className3;
    playerField.appendChild(newCard3);
}
//render dealerhit and player hit are separate functions from deal because we are handling one card at a time.

function renderDHit(dealerHand) {
    let newCard4 = document.createElement('div');
    let length2 = dealerHand.length;
    let cardToRender2 = dealerHand[length2-1];
    let className4 = `card large ${cardToRender2.name}`
    newCard4.className = className4
    console.log(newCard4)
    dealerField.appendChild(newCard4);
}

function renderEndRound(){
    if((player.blackjack) && (playerHand.length ==2)){
        calcPayout();
        messageOutput.innerHTML = 'BlackJack!! Click Next Hand to Continue';
        confetti.start(5000);
        dealBtn.disabled = true;
        hitBtn.disabled = true;
    }
    else if((player.isWinner) && (playerHand.length === 5)) {
        calcPayout();
        messageOutput.innerHTML = '!!!5 Card Charlie!!! Click Next Hand to Continue';
        dealBtn.disabled = true;
        hitBtn.disabled = true;
        confetti.start(5000);
    } 
    else if(player.isWinner) {
        calcPayout();
        messageOutput.innerHTML = 'You Won!! Click Next Hand to Continue';
        dealBtn.disabled = true;
        hitBtn.disabled = true;
    } 
    else if(dealer.bust) {
        calcPayout();
        messageOutput.innerHTML = 'You Won!!! Click Next Hand to Continue';
        dealBtn.disabled = true;
        hitBtn.disabled = true;
    } 
    else if(player.bust) {
        messageOutput.innerHTML = 'BUST!!! Click Next Hand to Continue, Quit to Quit';
        calcPayout();
        dealBtn.disabled = true;
        hitBtn.disabled = true;
    }
    else if(dealer.isWinner) {
        messageOutput.innerHTML = 'You LOST!! Click Next Hand to Continue';
        dealBtn.disabled = true;
        hitBtn.disabled = true;
    }
    else if (player.tie) {
        push = true;
        handlePush();
    }
}

function handlePush(){
    messageOutput.innerHTML = 'Tie hand, Click Next Hand button to deal again';
    dealBtn.disabled = true;
    hitBtn.disabled = true;
}

function renderEndGame() {
    if (Number(table.wallet) === 0) {
        messageOutput.innerHTML = 'No more Money! Come back again'
        dealBtn.disabled = true;
        nextBtn.disabled = true;
    }
}

/*----------------------------------------Action Functions-------------------------------------------*/


function getBet() {
   table.bet = Number(bet.value);
}

function deal(gameDeck) {
    playerHand = gameDeck.splice(0,2);
    dealerHand = gameDeck.splice(0,2);
}

function doubleDown() {
    table.wallet = table.wallet - table.bet;
    table.bet += table.bet;
    renderWallet();
    playerHand = playerHand.concat(gameDeck.splice(0,1));
    renderhit(playerHand);
    playerPoints = calcPoints(playerHand)
    checkBust(playerPoints)
    hitBtn.disabled = true;
}

function checkForDealerWin(dealerPoints, playerPoints){
    if (dealerPoints > playerPoints){
        dealer.isWinner = true;
        player.isWinner = false;
        renderEndRound();
    }
    else if (dealerPoints === playerPoints){
        player.tie = true;
        player.isWinner = false;
        dealer.isWinner = false;
        renderEndRound();
    }  
    else {
        player.isWinner = true;
        dealer.iswinner = false;
        renderEndRound(); 
    } 
}       

function dealersTurn(dealerHand, gameDeck) {
    dealerField.lastElementChild.remove(); //removes the card back from dealer's deal
    renderDHit(dealerHand) //re-renders the dealers second card
    dealerPoints = parseInt(calcPoints(dealerHand));
    while (dealerPoints < 17) {
        dealerHand = dealerHand.concat(gameDeck.splice(0,1));
        console.log(dealerHand);
        renderDHit(dealerHand);
        dealerPoints = calcPoints(dealerHand); 
    }
    checkBust();      
}

gameVariables = play();
renderTable();

