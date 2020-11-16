/*----- constants -----*/

class card {
    constructor(name, suit, value) {
        this.name = name;
        this.suit = suit;
        this.value = value;
    }
}

class deck {
    constructor(suit, value){
        this.suit = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
        this.value = []
    }
}





/*----- app's state (variables) -----*/







/*----- cached element references -----*/







/*----- event listeners -----*/








/*----- functions -----*/




// shuffle/continue()
// deal()
// getPoints()
// splitHand()
// push() //this will be similar to split hand because you are carrying over data
// hit()
// checkWin()
// update$()
// bet() //this will work in conjunction with update$ because the total amount of money will be related to the bet amount/payout
// calcPayout()
// play()/initialize()