# playBlackJack
This project renders a working blackjack game in the browser using html5, css and Javascript technologies.

This is the initial WireFrame mock up for game design
![playBlackJack - Window](https://user-images.githubusercontent.com/73343168/99282705-a85ded80-27f9-11eb-9987-3017387679bb.png)



This is the initial pseudocode for blackjack:
Pseudocode for BlackJack

~~~~~~~~~~~~~~~Player story~~~~~~~~~~~~~
As a player I:
Should be able to start and reset the game 
Should be updated on game state (is it my turn? What is my total amt won/lost, how many points do I have? How many points does the dealer have? Have I won or lost the game?)
Should be able to place a bet, hit and stand
Should be able to track my wins/losses

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Pseudocode


1. Define constants 
    1.   Deck of Cards with 52 values //(complete 11/17/20)
    2.   player class, from which instances of player can be defined //(complete 11/17/20)
    3.   Const board with bet amounts, action buttons and initial state //(complete 11/17/20)
    4.   Const Dealer object with null points //(complete 11/17/20)

2.  Game initializes with null dealer and player point values
    1. Initialize function calls render function
    2. Player indicates intention to start game (Deal function)
        1. Cards shuffle and player prompted to bet
        2. Player places bet 
        3. Two cards are dealt face up to player and two cards (one up and one down) to dealer (deal function)
            1. Update total point amount for player and seen point amount for dealer (update function)
                1. IFF dealer’s seen point amount is 10 or 11, player can place insurance side bet.
                2. Otherwise continue play.
            2. Handle natural blackjack situation (automatic win)
                1. Update total $$ amount for player
3. After initial 2 cards IF no insurance bet placed
    1. Flip dealers second card
        1. Update dealers point total
    2. Player can hit/stand or split (max of 1 split function)
        1. If hit and point amount greater than 21 = bust!
            1. Allow additional hits until bust or stand
        2. If stand
            1. Dealer must deal to self until 17 or greater is reached
            2. After each card is dealt update and compare dealer and player point totals and check for winner
                1. When winner is reached update total $$ amount for player
        3. If split
            1. May split only once 
            2. Player now has two hands
                1. Play continues as normal with comparison between both hands
            3. Update total amounts once conclusion reached
4. Update Message with Win/Lose message at end of hand. 
5. Shuffle function will continue to next hand (keeping current player $$ amounts), OR new game function will reset/re-initialize game



~~~~~~~~~~~~~~~~~~~Features~~~~~~~~~~~~~~~~~~~
Event listeners EVERYWHERE to listen for player input (clicks) and to respond appropriately.
Sound effects for card shuffle/deal, player win
Game needs to appropriately track, Card values and point totals, bet amounts and pay outs, turn information (player input for hit/stand but also if dealer has not yet reached 17 must continue to deal AND upon reaching 17 or greater may not deal again.)  win/loss criteria. 

~~~~~~~~~~~~~~~~~Functions~~~~~~~~~~~~~~~~~~~~~
shuffle/continue()
deal()
getPoints()
splitHand()
push() //this will be similar to split hand because you are carrying over data
hit()
checkWin()
update$()
bet() //this will work in conjunction with update$ because the total amount of money will be related to the bet amount/payout
calcPayout()
play()/initialize()
