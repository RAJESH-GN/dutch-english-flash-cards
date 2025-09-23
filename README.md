# Dutch Flashcards

A configurable flashcard application for learning Dutch vocabulary with pronunciation support.

## Features

- 🎯 **Category-based learning**: Organized vocabulary by topics (greetings, family, verbs, etc.)
- 🔄 **Bidirectional learning**: Dutch-to-English and English-to-Dutch modes
- 🔊 **Pronunciation**: Built-in Dutch pronunciation using Web Speech API
- 📝 **Example sentences**: Contextual examples for better learning
- 📊 **Progress tracking**: Track your learning progress
- 🎨 **Modern UI**: Clean, responsive design

## 🆕 Configurable Data Sources

The vocabulary data is now **externally configurable**! You can easily:

### 1. Edit Vocabulary Data

- Open `vocabulary-data.json` to modify, add, or remove words
- The structure is preserved from the original embedded data
- Changes are reflected immediately when you reload the page

### 2. Use Different Datasets

- Modify `config.json` to point to different vocabulary files
- Create new JSON files following the same structure for other languages
- Switch between datasets by updating the `dataSource` field

### 3. Data Structure

Each vocabulary entry follows this format:

```json
{
  "dutch": "hallo",
  "english": "hello",
  "type": "greeting",
  "difficulty": "beginner",
  "examples": [
    {
      "dutch": "Hallo, hoe gaat het met je?",
      "english": "Hello, how are you doing?"
    }
  ]
}
```

## Running the Application

**Important**: Due to browser security restrictions, you need to run this from a web server, not by opening the HTML file directly.

### Option 1: Python Server (Recommended)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then visit: `http://localhost:8000`

### Option 2: Node.js Server

```bash
npx http-server
```

### Option 3: VS Code Live Server

- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

## Keyboard Shortcuts

- **Arrow keys**: Navigate between cards
- **P**: Pronounce Dutch word
- **T**: Toggle learning direction
- **E**: Toggle example sentences
- **1**: Mark as incorrect
- **2**: Mark as correct
- **Escape**: Back to categories
- **/**: Focus search (on category page)

## Customization

### Adding New Categories

1. Add vocabulary entries to `vocabulary-data.json` with a new category name
2. Update the `categoryInfo` object in `script.js` to include display information for the new category
3. Add a corresponding category card in `index.html`

### Creating New Language Datasets

1. Create a new JSON file (e.g., `vocabulary-german.json`)
2. Follow the same structure as `vocabulary-data.json`
3. Update `config.json` to point to the new file
4. Optionally update language flags and names in the config

## File Structure

```
Flash-cards-dutch/
├── index.html              # Main application
├── script.js               # Application logic
├── styles.css              # Styling
├── vocabulary-data.json    # 🆕 Vocabulary dataset
├── config.json            # 🆕 Configuration
└── README.md              # This file
```

## Browser Compatibility

- ✅ Chrome/Chromium (recommended for pronunciation)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

Note: Pronunciation feature works best in Chrome/Chromium browsers.
