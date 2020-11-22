/*-------------------------------------------------- constants ------------------------------------------*/
const suits = ['spades', 'clubs', 'diamonds', 'hearts']
const ranks = ['r02', 'r03', 'r04', 'r05', 'r06', 'r07', 'r08', 'r09', 'r10', 'J', 'Q', 'K', 'A']; 
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10 , 10, 10, 11]; 
//values and ranks are parallel arrays 


class card {
    constructor(suit, rank, value) {
        this.name = `${suit} ${rank}`;
        this.value = value;
        this.suit = suit; 
        this.rank = rank;
    }
} //creates card class
/* At some point I want to create a deck constructor for cleaner syntax however will address that after getting basic syntax down */   
    
const table = {
    bet: '',
    wallet: 100,
}

const player = {
    isWinner: null,
    blackjack: null,
    tie: false,
    bust: false,
}

const dealer = {
    isWinner: null,
    bust: false,
}

/*-------------------------------------------------- app's state (variables) ------------------------*/
let gameDeck, playerHand, dealerHand, playerPoints, dealerPoints, push


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

doubleBtn.addEventListener('click', () => {
    console.log('extra party');
    doubleDown();
    dealersTurn(dealerHand, playerHand, gameDeck);
    checkForDealerWin(dealerPoints, playerPoints);      
})   
       
standBtn.addEventListener('click', () => {     
    console.log('nerves of steel');
    dealersTurn(dealerHand, playerHand, gameDeck);
    checkForDealerWin(dealerPoints, playerPoints);      
})

hitBtn.addEventListener('click', () => {
    console.log('going for broke');
    doubleBtn.disabled = true;
    playerHand = playerHand.concat(gameDeck.splice(0,1));
    renderhit(playerHand);
    playerPoints = calcPoints(playerHand)
    checkBust();
})

foldBtn.addEventListener('click', () => {
    messageOutput.innerHTML = 'Click Next Hand to Try Again';
    playerField.innerHTML = '';
    dealerField.innerHTML= '';
    dealBtn.disabled = true;
    hitBtn.disabled = true;
    doubleBtn.disabled = true;
})

dealBtn.addEventListener('click', () => {
    console.log('feelin lucky?');
    gameDeck = play();
    deal(gameDeck);
    renderCards(playerHand, dealerHand);
    checkBlackJack(playerHand); 
    doubleBtn.disabled = false;
    hitBtn.disabled = false;
})

nextBtn.addEventListener('click', () => {
    if (table.wallet == 0 || table.wallet < 0){
        renderEndGame();
    }    
    confetti.stop();
    playerHand = [];
    dealerHand = [];
    push = false;
    player.bust = false;
    player.blackjack = null;
    dealer.bust = false;
    hitBtn.disabled = true;
    playerField.innerHTML = '';
    dealerField.innerHTML= '';
    currentBet.innerHTML = '0';
    table.bet = '';
    gameDeck = play();
    renderTable();   
})

quitBtn.addEventListener('click', () => {
    console.log('better luck next time');
    window.open('','_parent','');
	window.close()
})    

bet.addEventListener('keyup', (e) => {
    if (e.keyCode == 13) {
       getBet(); 
       renderTable();
       bet.value= 0;
       bet.innerHTML='';
    }    
});


/*--------------------------------------- FUNCTIONS -------------------------------------------*/
/*------------------------------------Creation Functions---------------------------------------*/

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

function checkForAce(hand) {
    hand.forEach((element)=> {
        if (element.rank === 'A'){
            element.value = 1;
        }
    })
    return hand
}

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
        renderWallet();
        renderEndRound();
    }  
}
function checkBust() {
    if (playerPoints > 21) {
        player.bust = true;
        renderEndRound();
    }
    else if (dealerPoints > 21){
        dealer.bust = true;
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
}

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
}

function renderhit(playerHand) {
    let newCard3 = document.createElement('div');
    let length = playerHand.length;
    let cardToRender = playerHand[length-1];
    let className3 = `card large ${cardToRender.name}`;
    newCard3.className = className3;
    playerField.appendChild(newCard3);
}

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
    if(player.blackjack){
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

function play() {    
    let newDeck = createDeck();
    gameDeck = shuffle(newDeck);
    return gameDeck;
}

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
        renderEndRound();
    }
    else if (dealerPoints === playerPoints){
        player.tie = true;
        player.isWinner = false;
        renderEndRound();
    }  
    else {
        player.isWinner = true;
        renderEndRound(); 
    } 
}       

function dealersTurn(dealerHand, gameDeck) {
    dealerField.lastElementChild.remove();
    renderDHit(dealerHand)
    dealerPoints = parseInt(calcPoints(dealerHand));
    // playerPoints = parseInt(calcPoints(playerHand));
    while (dealerPoints < 17) {
        dealerHand = dealerHand.concat(gameDeck.splice(0,1));
        console.log(dealerHand);
        renderDHit(dealerHand);
        dealerPoints = calcPoints(dealerHand); 
    }
    checkBust();
    // checkForDealerWin(dealerPoints, playerPoints);       
}

gameDeck = play();
renderTable();

