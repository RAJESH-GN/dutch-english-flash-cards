# Dutch Flashcards Application

A static web application for learning Dutch vocabulary with two modes: Learn Mode (flashcards) and Quiz Mode (multiple choice).

## File Structure

### HTML Pages

- `index.html` - Main landing page with mode selection
- `learn.html` - Flashcard learning interface
- `quiz.html` - Quiz interface with multiple choice questions

### JavaScript Modules

- `shared.js` - Shared functionality (vocabulary data, speech synthesis, utilities)
- `learn.js` - Learning mode specific functionality
- `quiz.js` - Quiz mode specific functionality

### Other Files

- `styles.css` - All styling for the application
- `data.json` - Vocabulary data (external JSON file)

## Features

### Learn Mode

- Interactive flashcards with Dutch/English vocabulary
- Pronunciation using Web Speech API
- Category-based learning (Home, Family, Food, etc.)
- Bidirectional learning (Dutch→English or English→Dutch)
- Example sentences with audio
- Progress tracking and shuffle functionality
- Keyboard shortcuts for navigation

### Quiz Mode

- Multiple choice questions with selectable direction:
  - **English to Dutch** (default): See English word, choose Dutch translation
  - **Dutch to English**: See Dutch word, choose English translation
- Category-based quizzes including "All Words" option
- All words in selected category are asked (randomized order)
- Immediate feedback (correct/incorrect)
- Score tracking and results page
- Keyboard shortcuts for quick selection

## Usage

This is a static web application - simply open `index.html` in a web browser or serve the files through any web server.

### Navigation

- Start at `index.html` to choose between Learn and Quiz modes
- Each mode is a separate page with its own functionality
- Back buttons and main menu links allow easy navigation between pages

### Keyboard Shortcuts

#### Learn Mode

- Arrow keys: Navigate cards
- P: Pronounce Dutch word
- T: Toggle learning direction
- E: Toggle example sentences
- 1: Mark as incorrect
- 2: Mark as correct
- Space: Flip card
- Escape: Back to categories
- /: Focus search

#### Quiz Mode

- 1, 2, 3: Select quiz options
- Enter/Space: Next question
- Escape: Back to categories

## Development

The application is built with vanilla HTML, CSS, and JavaScript. No build process or external dependencies are required.

### Data Format

Vocabulary data is stored in `data.json` with embedded fallback data in `shared.js`. Each word entry includes:

- Dutch and English translations
- Word type (noun, verb, etc.)
- Difficulty level
- Example sentences with translations

### Browser Compatibility

- Modern browsers with ES6+ support
- Web Speech API for pronunciation (optional feature)
- Local storage not required - fully stateless
