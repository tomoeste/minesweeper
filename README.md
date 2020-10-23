# Minesweeper

### Description:

- The goal of the game is to uncover all the non-bomb cells and avoid the bomb cells. When all non-bomb cells are opened. The user wins the game
- Each cell can contain a number which represents the number of bombs adjacent to the cell with the maximum number being 8.

### Features:

- The Player is prompted to input the number of **rows**, **columns** and **number of bombs.** Once the game has started, the Player can select the Settings icon to change these values and start a new game.
- When the board is generated users can perform the following actions:
  - Left-Click on Cell:
    - If Cell has a bomb, all bombs on the board will be revealed and user **loses** the game
    - If Cell doesn\'t have a bomb, the cell will open up if it\'s a number. If it\'s an empty cell then it will reveal nearby cells until it\'s reaches a number or the edge of the board.
  - Right-Click on Cell
    - Right-Click on a Cell will plant a flag on the cell, it doesn\'t really do anything other than reminding the player where a suspected bomb might be.
    - Users can only place as many flags as there are bombs
  - Left-Click on Happy Face
    - Resets the game
- **Bonus:**
  - The first click will never reveal a mine.

### Tools:

- Built with React and TypeScript using [create-react-app](https://github.com/facebook/create-react-app).
- Settings form and validation use Formik and Yup.
- Testing with React Testing Library, Jest, and redux-mock-store.
