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
    bet: 0,
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
const startBtn = document.getElementById('start');
const quitBtn = document.getElementById('quit');
const bet = document.getElementById('bet');

/*---------------------------------- event listeners ---------------------------------*/

newGameBtn.addEventListener('click', () =>{
    console.log('party');
    location.reload() 
    bet.innerText=''; 
})

doubleBtn.addEventListener('click', () => {
    console.log('extra party');
    doubleDown();
    dealersTurn(dealerHand, playerHand, gameDeck);
    renderStatus();
    
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
    gameDeck = shuffle(fold(playerHand, dealerHand, gameDeck));
    table.bet = 0;
    bet.style.display='0';
    deal(gameDeck);
})    

foldBtn.addEventListener('click', () => {
    console.log('-$$$$$');
    table.bet = 0;
    bet.style.display='';
    renderStatus();
    messageOutput.innerHTML = 'Click Next Hand to Try Again';
})

startBtn.addEventListener('click', () => {
    console.log('feelin lucky?');
    deal(gameDeck);
    renderCards(playerHand, dealerHand);
    checkBlackJack(playerHand); 
})

nextBtn.addEventListener('click', () => {
    currentBet.style.display = 0;
    table.bet = 0;
    gameDeck = shuffle(fold(playerHand, dealerHand, gameDeck));
    deal(gameDeck);
    renderCards(playerHand, dealerHand);
    checkBlackJack(playerHand);
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
        table.wallet += (table.bet * 1.5);
    }
    else {
        table.wallet += table.bet;
    }
}

function calcPoints(hand) {
    let points = 0;
    hand.forEach(function (element) {
        points += parseInt(element.value);
        if (hand.includes(hand.rank === 'A' && points > 21)) {
            hand['A'].value = 1;
        }
     })    
    return points;
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
    if (table.bet == 0) {
        messageOutput.innerHTML = `Place your Bet`;
    }     
    else if (table.bet < 10 || table.bet >75) {
        messageOutput.innerHTML = `Minimum bet of $10 and Maximum of $75!`
    }
    else {
        messageOutput.innerText = `Select next action`
        renderWallet();
    }    
}

function renderWallet() {
    table.bet = Number(bet.value);
    table.wallet -= table.bet;
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
    dealerHand.forEach((element) => {
        let newCard2 = document.createElement('div');
        let className2 = `card large ${element.name}`;
        newCard2.className = className2
        dealerField.appendChild(newCard2)
    })  
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
    dealerField.appendChild(newCard4);
}

function renderEndRound(){
    if(player.blackjack){
        calcPayout();
        renderWallet();
        messageOutput.innerHTML = 'BlackJack!!';
        bet.innerText=''; 
    }
    if(player.isWinner) {
        calcPayout();
        renderWallet();
        messageOutput.innerHTML = 'You Won!!';
    } 
    if(player.bust) {
        messageOutput.innerHTML = 'BUST!!!';
        bet.innerText='0';
    }
    if(dealer.isWinner) {
        messageOutput.innerHTML = 'You LOST!!';
        bet.innerText=''; 
    }
    if (player.tie) {
        messageOutput.innerHTML = 'Tie hand, click Push button to deal again';
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

function fold(playerHand, dealerHand, gameDeck){
    playerHand.forEach((element) => {
        gameDeck.push(element);
    })
    dealerHand.forEach((element) => {
        gameDeck.push(element);
    })
    playerField.innerHTML = '';
    dealerField.innerHTML= '';
    return gameDeck;
}

function doubleDown() {
    table.bet = table.bet * 2;
    table.wallet = table.wallet - table.bet;
}

function dealersTurn(dealerHand, playerHand, gameDeck) {
    //render 2nd card face up at this time
    dealerPoints = parseInt(calcPoints(dealerHand));
    playerPoints = parseInt(calcPoints(playerHand));
    if (dealerPoints > playerPoints && dealerPoints >=17){
        dealer.isWinner = true;
        renderEndRound();
    }
    while (dealerPoints <= 16) {
        dealerHand = dealerHand.concat(gameDeck.splice(0,1));
        console.log(dealerHand);
        renderDHit(dealerHand);
        dealerPoints += calcPoints(dealerHand);   
        if (dealerPoints > 21) {
            player.isWinner = true;
            dealer.bust = true;
            renderEndRound(); 
        }
        else if (dealerPoints >= 17 && dealerPoints <= 21) {
            if (dealerPoints > playerPoints) {
                dealer.isWinner = true;
                renderEndRound(); 
            }
            else if (dealerPoints === playerPoints){
                player.tie = true;
                renderEndRound(); 
            }
            else {
                player.isWinner = true;
                renderEndRound(); 
            }
        }
            
    renderEndRound(); 
    }
}    

gameDeck = play();
renderTable();

