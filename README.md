# playBlackJack
This project renders a working blackjack game in the browser using html5, CSS and Javascript technologies.

## Game Features:
    * Game Logic similar to casino play.
    * 52 Card Deck.
    * Soft/Round Aces- Ace value is either 1 or 11 depending on the other cards in the hand.
      * This logic also applies to the dealer.
    * Rendering of status updates to the user for easy transitioning between actions.
    * Button Controlled User Interface allowing for:    
      * Multiple user actions per turn
      * Ability to carry over funds from hand to hand

## Rules:
    * The game will start on window load with an HTML message to place a bet in the input field.
      * The bet will be checked against the table Minimum and Maximum values and a message will be issued if the bet is out of range.
    * Once the bet has been placed press enter and follow message prompt to receive initial hand of two cards.
      * The dealer will also receive two cards with the second card face down as per standard play.
    * The user can now choose to double down, stand, hit or fold.
      * The user can hit as many times as desired unless they exceed 21 points.
    * After the user stands, the dealer's turn will begin and their second card will be flipped.
      * The dealer follows strict casino rules, hitting until reaching at least 17 points or busting.
    * If neither user nor dealer busts, the points will be compared at the end of the hand and a winner declared
    * Upon winning, User payouts are calculated thusly:
      * 3:2 for Natural BlackJack 
      * 3:2 if dealer busts
      * 1:1 all other wins
    * After the round is complete, Next Hand will carry over Cash values for another round whereas New Game will refresh the entire page and Quit will close the window. 
    * If the player reaches 0 in Current Cash, the game is over

## Planning 

### This is the initial WireFrame mock up for game design

![playBlackJack - Window](https://user-images.githubusercontent.com/73343168/99282705-a85ded80-27f9-11eb-9987-3017387679bb.png)

This is the inital User/Player Story

~~~~~~~~~~~~~~~Player story~~~~~~~~~~~~~
As a player I:
Should be able to start and reset the game 
Should be updated on game state (is it my turn? What is my total amt won/lost, Have I won or lost the game?)
Should be able to place a bet, hit and stand
Should be able to track my wins/losses
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The initial game design was intended to look like a casino table but proved difficult to implement. Moreover, It decreased overall functionality by having strict bet amounts and less cohesion of user actions.

### This is the second WireFrame mock up for game design
![playBlackJack- Window](https://user-images.githubusercontent.com/73343168/99894690-e751d000-2c4b-11eb-863e-a9f87cdf2948.png)

This layout allowed for cleaner design and easier and broader implementation of user actions. 
The majority of content was created using Javascript technologies with heavy use of EventListeners and Functions. Game logic was primarily rendered using multiple helper functions to handle updating point and cash amounts as well as the all important comparisions for winning and losing. 


### Future upgrades/IceBox

The game was originally intended to include functionality for splitting a hand and insurance betting. These will instead be added in future upgrades. Also expect an increase in conditional rendering for ease of game play. 
-[x] Build BlackJack
-[] Add conditional rendering upgrades
-[] Add Insurance betting
-[] Add ability to split a hand
-[] Add ability to split multiple hands
