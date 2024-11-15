import React, { FC } from "react";

interface AboutProps {
}

const About: FC<AboutProps> = (props) => {
  return (
    <div>
      <h1>What is Schulte Project?</h1>
      <div>
        {`This website includes a game. The game is a schulte table. 
        Schulte Table is a cognitive test invened by German Psycotherapist Walter Schulte.
        Schulte Table is played simply by clicking numbers on the table in order starting from 1 to 16.
        This website is for playing this game and chilling.
        This wesite includes multiple game modes, grid sizes and directions.
        Change these settings at the Game Settings Panel.
        You can change grid size to adjust the number of tiles on the table to your liking.
        You can change the game mode to play different versions of the classic game. 
        Additional gamemodes include Reaction mode which hides every tile other than the one that's supposed to be clicked and
        Memory mode which shows you all the tiles for a short period of time to let you memorize where the tiles are and then hides the tiles.
        You can change Direction to change the order the numbers are supposed to be clicked. 
        The default direction is starting from 1 and going upwards like 1 -> 2 -> 3 ... and it can be changed to start from the highest number and go downward like 16 -> 15 -> 14 ...
        You can see your Personal Best Record and the Record of the game you've last played.
        You can change the page theme to Light or Dark theme with Change Theme Button at Screen Controls Buttons if you prefer different themes.
        You can also hide the Settings and Statistics panels with Hide Panels Button at Screen Controls Buttons if you don't want any distractions while you're playing the game.
        Have fun playing and relaxing!

        This project is an open source project and is free to use. The source code can be viewed on GitHub by clicking See Source Code Button.
        To learn more about me and see the other projects I make, visit my personal website by clicking Visit My Website Button.`}
      </div>
    </div>
  )
}


export default About;
