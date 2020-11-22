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
let gameDeck, playerHand, dealerHand, playerPoints, dealerPoints


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
const pushBtn = document.getElementById('push');
const foldBtn = document.getElementById('fold');
const dealBtn = document.getElementById('deal');
const quitBtn = document.getElementById('quit');
const bet = document.getElementById('bet');

/*---------------------------------- event listeners ---------------------------------*/

newGameBtn.addEventListener('click', () =>{
    console.log('party');
    location.reload() 
    bet.value = 0; 
})

doubleBtn.addEventListener('click', () => {
    console.log('extra party');
    doubleDown();
    dealersTurn(dealerHand, playerHand, gameDeck);
    renderTable(); 
})   
       
standBtn.addEventListener('click', () => {     
    console.log('nerves of steel');
    dealersTurn(dealerHand, playerHand, gameDeck);
})

hitBtn.addEventListener('click', () => {
    console.log('going for broke');
    playerHand = playerHand.concat(gameDeck.splice(0,1));
    renderhit(playerHand);
    checkBlackJack(playerHand)
    playerPoints = calcPoints(playerHand)
    if (playerPoints > 21) {
        player.bust = true;
        renderEndRound(); 
    }
})
pushBtn.addEventListener('click', () => {
    console.log('good luck');
    playerField.innerHTML='';
    dealerField.innerHTML='';
    messageOutput.innerText = `Select Deal for new cards`
})    

foldBtn.addEventListener('click', () => {
    messageOutput.innerHTML = 'Click Next Hand to Try Again';
    playerField.innerHTML = '';
    dealerField.innerHTML= '';
})

dealBtn.addEventListener('click', () => {
    console.log('feelin lucky?');
    gameDeck = play();
    deal(gameDeck);
    renderCards(playerHand, dealerHand);
    checkBlackJack(playerHand); 
})

nextBtn.addEventListener('click', () => {
    playerHand = [];
    dealerHand = [];
    playerField.innerHTML = '';
    dealerField.innerHTML= '';
    bet.value= 0;
    bet.innerHTML=0;
    gameDeck = play();
    currentBet.innerHTML = '0';
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
        table.wallet += (table.bet * 1.5 + table.bet);
        renderWallet();
    }
    else if (player.isWinner && dealer.bust) {
        table.wallet += (table.bet * 1.5 + table.bet);
        renderWallet();
    }
    else if (player.isWinner) {
        table.wallet += (table.bet + table.bet);
        renderWallet();
    }
    else if (player.tie) {
        table.wallet += table.bet
        renderWallet();
    }
    else {
        currentBet.innerHTML = '0';
        table.bet=0;
        renderWallet();
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

/*-------------------------------------Rendering Functions-----------------------------------*/

function renderTable() {
    if (table.bet == 0 || table.bet == '0'){
        messageOutput.innerText = 'Place your Bet'
    }     
    else if (table.bet < 10 || table.bet >75) {
        messageOutput.innerText = `Minimum bet of $10 and Maximum of $75!`
    }
    else {
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
        messageOutput.innerHTML = 'BlackJack!!';
        bet.value= 0;
        bet.innerHTML=0;
    }
    if(player.isWinner) {
        calcPayout();
        messageOutput.innerHTML = 'You Won!!';
        bet.value= 0;
        bet.innerHTML=0;
    } 
    if(player.bust) {
        messageOutput.innerHTML = 'BUST!!!';
        bet.value= 0;
        bet.innerHTML=0;
        calcPayout();
    }
    if(dealer.isWinner) {
        messageOutput.innerHTML = 'You LOST!!';
        bet.value= 0;
        bet.innerHTML=0;
        calcPayout();
    }
    if (player.tie) {
        calcPayout();
        messageOutput.innerHTML = 'Tie hand, click Push button to deal again';
        bet.value= 0;
        bet.innerHTML=0;
    }
}

function renderEndGame() {
    if (Number(table.wallet) === 0) {
        messageOutput.innerHTML = 'No more Money! Come back again'
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
    table.bet = table.bet * 2;
    table.wallet = table.wallet - table.bet;
}

function checkForDealerWin(dealerPoints, playerPoints){
    if (dealerPoints > 21) {
        player.isWinner = true;
        dealer.bust = true;
        renderEndRound(); 
    }
    else if (dealerPoints > playerPoints && dealerPoints >=17){
        dealer.isWinner = true;
        renderEndRound();
    }
    else if (dealerPoints === 21 && dealerPoints > playerPoints) {
        dealer.isWinner = true;
        renderEndRound(); 
    }
    else if (dealerPoints === 20 && dealerPoints > playerPoints) {
        dealer.isWinner = true;
        renderEndRound(); 
    }       
    else if (dealerPoints === 19 && dealerPoints > playerPoints){
        dealer.isWinner = true;
        renderEndRound(); 
    }    
    else if (dealerPoints === 18 && dealerPoints > playerPoints){
        dealer.isWinner = true;
        renderEndRound(); 
    }    
    else if (dealerPoints === 17 && dealerPoints > playerPoints){
        dealer.isWinner = true;
        renderEndRound(); 
    }
    else if (dealerPoints === 17 && dealerPoints === playerPoints){
        player.tie = true;
        renderEndRound();
    }    
    else {
        player.isWinner = true;
        renderEndRound(); 
    } 
}       

function dealersTurn(dealerHand, playerHand, gameDeck) {
    dealerField.lastElementChild.remove();
    renderDHit(dealerHand)
    dealerPoints = parseInt(calcPoints(dealerHand));
    playerPoints = parseInt(calcPoints(playerHand));
    while (dealerPoints < 17) {
        dealerHand = dealerHand.concat(gameDeck.splice(0,1));
        console.log(dealerHand);
        renderDHit(dealerHand);
        dealerPoints = calcPoints(dealerHand); 
    }
    checkForDealerWin(dealerPoints, playerPoints);       
}

gameDeck = play();
renderTable();

