/*-------------------------------------------------- constants ------------------------------------------*/
const suits = ['spades', 'clubs', 'diamonds', 'hearts']
const ranks = ['r02', 'r03', 'r04', 'r05', 'r06', 'r07', 'r08', 'r09', 'r10', 'J', 'Q', 'K', 'A']; 
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10 , 10, 10, 11]; 
//values and ranks are parallel arrays 

class card {
    constructor(suit, rank, value) {
        this.name = `card.${suit}.${rank}`;
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
const dealBtn = document.getElementById('deal');
const quitBtn = document.getElementById('quit');
const bet = document.getElementById('bet');

/*---------------------------------- event listeners ---------------------------------*/

newGameBtn.addEventListener('click', () =>{
    console.log('party');
    location.reload()  
})

doubleBtn.addEventListener('click', () => {
    console.log('extra party');
    doubleDown();
    renderStatus();
    dealersTurn(dealerHand);
})   
       
standBtn.addEventListener('click', () => {     
    console.log('nerves of steel');
    dealersTurn(dealerHand);
})

hitBtn.addEventListener('click', () => {
    console.log('going for broke');
    playerHand = playerHand.concat(gameDeck.splice(0,1));
    renderhit(playerHand);
    checkBlackJack(playerHand)
    playerPoints = calcPoints(playerHand)
    if (playerPoints > 21) {
        player.bust = true;
        renderStatus(); 
    }
    renderStatus(); 
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
    bet.style.display='0';
    renderStatus();
    messageOutput.innerHTML = 'Click Next Hand to Try Again';
})

dealBtn.addEventListener('click', () => {
    console.log('feelin lucky?');
    deal(gameDeck);
    renderCards(playerHand, dealerHand);
    checkBlackJack(playerHand); 
})

nextBtn.addEventListener('click', () => {
    currentBet.style.display = '0';
    table.bet = 0;
    renderStatus();
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
        getbet();
        renderStatus();
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
    if (playerPoints===21) {
        player.blackjack = true;
        renderStatus();
    }  
}

/*-------------------------------------Rendering Functions-----------------------------------*/

function renderStatus() {
    (table.bet == 0) ? messageOutput.innerHTML = 'Place your Bet' : messageOutput.innerHTML = 'Select Next Action';
    wallet.innerHTML = `${table.wallet}`;
    currentBet.innerHTML = `${table.bet}`;
    if(player.blackjack){
        calcPayout();
        wallet.innerHTML = `${table.wallet}`;
        currentBet.innerHTML = `${table.bet}`;
        messageOutput.innerHTML = 'BlackJack!!';
    }
    if(player.isWinner) {
        calcPayout();
        wallet.innerHTML = `${table.wallet}`;
        currentBet.innerHTML = `${table.bet}`;
        messageOutput.innerHTML = 'You Won!!';
    } 
    if(player.bust) {
        messageOutput.innerHTML = 'BUST!!!';
    }
    if(dealer.isWinner) {
        messageOutput.innerHTML = 'You LOST!!';
    }
    if (player.tie) {
        messageOutput.innerHTML = 'Tie hand, click Push button to deal again';
        wallet.innerHTML = `${table.wallet} + ${table.bet}`;
        currentBet.innerHTML = `0`;
    }
}

function renderCards(playerHand, dealerHand){
    playerHand.forEach((element) => {
        let newCard = document.createElement('div')
        newCard.innerHTML = `${element.name}`
        newCard.className= element.name;
        playerField.appendChild(newCard);
        
    })
    dealerHand.forEach((element) => {
        let newCard2 = document.createElement('div');
        newCard2.innerHTML = `${element.name}`;
        newCard2.className = element.name;
        dealerField.appendChild(newCard2)
    })  
}

function renderhit(playerHand) {
    let newCard3 = document.createElement('div');
    let nextCardName = playerHand.slice(2);
    newCard3.innerHTML = nextCardName;
    newCard3.className = nextCardName.name;
    playerField.appendChild(newCard3);
}

function renderDHit(dealerHand) {
    let newCard4 = document.createElement('div'.card);
    let nextCardName = dealerHand.slice(2);
    newCard4.innerHTML = nextCardName;
    newCard4.className = nextCardName.name;
    dealerField.appendChild(newCard4);
}

// function renderEndHand(){

// }

/*----------------------------------------Action Functions-------------------------------------------*/

function play() {    
    let newDeck = createDeck();
    gameDeck = shuffle(newDeck);
    return gameDeck;
}

function getbet(){
    table.bet = Number(bet.value);
    table.wallet -= table.bet;
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

function dealersTurn(dealerHand) {
    //render 2nd card face up at this time
    dealerPoints = calcPoints(dealerHand);
    playerPoints = calcPoints(playerHand);
    while (dealerPoints <= 16) {
        dealerHand.concat(gameDeck.splice(0,1));
        renderDHit(dealerHand);
        dealerPoints = calcPoints(dealerHand);
    }    
    if (dealerPoints > 21); {
        player.isWinner = true;
        dealer.bust = true;
        renderStatus();
    }
    if (dealerPoints >= 17 && dealerPoints <= 21) {
        if (dealerPoints > playerPoints) {
            dealer.isWinner = true;
            renderStatus();
        }
        else if (dealerPoints === playerPoints){
            player.tie = true;
            renderStatus();
        }
        else {
            player.isWinner = true;
            renderStatus();
        }
    }
    if (dealerPoints > playerPoints){
        dealer.isWinner = true;
    }
    renderStatus(); 
}

gameDeck = play();
renderStatus();
