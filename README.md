# The Kingdom's Railway Network

## Description

**The Kingdom's Railway Network** is a JavaScript-based puzzle game where players assist Trickles, the royal advisor, in designing a circular railway that traverses every accessible part of Seeknotland. The objective is to create a continuous looped railway line on a square grid map, adhering to specific terrain constraints and rules.

## Features

- **Main Menu:**
  - Player name input.
  - Difficulty selection: Easy (5x5 grid) or Hard (7x7 grid).
  - Access to game instructions.
  - Leaderboard displaying fastest completion times.

- **Gameplay:**
  - Square grid map with various terrain tiles:
    - **Empty Tiles:** Railway can continue in any direction.
    - **Bridges:** Railway can only be built straight as defined by the bridge.
    - **Mountains:** Railway can only turn 90° due to rocks blocking two adjacent exits.
    - **Oases:** Railway cannot be built on these tiles.
  - Placement of railway elements with user-friendly controls.
  - Timer tracking the duration of gameplay.
  - Validation of the railway loop to ensure all rules are followed.

- **End Game:**
  - Display of completion time upon successfully forming a valid railway loop.
  - Leaderboard showcasing the fastest players for each difficulty level.

## Technologies Used

- **HTML & CSS:** Structure and styling of the game interface.
- **JavaScript:** Game logic and interactivity.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/muhammademanaftab/Railways-Puzzle-Game.git
   ```
2. **Open the Game:**
   - Navigate to the project directory.
   - Open `index.html` in your preferred web browser.

## Usage

1. **Launch the Game:**
   - Open `index.html` in a web browser.

2. **Main Menu:**
   - Enter your name.
   - Select the desired difficulty level.
   - Click "Start" to begin the game.

3. **Gameplay:**
   - Place railway elements on the grid by clicking on the cells.
   - Ensure the railway forms a continuous loop adhering to terrain constraints.
   - Use available controls to rotate or delete railway pieces as needed.

4. **Completion:**
   - Once a valid railway loop is formed and all tiles are filled, the game will display your completion time.
   - Your time will be recorded in the leaderboard if it's among the fastest.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.


## Contact

For questions or issues, feel free to contact:

- **Name:** Muhammad Aftab
- **GitHub:** [muhammademanaftab](https://github.com/muhammademanaftab)
- **Email:** emanaftab2022@gmail.com

---

Thank you for exploring **The Kingdom's Railway Network**! Your feedback is appreciated.
