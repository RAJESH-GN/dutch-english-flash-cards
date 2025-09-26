// Shared functionality for Dutch Flashcards Application

class VocabularyData {
    constructor() {
        this.vocabularyData = {};
        this.isDataLoaded = false;
        
        this.categoryInfo = {
            all: { name: "All Words", icon: "🌟" },
            home: { name: "Home & Rooms", icon: "🏠" },
            family: { name: "Family & People", icon: "👨‍👩‍👧‍👦" },
            food: { name: "Food & Drink", icon: "🍞" },
            transport: { name: "Transport", icon: "🚗" },
            places: { name: "Places in Town", icon: "🏪" },
            time: { name: "Time & Days", icon: "📅" },
            weather: { name: "Weather & Seasons", icon: "☀️" },
            clothing: { name: "Clothing", icon: "👕" },
            verbs: { name: "Useful Verbs", icon: "🏃‍♂️" },
            numbers: { name: "Numbers", icon: "🔢" }
        };
    }

    async loadVocabularyData() {
        try {
            // Try to load from external JSON file first
            const response = await fetch('./data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.vocabularyData = await response.json();
            this.isDataLoaded = true;
            console.log('✅ Loaded vocabulary from data.json');
            return true;
        } catch (error) {
            console.warn('Could not load external JSON, using embedded data:', error.message);
            // Fallback to embedded data
            this.loadEmbeddedData();
            return true;
        }
    }

    loadEmbeddedData() {
        // Fallback embedded vocabulary data - same as original
        this.vocabularyData = this.getEmbeddedVocabularyData();
        this.isDataLoaded = true;
        console.log('✅ Using embedded vocabulary data (fallback mode)');
    }

    getEmbeddedVocabularyData() {
        return {
            "home": [
              {
                "dutch": "huis",
                "english": "house",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het huis is groot.",
                    "english": "The house is big."
                  },
                  {
                    "dutch": "Het huis staat in Amsterdam.",
                    "english": "The house is in Amsterdam."
                  },
                  {
                    "dutch": "Wij wonen in een klein huis.",
                    "english": "We live in a small house."
                  }
                ]
              },
              {
                "dutch": "kamer",
                "english": "room",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn kamer is klein.",
                    "english": "My room is small."
                  },
                  {
                    "dutch": "De kamer heeft een groot raam.",
                    "english": "The room has a big window."
                  },
                  {
                    "dutch": "Ik slaap in mijn kamer.",
                    "english": "I sleep in my room."
                  }
                ]
              }
            ],
            "family": [
              {
                "dutch": "vader",
                "english": "father",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn vader is leraar.",
                    "english": "My father is a teacher."
                  }
                ]
              }
            ],
            "food": [
              {
                "dutch": "brood",
                "english": "bread",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik eet brood met boter.",
                    "english": "I eat bread with butter."
                  }
                ]
              }
            ],
            "transport": [
              {
                "dutch": "auto",
                "english": "car",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De auto is rood.",
                    "english": "The car is red."
                  }
                ]
              }
            ],
            "places": [
              {
                "dutch": "winkel",
                "english": "shop",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De winkel is open.",
                    "english": "The shop is open."
                  }
                ]
              }
            ],
            "time": [
              {
                "dutch": "dag",
                "english": "day",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Vandaag is een mooie dag.",
                    "english": "Today is a beautiful day."
                  }
                ]
              }
            ],
            "weather": [
              {
                "dutch": "zon",
                "english": "sun",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De zon schijnt.",
                    "english": "The sun is shining."
                  }
                ]
              }
            ],
            "clothing": [
              {
                "dutch": "shirt",
                "english": "shirt",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn shirt is blauw.",
                    "english": "My shirt is blue."
                  }
                ]
              }
            ],
            "verbs": [
              {
                "dutch": "lopen",
                "english": "to walk",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik loop naar school.",
                    "english": "I walk to school."
                  }
                ]
              }
            ]
          }
    }

    updateCategoryCounts() {
        // Update individual category counts
        Object.keys(this.vocabularyData).forEach(category => {
            const countElement = document.getElementById(`count-${category}`);
            if (countElement) {
                const count = this.vocabularyData[category].length;
                countElement.textContent = `${count} word${count !== 1 ? 's' : ''}`;
            }
        });

        // Update total count for "all" category
        const allCountElement = document.getElementById('count-all');
        if (allCountElement) {
            const totalCount = Object.values(this.vocabularyData).flat().length;
            allCountElement.textContent = `${totalCount} word${totalCount !== 1 ? 's' : ''}`;
        }
    }

    getCategoryWords(category) {
        if (category === 'all') {
            return Object.values(this.vocabularyData).flat();
        } else {
            return [...(this.vocabularyData[category] || [])];
        }
    }
}

// Speech synthesis functionality
class SpeechManager {
    constructor() {
        this.synth = null;
        this.dutchVoice = null;
        this.initializeSpeech();
    }

    initializeSpeech() {
        if ('speechSynthesis' in window) {
            this.synth = window.speechSynthesis;
            
            // Wait for voices to load
            const loadVoices = () => {
                const voices = this.synth.getVoices();
                // Try to find a Dutch voice, fallback to default
                this.dutchVoice = voices.find(voice => 
                    voice.lang.startsWith('nl') || voice.lang.startsWith('nl-')
                ) || voices[0];
            };

            // Load voices immediately if available
            loadVoices();
            
            // Also listen for voice changes (some browsers load voices async)
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
    }

    pronounceDutchWord(dutchWord) {
        if (!this.synth || !dutchWord) {
            console.warn('Speech synthesis not available or no word provided');
            return;
        }

        // Cancel any ongoing speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(dutchWord);
        
        // Set Dutch language and voice if available
        utterance.lang = 'nl-NL';
        if (this.dutchVoice) {
            utterance.voice = this.dutchVoice;
        }
        
        // Speech settings
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;

        this.synth.speak(utterance);
    }
}

// Utility functions
const Utils = {
    shuffleArray: function(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    showLoadingError: function(error) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'loading-error';
        errorMessage.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Loading Error</h3>
                <p>Failed to load vocabulary data: ${error.message}</p>
                <button class="retry-btn" onclick="location.reload()">
                    <i class="fas fa-redo"></i>
                    Retry
                </button>
            </div>
        `;
        document.body.appendChild(errorMessage);
        document.body.classList.add('loading');
    },

    removeLoadingState: function() {
        document.body.classList.remove('loading');
    }
};

// Global instances
window.vocabularyData = new VocabularyData();
window.speechManager = new SpeechManager();
