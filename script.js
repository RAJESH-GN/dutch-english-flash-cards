// Dutch Flashcards Application with Categories
class DutchFlashcards {
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
            verbs: { name: "Useful Verbs", icon: "🏃‍♂️" }
        };

        this.currentCategory = null;
        this.currentVocabulary = [];
        this.currentIndex = 0;
        this.isFlipped = false;
        this.correctCount = 0;
        this.totalAttempts = 0;
        this.isLearningMode = false;
        this.learningDirection = 'dutch-to-english'; // 'dutch-to-english' or 'english-to-dutch'

        this.initializeElements();
        this.bindEvents();
        this.initializeSpeech();
        this.loadVocabularyData();
    }

    initializeElements() {
        // Category selection elements
        this.elements = {
            categorySelection: document.getElementById('categorySelection'),
            learningInterface: document.getElementById('learningInterface'),
            backToCategoriesBtn: document.getElementById('backToCategoriesBtn'),
            currentCategoryName: document.getElementById('currentCategoryName'),
            currentCategoryIcon: document.getElementById('currentCategoryIcon'),
            directionIndicator: document.getElementById('directionIndicator'),
            directionText: document.getElementById('directionText'),
            directionToggle: document.getElementById('directionToggle'),
            
            // Search elements
            categorySearch: document.getElementById('categorySearch'),
            clearSearch: document.getElementById('clearSearch'),
            searchResultsCount: document.getElementById('searchResultsCount'),
            resultCount: document.getElementById('resultCount'),
            
            // Examples elements
            examplesToggle: document.getElementById('examplesToggle'),
            examplesPanel: document.getElementById('examplesPanel'),
            examplesContent: document.getElementById('examplesContent'),
            closeExamples: document.getElementById('closeExamples'),
            learningContent: document.querySelector('.learning-content'),
            
            // Flashcard elements
            flashcard: document.getElementById('flashcard'),
            dutchWord: document.getElementById('dutchWord'),
            englishWord: document.getElementById('englishWord'),
            wordType: document.getElementById('wordType'),
            difficulty: document.getElementById('difficulty'),
            pronounceBtn: document.getElementById('pronounceBtn'),
            
            // Control elements
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            shuffleBtn: document.getElementById('shuffleBtn'),
            correctBtn: document.getElementById('correctBtn'),
            incorrectBtn: document.getElementById('incorrectBtn'),
            answerButtons: document.getElementById('answerButtons'),
            
            // Stats elements
            currentCard: document.getElementById('currentCard'),
            totalCards: document.getElementById('totalCards'),
            progressFill: document.getElementById('progressFill')
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
            this.updateCategoryCounts();
            this.showLoadingComplete();
            console.log('✅ Loaded vocabulary from vocabulary-data.json');
        } catch (error) {
            console.warn('Could not load external JSON, using embedded data:', error.message);
            // Fallback to embedded data
            this.loadEmbeddedData();
        }
    }

    loadEmbeddedData() {
        // Fallback embedded vocabulary data - same as original
        this.vocabularyData = this.getEmbeddedVocabularyData();
        this.isDataLoaded = true;
        this.updateCategoryCounts();
        this.showLoadingComplete();
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
              },
              {
                "dutch": "keuken",
                "english": "kitchen",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De keuken is schoon.",
                    "english": "The kitchen is clean."
                  },
                  {
                    "dutch": "De keuken heeft een oven.",
                    "english": "The kitchen has an oven."
                  },
                  {
                    "dutch": "Wij koken in de keuken.",
                    "english": "We cook in the kitchen."
                  }
                ]
              },
              {
                "dutch": "badkamer",
                "english": "bathroom",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De badkamer heeft een douche.",
                    "english": "The bathroom has a shower."
                  },
                  {
                    "dutch": "De badkamer is beneden.",
                    "english": "The bathroom is downstairs."
                  },
                  {
                    "dutch": "Ik poets mijn tanden in de badkamer.",
                    "english": "I brush my teeth in the bathroom."
                  }
                ]
              },
              {
                "dutch": "deur",
                "english": "door",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De deur is open.",
                    "english": "The door is open."
                  },
                  {
                    "dutch": "Ik doe de deur dicht.",
                    "english": "I close the door."
                  },
                  {
                    "dutch": "De deur is rood.",
                    "english": "The door is red."
                  }
                ]
              },
              {
                "dutch": "raam",
                "english": "window",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het raam is dicht.",
                    "english": "The window is closed."
                  },
                  {
                    "dutch": "Het raam is kapot.",
                    "english": "The window is broken."
                  },
                  {
                    "dutch": "Ik kijk door het raam.",
                    "english": "I look through the window."
                  }
                ]
              },
                 {
                   "dutch": "tafel",
                   "english": "table",
                   "type": "noun",
                   "difficulty": "beginner",
                   "examples": [
                     {
                       "dutch": "De tafel staat in de woonkamer.",
                       "english": "The table is in the living room."
                     },
                     {
                       "dutch": "Er staan borden op de tafel.",
                       "english": "There are plates on the table."
                     },
                     {
                       "dutch": "Wij eten aan de tafel.",
                       "english": "We eat at the table."
                     }
                   ]
                 },
                 {
                   "dutch": "stoel",
                   "english": "chair",
                   "type": "noun",
                   "difficulty": "beginner",
                   "examples": [
                     {
                       "dutch": "Er staat een stoel naast de tafel.",
                       "english": "There is a chair next to the table."
                     },
                     {
                       "dutch": "Ik zit op de stoel.",
                       "english": "I sit on the chair."
                     },
                     {
                       "dutch": "De stoel is nieuw.",
                       "english": "The chair is new."
                     }
                   ]
                 },
                 {
                   "dutch": "bed",
                   "english": "bed",
                   "type": "noun",
                   "difficulty": "beginner",
                   "examples": [
                     {
                       "dutch": "Ik slaap in een bed.",
                       "english": "I sleep in a bed."
                     },
                     {
                       "dutch": "Het bed is groot.",
                       "english": "The bed is big."
                     },
                     {
                       "dutch": "Ik lig in mijn bed.",
                       "english": "I lie in my bed."
                     }
                   ]
                 },
                 {
                   "dutch": "kast",
                   "english": "cupboard/closet",
                   "type": "noun",
                   "difficulty": "beginner",
                   "examples": [
                     {
                       "dutch": "De kast is vol met kleren.",
                       "english": "The cupboard is full of clothes."
                     },
                     {
                       "dutch": "De kast staat in de slaapkamer.",
                       "english": "The cupboard is in the bedroom."
                     },
                     {
                       "dutch": "Er liggen boeken in de kast.",
                       "english": "There are books in the cupboard."
                     }
                   ]
                 },
              {
                "dutch": "vloer",
                "english": "floor",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De vloer is schoon.",
                    "english": "The floor is clean."
                  },
                  {
                    "dutch": "Ik veeg de vloer.",
                    "english": "I sweep the floor."
                  }
                ]
              },
                 {
                   "dutch": "plafond",
                   "english": "ceiling",
                   "type": "noun",
                   "difficulty": "beginner",
                   "examples": [
                     {
                       "dutch": "Het plafond is wit.",
                       "english": "The ceiling is white."
                     },
                     {
                       "dutch": "Het plafond is hoog.",
                       "english": "The ceiling is high."
                     },
                     {
                       "dutch": "Er hangt een lamp aan het plafond.",
                       "english": "A lamp hangs from the ceiling."
                     }
                   ]
                 },
                 {
                   "dutch": "tuin",
                   "english": "garden",
                   "type": "noun",
                   "difficulty": "beginner",
                   "examples": [
                     {
                       "dutch": "De tuin heeft bloemen.",
                       "english": "The garden has flowers."
                     },
                     {
                       "dutch": "Wij zitten in de tuin.",
                       "english": "We sit in the garden."
                     },
                     {
                       "dutch": "De kinderen spelen in de tuin.",
                       "english": "The children play in the garden."
                     }
                   ]
                 },
                 {
                   "dutch": "woonkamer",
                   "english": "living room",
                   "type": "noun",
                   "difficulty": "beginner",
                   "examples": [
                     {
                       "dutch": "De woonkamer is gezellig.",
                       "english": "The living room is cozy."
                     },
                     {
                       "dutch": "Er staat een bank in de woonkamer.",
                       "english": "There is a sofa in the living room."
                     },
                     {
                       "dutch": "We kijken tv in de woonkamer.",
                       "english": "We watch TV in the living room."
                     }
                   ]
                 },
              {
                "dutch": "slaapkamer",
                "english": "bedroom",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn slaapkamer is rustig.",
                    "english": "My bedroom is quiet."
                  },
                  {
                    "dutch": "De slaapkamer heeft een groot raam.",
                    "english": "The bedroom has a big window."
                  }
                ]
              },
              {
                "dutch": "zolder",
                "english": "attic",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Op zolder zijn oude dozen.",
                    "english": "There are old boxes in the attic."
                  },
                  {
                    "dutch": "We slaan spullen op zolder op.",
                    "english": "We store things in the attic."
                  }
                ]
              },
              {
                "dutch": "kelder",
                "english": "basement",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De kelder is koel.",
                    "english": "The basement is cool."
                  },
                  {
                    "dutch": "Er staat een wasmachine in de kelder.",
                    "english": "There is a washing machine in the basement."
                  },
                  {
                    "dutch": "Ik bewaar wijn in de kelder.",
                    "english": "I keep wine in the basement."
                  }
                ]
              },
              {
                "dutch": "balkon",
                "english": "balcony",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het balkon is klein.",
                    "english": "The balcony is small."
                  },
                  {
                    "dutch": "We zitten op het balkon.",
                    "english": "We sit on the balcony."
                  }
                ]
              },
              {
                "dutch": "garage",
                "english": "garage",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De auto staat in de garage.",
                    "english": "The car is in the garage."
                  },
                  {
                    "dutch": "Ik parkeer in de garage.",
                    "english": "I park in the garage."
                  }
                ]
              },
              {
                "dutch": "deurbel",
                "english": "doorbell",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik hoor de deurbel.",
                    "english": "I hear the doorbell."
                  },
                  {
                    "dutch": "Druk op de deurbel.",
                    "english": "Press the doorbell."
                  }
                ]
              }
            ],
            "family": [
              {
                "dutch": "man",
                "english": "man",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De man leest een krant.",
                    "english": "The man is reading a newspaper."
                  },
                  {
                    "dutch": "De man loopt naar het werk.",
                    "english": "The man walks to work."
                  }
                ]
              },
              {
                "dutch": "vrouw",
                "english": "woman",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De vrouw kookt in de keuken.",
                    "english": "The woman is cooking in the kitchen."
                  },
                  {
                    "dutch": "De vrouw werkt in het ziekenhuis.",
                    "english": "The woman works in the hospital."
                  }
                ]
              },
              {
                "dutch": "kind",
                "english": "child",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het kind speelt in de tuin.",
                    "english": "The child is playing in the garden."
                  },
                  {
                    "dutch": "Het kind gaat naar school.",
                    "english": "The child goes to school."
                  }
                ]
              },
              {
                "dutch": "vader",
                "english": "father",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn vader werkt in een kantoor.",
                    "english": "My father works in an office."
                  },
                  {
                    "dutch": "Mijn vader leest een boek.",
                    "english": "My father reads a book."
                  }
                ]
              },
              {
                "dutch": "moeder",
                "english": "mother",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn moeder maakt het eten klaar.",
                    "english": "My mother is preparing the food."
                  },
                  {
                    "dutch": "Mijn moeder drinkt koffie.",
                    "english": "My mother drinks coffee."
                  }
                ]
              },
              {
                "dutch": "broer",
                "english": "brother",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn broer gaat naar school.",
                    "english": "My brother goes to school."
                  },
                  {
                    "dutch": "Mijn broer speelt voetbal.",
                    "english": "My brother plays football."
                  }
                ]
              },
              {
                "dutch": "zus",
                "english": "sister",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn zus luistert naar muziek.",
                    "english": "My sister is listening to music."
                  },
                  {
                    "dutch": "Mijn zus leest een tijdschrift.",
                    "english": "My sister reads a magazine."
                  }
                ]
              },
                 {
                   "dutch": "vriend",
                   "english": "friend (male)",
                   "type": "noun",
                   "difficulty": "beginner",
                   "examples": [
                     {
                       "dutch": "Hij is mijn beste vriend.",
                       "english": "He is my best friend."
                     },
                     {
                       "dutch": "Mijn vriend woont in Utrecht.",
                       "english": "My friend lives in Utrecht."
                     },
                     {
                       "dutch": "Ik ga met mijn vriend naar het park.",
                       "english": "I go to the park with my friend."
                     }
                   ]
                 },
                 {
                   "dutch": "vriendin",
                   "english": "friend (female)/girlfriend",
                   "type": "noun",
                   "difficulty": "beginner",
                   "examples": [
                     {
                       "dutch": "Zij is mijn vriendin.",
                       "english": "She is my girlfriend."
                     },
                     {
                       "dutch": "Mijn vriendin studeert in Leiden.",
                       "english": "My girlfriend studies in Leiden."
                     },
                     {
                       "dutch": "Ik bel mijn vriendin elke dag.",
                       "english": "I call my friend every day."
                     }
                   ]
                 },
                 {
                   "dutch": "baby",
                   "english": "baby",
                   "type": "noun",
                   "difficulty": "beginner",
                   "examples": [
                     {
                       "dutch": "De baby slaapt in het bed.",
                       "english": "The baby is sleeping in the bed."
                     },
                     {
                       "dutch": "De baby huilt veel.",
                       "english": "The baby cries a lot."
                     },
                     {
                       "dutch": "De baby lacht naar zijn moeder.",
                       "english": "The baby smiles at his mother."
                     }
                   ]
                 },
              {
                "dutch": "oma",
                "english": "grandmother",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn oma bakt koekjes.",
                    "english": "My grandmother bakes cookies."
                  },
                  {
                    "dutch": "Oma woont dichtbij.",
                    "english": "Grandma lives nearby."
                  }
                ]
              },
              {
                "dutch": "opa",
                "english": "grandfather",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn opa vertelt verhalen.",
                    "english": "My grandfather tells stories."
                  },
                  {
                    "dutch": "Opa werkt niet meer.",
                    "english": "Grandpa is retired."
                  }
                ]
              },
              {
                "dutch": "tante",
                "english": "aunt",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn tante komt op bezoek.",
                    "english": "My aunt is visiting."
                  },
                  {
                    "dutch": "Tante woont in de stad.",
                    "english": "Aunt lives in the city."
                  }
                ]
              },
              {
                "dutch": "oom",
                "english": "uncle",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn oom is aardig.",
                    "english": "My uncle is kind."
                  },
                  {
                    "dutch": "Oom werkt in een fabriek.",
                    "english": "Uncle works in a factory."
                  }
                ]
              },
               {
                 "dutch": "neef",
                 "english": "nephew/cousin",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Mijn neef is jong.",
                     "english": "My cousin is young."
                   },
                   {
                     "dutch": "De neef speelt met de auto.",
                     "english": "The cousin plays with the car."
                   }
                 ]
               },
               {
                 "dutch": "nicht",
                 "english": "niece/cousin (f)",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Mijn nicht is slim.",
                     "english": "My cousin is smart."
                   },
                   {
                     "dutch": "De nicht studeert.",
                     "english": "The cousin studies."
                   }
                 ]
               },
               {
                 "dutch": "ouders",
                 "english": "parents",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Mijn ouders wonen ver weg.",
                     "english": "My parents live far away."
                   },
                   {
                     "dutch": "Mijn ouders helpen mij.",
                     "english": "My parents help me."
                   }
                 ]
               },
               {
                 "dutch": "gezin",
                 "english": "family",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ons gezin is groot.",
                     "english": "Our family is big."
                   },
                   {
                     "dutch": "Het gezin eet samen.",
                     "english": "The family eats together."
                   }
                 ]
               },
               {
                 "dutch": "vrienden",
                 "english": "friends",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Mijn vrienden zijn lief.",
                     "english": "My friends are kind."
                   },
                   {
                     "dutch": "Ik bel mijn vrienden.",
                     "english": "I call my friends."
                   }
                 ]
               },
               {
                 "dutch": "collega",
                 "english": "colleague",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Mijn collega is aardig.",
                     "english": "My colleague is nice."
                   },
                   {
                     "dutch": "De collega helpt mij.",
                     "english": "The colleague helps me."
                   }
                 ]
               }
            ],
            "food": [
              {
                "dutch": "eten",
                "english": "food",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het eten is warm.",
                    "english": "The food is warm."
                  },
                  {
                    "dutch": "Het eten is op tafel.",
                    "english": "The food is on the table."
                  }
                ]
              },
              {
                "dutch": "drinken",
                "english": "drink",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik wil drinken.",
                    "english": "I want a drink."
                  },
                  {
                    "dutch": "We drinken samen koffie.",
                    "english": "We drink coffee together."
                  }
                ]
              },
              {
                "dutch": "brood",
                "english": "bread",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het brood is vers.",
                    "english": "The bread is fresh."
                  },
                  {
                    "dutch": "Ik koop brood bij de bakker.",
                    "english": "I buy bread at the bakery."
                  }
                ]
              },
              {
                "dutch": "melk",
                "english": "milk",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik drink melk bij het ontbijt.",
                    "english": "I drink milk at breakfast."
                  },
                  {
                    "dutch": "De melk is koud.",
                    "english": "The milk is cold."
                  }
                ]
              },
              {
                "dutch": "kaas",
                "english": "cheese",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De kaas is lekker.",
                    "english": "The cheese is tasty."
                  },
                  {
                    "dutch": "Ik eet kaas op brood.",
                    "english": "I eat cheese on bread."
                  }
                ]
              },
              {
                "dutch": "water",
                "english": "water",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik drink water.",
                    "english": "I drink water."
                  },
                  {
                    "dutch": "Water is gezond.",
                    "english": "Water is healthy."
                  }
                ]
              },
              {
                "dutch": "koffie",
                "english": "coffee",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik drink koffie 's ochtends.",
                    "english": "I drink coffee in the morning."
                  },
                  {
                    "dutch": "Koffie is warm.",
                    "english": "Coffee is hot."
                  }
                ]
              },
              {
                "dutch": "thee",
                "english": "tea",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Wil je thee?",
                    "english": "Do you want tea?"
                  },
                  {
                    "dutch": "Ik drink groene thee.",
                    "english": "I drink green tea."
                  }
                ]
              },
              {
                "dutch": "appel",
                "english": "apple",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik eet een appel.",
                    "english": "I eat an apple."
                  },
                  {
                    "dutch": "De appel is rood.",
                    "english": "The apple is red."
                  }
                ]
              },
              {
                "dutch": "vis",
                "english": "fish",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De vis is vers.",
                    "english": "The fish is fresh."
                  },
                  {
                    "dutch": "We eten vis met rijst.",
                    "english": "We eat fish with rice."
                  }
                ]
              },
              {
                "dutch": "vlees",
                "english": "meat",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Vlees is op het bord.",
                    "english": "Meat is on the plate."
                  },
                  {
                    "dutch": "Ik koop vlees bij de slager.",
                    "english": "I buy meat at the butcher."
                  }
                ]
              },
              {
                "dutch": "ei",
                "english": "egg",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het ei is hardgekookt.",
                    "english": "The egg is hard-boiled."
                  },
                  {
                    "dutch": "Ik bak een ei.",
                    "english": "I fry an egg."
                  }
                ]
              },
              {
                "dutch": "soep",
                "english": "soup",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De soep is warm.",
                    "english": "The soup is warm."
                  },
                  {
                    "dutch": "Ik eet soep bij lunch.",
                    "english": "I eat soup for lunch."
                  }
                ]
              },
              {
                "dutch": "rijst",
                "english": "rice",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Wij eten rijst.",
                    "english": "We eat rice."
                  },
                  {
                    "dutch": "Rijst is wit.",
                    "english": "Rice is white."
                  }
                ]
              },
              {
                "dutch": "suiker",
                "english": "sugar",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik wil geen suiker.",
                    "english": "I don't want sugar."
                  },
                  {
                    "dutch": "De koffie heeft suiker.",
                    "english": "The coffee has sugar."
                  }
                ]
              },
              {
                "dutch": "zout",
                "english": "salt",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Zout is op tafel.",
                    "english": "Salt is on the table."
                  },
                  {
                    "dutch": "Te veel zout is slecht.",
                    "english": "Too much salt is bad."
                  }
                ]
              },
              {
                "dutch": "boter",
                "english": "butter",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Boter smelt op warm brood.",
                    "english": "Butter melts on warm bread."
                  },
                  {
                    "dutch": "Ik smeer boter op brood.",
                    "english": "I spread butter on bread."
                  }
                ]
              },
              {
                "dutch": "ijs",
                "english": "ice cream",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik eet ijs in de zomer.",
                    "english": "I eat ice cream in summer."
                  },
                  {
                    "dutch": "Het ijs is koud.",
                    "english": "The ice cream is cold."
                  }
                ]
              },
              {
                "dutch": "banaan",
                "english": "banana",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De banaan is geel.",
                    "english": "The banana is yellow."
                  },
                  {
                    "dutch": "Ik eet een banaan als snack.",
                    "english": "I eat a banana as a snack."
                  }
                ]
              },
               {
                 "dutch": "sinaasappel",
                 "english": "orange",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De sinaasappel is zuur.",
                     "english": "The orange is sour."
                   },
                   {
                     "dutch": "Ik drink sinaasappelsap.",
                     "english": "I drink orange juice."
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
                    "dutch": "De auto is snel.",
                    "english": "The car is fast."
                  },
                  {
                    "dutch": "De auto staat op de straat.",
                    "english": "The car is parked on the street."
                  }
                ]
              },
              {
                "dutch": "fiets",
                "english": "bicycle",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik fiets naar werk.",
                    "english": "I cycle to work."
                  },
                  {
                    "dutch": "De fiets heeft twee wielen.",
                    "english": "The bicycle has two wheels."
                  }
                ]
              },
              {
                "dutch": "bus",
                "english": "bus",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De bus komt elk uur.",
                    "english": "The bus comes every hour."
                  },
                  {
                    "dutch": "Ik neem de bus naar school.",
                    "english": "I take the bus to school."
                  }
                ]
              },
              {
                "dutch": "trein",
                "english": "train",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De trein is op tijd.",
                    "english": "The train is on time."
                  },
                  {
                    "dutch": "Ik reis met de trein.",
                    "english": "I travel by train."
                  }
                ]
              },
              {
                "dutch": "metro",
                "english": "metro",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De metro is snel.",
                    "english": "The metro is fast."
                  },
                  {
                    "dutch": "De metro gaat onder de grond.",
                    "english": "The metro goes underground."
                  }
                ]
              },
              {
                "dutch": "tram",
                "english": "tram",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De tram stopt bij het centrum.",
                    "english": "The tram stops at the center."
                  },
                  {
                    "dutch": "De tram is vol.",
                    "english": "The tram is full."
                  }
                ]
              },
              {
                "dutch": "vliegtuig",
                "english": "plane",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het vliegtuig vliegt hoog.",
                    "english": "The plane flies high."
                  },
                  {
                    "dutch": "Ik ga met het vliegtuig op reis.",
                    "english": "I travel by plane."
                  }
                ]
              },
              {
                "dutch": "boot",
                "english": "boat",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De boot vaart op zee.",
                    "english": "The boat sails on the sea."
                  },
                  {
                    "dutch": "De boot is langzaam.",
                    "english": "The boat is slow."
                  }
                ]
              },
               {
                 "dutch": "scooter",
                 "english": "scooter",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De scooter rijdt snel.",
                     "english": "The scooter rides fast."
                   },
                   {
                     "dutch": "Ik zie een scooter op straat.",
                     "english": "I see a scooter on the street."
                   }
                 ]
               },
               {
                 "dutch": "motor",
                 "english": "motorcycle",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De motor maakt veel geluid.",
                     "english": "The motorcycle makes a lot of noise."
                   },
                   {
                     "dutch": "Hij rijdt op een motor.",
                     "english": "He rides a motorcycle."
                   }
                 ]
               },
              {
                "dutch": "ticket",
                "english": "ticket",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik koop een ticket.",
                    "english": "I buy a ticket."
                  },
                  {
                    "dutch": "Het ticket is geldig.",
                    "english": "The ticket is valid."
                  }
                ]
              },
              {
                "dutch": "station",
                "english": "station",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het station is druk.",
                    "english": "The station is busy."
                  },
                  {
                    "dutch": "De trein stopt bij het station.",
                    "english": "The train stops at the station."
                  }
                ]
              },
               {
                 "dutch": "halte",
                 "english": "stop",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De bushalte is hier.",
                     "english": "The bus stop is here."
                   },
                   {
                     "dutch": "Ik wacht bij de halte.",
                     "english": "I wait at the stop."
                   }
                 ]
               },
              {
                "dutch": "straat",
                "english": "street",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De straat is breed.",
                    "english": "The street is wide."
                  },
                  {
                    "dutch": "De winkels staan in de straat.",
                    "english": "Shops are on the street."
                  }
                ]
              },
               {
                 "dutch": "weg",
                 "english": "road",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De weg is nat.",
                     "english": "The road is wet."
                   },
                   {
                     "dutch": "De auto rijdt op de weg.",
                     "english": "The car drives on the road."
                   }
                 ]
               },
               {
                 "dutch": "brug",
                 "english": "bridge",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De brug is lang.",
                     "english": "The bridge is long."
                   },
                   {
                     "dutch": "We lopen over de brug.",
                     "english": "We walk over the bridge."
                   }
                 ]
               },
               {
                 "dutch": "kaart",
                 "english": "map/ticket",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik kijk op de kaart.",
                     "english": "I look at the map."
                   },
                   {
                     "dutch": "De kaart helpt mij de weg te vinden.",
                     "english": "The map helps me find the way."
                   }
                 ]
               },
               {
                 "dutch": "route",
                 "english": "route",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De route is kort.",
                     "english": "The route is short."
                   },
                   {
                     "dutch": "Ik volg de route op mijn telefoon.",
                     "english": "I follow the route on my phone."
                   }
                 ]
               },
               {
                 "dutch": "parkeerplaats",
                 "english": "parking",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De parkeerplaats is vol.",
                     "english": "The parking lot is full."
                   },
                   {
                     "dutch": "Ik zoek een parkeerplaats.",
                     "english": "I look for a parking space."
                   }
                 ]
               },
               {
                 "dutch": "fietsrek",
                 "english": "bike rack",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik zet de fiets in het fietsrek.",
                     "english": "I put the bike in the bike rack."
                   },
                   {
                     "dutch": "Het fietsrek is naast de winkel.",
                     "english": "The bike rack is next to the shop."
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
                  },
                  {
                    "dutch": "Ik ga naar de winkel.",
                    "english": "I go to the shop."
                  }
                ]
              },
              {
                "dutch": "supermarkt",
                "english": "supermarket",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De supermarkt is groot.",
                    "english": "The supermarket is big."
                  },
                  {
                    "dutch": "Ik koop eten in de supermarkt.",
                    "english": "I buy food at the supermarket."
                  }
                ]
              },
               {
                 "dutch": "ziekenhuis",
                 "english": "hospital",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Het ziekenhuis helpt zieke mensen.",
                     "english": "The hospital helps sick people."
                   },
                   {
                     "dutch": "Ik bezoek het ziekenhuis.",
                     "english": "I visit the hospital."
                   }
                 ]
               },
               {
                 "dutch": "apotheek",
                 "english": "pharmacy",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik ga naar de apotheek.",
                     "english": "I go to the pharmacy."
                   },
                   {
                     "dutch": "De apotheek verkoopt medicijnen.",
                     "english": "The pharmacy sells medicines."
                   }
                 ]
               },
              {
                "dutch": "school",
                "english": "school",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De school begint om acht uur.",
                    "english": "The school starts at eight o'clock."
                  },
                  {
                    "dutch": "De leerling gaat naar school.",
                    "english": "The pupil goes to school."
                  }
                ]
              },
               {
                 "dutch": "universiteit",
                 "english": "university",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De universiteit is groot.",
                     "english": "The university is big."
                   },
                   {
                     "dutch": "Studenten studeren aan de universiteit.",
                     "english": "Students study at the university."
                   }
                 ]
               },
              {
                "dutch": "park",
                "english": "park",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het park is groen.",
                    "english": "The park is green."
                  },
                  {
                    "dutch": "We lopen in het park.",
                    "english": "We walk in the park."
                  }
                ]
              },
               {
                 "dutch": "bibliotheek",
                 "english": "library",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De bibliotheek heeft boeken.",
                     "english": "The library has books."
                   },
                   {
                     "dutch": "Ik leen een boek in de bibliotheek.",
                     "english": "I borrow a book from the library."
                   }
                 ]
               },
               {
                 "dutch": "postkantoor",
                 "english": "post office",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik stuur een brief bij het postkantoor.",
                     "english": "I send a letter at the post office."
                   },
                   {
                     "dutch": "Het postkantoor is open tot vijf uur.",
                     "english": "The post office is open until five."
                   }
                 ]
               },
              {
                "dutch": "restaurant",
                "english": "restaurant",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Wij eten in een restaurant.",
                    "english": "We eat in a restaurant."
                  },
                  {
                    "dutch": "Het restaurant serveert soep.",
                    "english": "The restaurant serves soup."
                  }
                ]
              },
               {
                 "dutch": "cafe",
                 "english": "café",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "We drinken koffie in het café.",
                     "english": "We drink coffee in the café."
                   },
                   {
                     "dutch": "Het café heeft stoelen buiten.",
                     "english": "The café has chairs outside."
                   }
                 ]
               },
               {
                 "dutch": "bank",
                 "english": "bank",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik ga naar de bank.",
                     "english": "I go to the bank."
                   },
                   {
                     "dutch": "De bank geeft geld.",
                     "english": "The bank gives money."
                   }
                 ]
               },
               {
                 "dutch": "politie",
                 "english": "police",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik bel de politie.",
                     "english": "I call the police."
                   },
                   {
                     "dutch": "De politie helpt mensen.",
                     "english": "The police help people."
                   }
                 ]
               },
               {
                 "dutch": "station",
                 "english": "station",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Het station is druk.",
                     "english": "The station is busy."
                   },
                   {
                     "dutch": "De trein stopt bij het station.",
                     "english": "The train stops at the station."
                   }
                 ]
               },
               {
                 "dutch": "bakker",
                 "english": "bakery",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De bakker verkoopt brood.",
                     "english": "The baker sells bread."
                   },
                   {
                     "dutch": "Ik koop brood bij de bakker.",
                     "english": "I buy bread at the bakery."
                   }
                 ]
               },
               {
                 "dutch": "slager",
                 "english": "butcher",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De slager verkoopt vlees.",
                     "english": "The butcher sells meat."
                   },
                   {
                     "dutch": "Ik koop vlees bij de slager.",
                     "english": "I buy meat at the butcher."
                   }
                 ]
               },
               {
                 "dutch": "bioscoop",
                 "english": "cinema",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "We kijken een film in de bioscoop.",
                     "english": "We watch a film in the cinema."
                   },
                   {
                     "dutch": "De bioscoop heeft veel stoelen.",
                     "english": "The cinema has many seats."
                   }
                 ]
               },
               {
                 "dutch": "museum",
                 "english": "museum",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Het museum heeft schilderijen.",
                     "english": "The museum has paintings."
                   },
                   {
                     "dutch": "Ik bezoek het museum op zaterdag.",
                     "english": "I visit the museum on Saturday."
                   }
                 ]
               },
               {
                 "dutch": "markt",
                 "english": "market",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Op de markt verkopen ze groente.",
                     "english": "They sell vegetables at the market."
                   },
                   {
                     "dutch": "Ik koop fruit op de markt.",
                     "english": "I buy fruit at the market."
                   }
                 ]
               },
               {
                 "dutch": "kantoor",
                 "english": "office",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Het kantoor is open.",
                     "english": "The office is open."
                   },
                   {
                     "dutch": "Hij werkt in het kantoor.",
                     "english": "He works in the office."
                   }
                 ]
               }
            ],
            "time": [
              {
                "dutch": "vandaag",
                "english": "today",
                "type": "adverb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Vandaag is het maandag.",
                    "english": "Today is Monday."
                  },
                  {
                    "dutch": "Vandaag is zonnig.",
                    "english": "Today is sunny."
                  }
                ]
              },
              {
                "dutch": "morgen",
                "english": "tomorrow",
                "type": "adverb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Morgen ga ik naar de markt.",
                    "english": "Tomorrow I go to the market."
                  },
                  {
                    "dutch": "Ik zie je morgen.",
                    "english": "I will see you tomorrow."
                  }
                ]
              },
              {
                "dutch": "gisteren",
                "english": "yesterday",
                "type": "adverb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Gisteren was ik thuis.",
                    "english": "Yesterday I was at home."
                  },
                  {
                    "dutch": "We aten gisteren pizza.",
                    "english": "We ate pizza yesterday."
                  }
                ]
              },
              {
                "dutch": "maandag",
                "english": "Monday",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Maandag is de eerste werkdag.",
                    "english": "Monday is the first workday."
                  },
                  {
                    "dutch": "Op maandag heb ik les.",
                    "english": "On Monday I have class."
                  }
                ]
              },
              {
                "dutch": "dinsdag",
                "english": "Tuesday",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Dinsdag ga ik zwemmen.",
                    "english": "On Tuesday I go swimming."
                  },
                  {
                    "dutch": "Dinsdag is mijn vrije dag.",
                    "english": "Tuesday is my day off."
                  }
                ]
              },
              {
                "dutch": "woensdag",
                "english": "Wednesday",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Woensdag komt de post.",
                    "english": "On Wednesday the mail arrives."
                  },
                  {
                    "dutch": "Op woensdag heb ik sport.",
                    "english": "On Wednesday I have sports."
                  }
                ]
              },
               {
                 "dutch": "donderdag",
                 "english": "Thursday",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Donderdag heb ik les.",
                     "english": "On Thursday I have class."
                   },
                   {
                     "dutch": "Donderdag is bijna weekend.",
                     "english": "Thursday is almost weekend."
                   }
                 ]
               },
              {
                "dutch": "vrijdag",
                "english": "Friday",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Vrijdag ga ik naar de bioscoop.",
                    "english": "On Friday I go to the cinema."
                  },
                  {
                    "dutch": "Vrijdag is mijn favoriete dag.",
                    "english": "Friday is my favorite day."
                  }
                ]
              },
               {
                 "dutch": "zaterdag",
                 "english": "Saturday",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Zaterdag is markt in de stad.",
                     "english": "On Saturday there is a market in town."
                   },
                   {
                     "dutch": "Zaterdag slaap ik uit.",
                     "english": "On Saturday I sleep in."
                   }
                 ]
               },
               {
                 "dutch": "zondag",
                 "english": "Sunday",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Zondag rust ik thuis.",
                     "english": "On Sunday I rest at home."
                   },
                   {
                     "dutch": "Zondag is een rustige dag.",
                     "english": "Sunday is a quiet day."
                   }
                 ]
               },
              {
                "dutch": "uur",
                "english": "hour",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het uur duurt zestig minuten.",
                    "english": "An hour lasts sixty minutes."
                  },
                  {
                    "dutch": "Het is een uur later.",
                    "english": "It is one hour later."
                  }
                ]
              },
              {
                "dutch": "minuut",
                "english": "minute",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Een minuut is kort.",
                    "english": "A minute is short."
                  },
                  {
                    "dutch": "Wacht een minuut.",
                    "english": "Wait one minute."
                  }
                ]
              },
               {
                 "dutch": "seconde",
                 "english": "second",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Een seconde is snel voorbij.",
                     "english": "A second passes quickly."
                   },
                   {
                     "dutch": "Wacht een seconde.",
                     "english": "Wait a second."
                   }
                 ]
               },
               {
                 "dutch": "maand",
                 "english": "month",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De maand is augustus.",
                     "english": "The month is August."
                   },
                   {
                     "dutch": "Volgende maand ga ik op reis.",
                     "english": "Next month I travel."
                   }
                 ]
               },
              {
                "dutch": "jaar",
                "english": "year",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het jaar is bijna voorbij.",
                    "english": "The year is almost over."
                  },
                  {
                    "dutch": "Volgend jaar studeer ik.",
                    "english": "Next year I will study."
                  }
                ]
              },
               {
                 "dutch": "ochtend",
                 "english": "morning",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "In de ochtend drink ik koffie.",
                     "english": "In the morning I drink coffee."
                   },
                   {
                     "dutch": "De ochtend is koel.",
                     "english": "The morning is cool."
                   }
                 ]
               },
               {
                 "dutch": "middag",
                 "english": "afternoon",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "In de middag heb ik lunch.",
                     "english": "In the afternoon I have lunch."
                   },
                   {
                     "dutch": "De middag is warm.",
                     "english": "The afternoon is warm."
                   }
                 ]
               },
               {
                 "dutch": "avond",
                 "english": "evening",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "In de avond eten we samen.",
                     "english": "In the evening we eat together."
                   },
                   {
                     "dutch": "De avond is rustig.",
                     "english": "The evening is calm."
                   }
                 ]
               },
               {
                 "dutch": "nacht",
                 "english": "night",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "In de nacht slaap ik.",
                     "english": "At night I sleep."
                   },
                   {
                     "dutch": "De nacht is donker.",
                     "english": "The night is dark."
                   }
                 ]
               },
               {
                 "dutch": "week",
                 "english": "week",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De week heeft zeven dagen.",
                     "english": "The week has seven days."
                   },
                   {
                     "dutch": "Volgende week ga ik op vakantie.",
                     "english": "Next week I go on holiday."
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
                    "dutch": "De zon schijnt vandaag.",
                    "english": "The sun is shining today."
                  },
                  {
                    "dutch": "De zon is warm.",
                    "english": "The sun is warm."
                  }
                ]
              },
              {
                "dutch": "regen",
                "english": "rain",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het regent hard.",
                    "english": "It's raining hard."
                  },
                  {
                    "dutch": "Ik houd niet van regen.",
                    "english": "I don't like rain."
                  }
                ]
              },
              {
                "dutch": "sneeuw",
                "english": "snow",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het sneeuwt buiten.",
                    "english": "It's snowing outside."
                  },
                  {
                    "dutch": "De sneeuw is wit.",
                    "english": "The snow is white."
                  }
                ]
              },
              {
                "dutch": "wind",
                "english": "wind",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Er staat veel wind.",
                    "english": "There's a lot of wind."
                  },
                  {
                    "dutch": "De wind is koud.",
                    "english": "The wind is cold."
                  }
                ]
              },
              {
                "dutch": "wolk",
                "english": "cloud",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De wolken zijn grijs.",
                    "english": "The clouds are grey."
                  },
                  {
                    "dutch": "Ik zie wolken in de lucht.",
                    "english": "I see clouds in the sky."
                  }
                ]
              },
              {
                "dutch": "warm",
                "english": "warm",
                "type": "adjective",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het is warm vandaag.",
                    "english": "It is warm today."
                  },
                  {
                    "dutch": "Ik draag lichte kleding als het warm is.",
                    "english": "I wear light clothes when it is warm."
                  }
                ]
              },
              {
                "dutch": "koud",
                "english": "cold",
                "type": "adjective",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het is koud buiten.",
                    "english": "It is cold outside."
                  },
                  {
                    "dutch": "Ik draag een jas als het koud is.",
                    "english": "I wear a coat when it is cold."
                  }
                ]
              },
              {
                "dutch": "heet",
                "english": "hot",
                "type": "adjective",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het is erg heet deze zomer.",
                    "english": "It is very hot this summer."
                  },
                  {
                    "dutch": "Het eten is heet.",
                    "english": "The food is hot."
                  }
                ]
              },
               {
                 "dutch": "koel",
                 "english": "cool",
                 "type": "adjective",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Het is koel in de ochtend.",
                     "english": "It is cool in the morning."
                   },
                   {
                     "dutch": "Ik word blij van koel weer.",
                     "english": "I like cool weather."
                   }
                 ]
               },
               {
                 "dutch": "mist",
                 "english": "fog",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Er is veel mist vandaag.",
                     "english": "There is a lot of fog today."
                   },
                   {
                     "dutch": "Met mist is de weg slecht zichtbaar.",
                     "english": "With fog the road is hard to see."
                   }
                 ]
               },
               {
                 "dutch": "onweer",
                 "english": "thunderstorm",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Er is onweer vannacht.",
                     "english": "There is a thunderstorm tonight."
                   },
                   {
                     "dutch": "Onweer heeft veel bliksem.",
                     "english": "Thunderstorms have a lot of lightning."
                   }
                 ]
               },
               {
                 "dutch": "hagel",
                 "english": "hail",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Vandaag valt er hagel.",
                     "english": "It is hailing today."
                   },
                   {
                     "dutch": "Hagel is hard op het dak.",
                     "english": "Hail is hard on the roof."
                   }
                 ]
               },
               {
                 "dutch": "droog",
                 "english": "dry",
                 "type": "adjective",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De lucht is droog.",
                     "english": "The air is dry."
                   },
                   {
                     "dutch": "Het is deze week droog.",
                     "english": "It is dry this week."
                   }
                 ]
               },
               {
                 "dutch": "nat",
                 "english": "wet",
                 "type": "adjective",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Mijn jas is nat.",
                     "english": "My coat is wet."
                   },
                   {
                     "dutch": "Na de regen is de straat nat.",
                     "english": "After the rain the street is wet."
                   }
                 ]
               },
              {
                "dutch": "lente",
                "english": "spring",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "In de lente bloeien de bloemen.",
                    "english": "In spring the flowers bloom."
                  },
                  {
                    "dutch": "Lente is het seizoen na de winter.",
                    "english": "Spring is the season after winter."
                  }
                ]
              },
              {
                "dutch": "zomer",
                "english": "summer",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "In de zomer is het warm.",
                    "english": "In summer it is warm."
                  },
                  {
                    "dutch": "We gaan in de zomer op vakantie.",
                    "english": "We go on holiday in summer."
                  }
                ]
              },
               {
                 "dutch": "herfst",
                 "english": "autumn/fall",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "In de herfst vallen de bladeren.",
                     "english": "In autumn the leaves fall."
                   },
                   {
                     "dutch": "Herfst is koel en nat.",
                     "english": "Autumn is cool and wet."
                   }
                 ]
               },
              {
                "dutch": "winter",
                "english": "winter",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "In de winter is het koud.",
                    "english": "In winter it is cold."
                  },
                  {
                    "dutch": "We schaatsen in de winter.",
                    "english": "We skate in winter."
                  }
                ]
              },
               {
                 "dutch": "temperatuur",
                 "english": "temperature",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De temperatuur is vandaag 20 graden.",
                     "english": "The temperature is 20 degrees today."
                   },
                   {
                     "dutch": "De temperatuur daalt 's avonds.",
                     "english": "The temperature drops in the evening."
                   }
                 ]
               },
               {
                 "dutch": "bui",
                 "english": "shower",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Er is een korte bui.",
                     "english": "There is a short shower."
                   },
                   {
                     "dutch": "Na de bui komt de zon weer.",
                     "english": "After the shower the sun returns."
                   }
                 ]
               }
            ],
            "clothing": [
              {
                "dutch": "jas",
                "english": "coat",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik draag een jas.",
                    "english": "I wear a coat."
                  },
                  {
                    "dutch": "De jas is warm.",
                    "english": "The coat is warm."
                  }
                ]
              },
              {
                "dutch": "broek",
                "english": "trousers",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik draag een broek.",
                    "english": "I wear trousers."
                  },
                  {
                    "dutch": "De broek is lang.",
                    "english": "The trousers are long."
                  }
                ]
              },
              {
                "dutch": "jurk",
                "english": "dress",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Zij draagt een jurk.",
                    "english": "She wears a dress."
                  },
                  {
                    "dutch": "De jurk is mooi.",
                    "english": "The dress is beautiful."
                  }
                ]
              },
               {
                 "dutch": "rok",
                 "english": "skirt",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De rok is kort.",
                     "english": "The skirt is short."
                   },
                   {
                     "dutch": "Zij koopt een nieuwe rok.",
                     "english": "She buys a new skirt."
                   }
                 ]
               },
              {
                "dutch": "trui",
                "english": "sweater",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik draag een trui.",
                    "english": "I wear a sweater."
                  },
                  {
                    "dutch": "De trui is warm.",
                    "english": "The sweater is warm."
                  }
                ]
              },
              {
                "dutch": "schoenen",
                "english": "shoes",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn schoenen zijn zwart.",
                    "english": "My shoes are black."
                  },
                  {
                    "dutch": "Ik koop nieuwe schoenen.",
                    "english": "I buy new shoes."
                  }
                ]
              },
              {
                "dutch": "sokken",
                "english": "socks",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Mijn sokken zijn nat.",
                    "english": "My socks are wet."
                  },
                  {
                    "dutch": "Ik draag schone sokken.",
                    "english": "I wear clean socks."
                  }
                ]
              },
              {
                "dutch": "shirt",
                "english": "shirt",
                "type": "noun",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Het shirt is wit.",
                    "english": "The shirt is white."
                  },
                  {
                    "dutch": "Het shirt heeft korte mouwen.",
                    "english": "The shirt has short sleeves."
                  }
                ]
              },
               {
                 "dutch": "hoed",
                 "english": "hat",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik draag een hoed tegen de zon.",
                     "english": "I wear a hat against the sun."
                   },
                   {
                     "dutch": "De hoed is groot.",
                     "english": "The hat is big."
                   }
                 ]
               },
               {
                 "dutch": "handschoenen",
                 "english": "gloves",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik draag handschoenen in de winter.",
                     "english": "I wear gloves in winter."
                   },
                   {
                     "dutch": "De handschoenen zijn warm.",
                     "english": "The gloves are warm."
                   }
                 ]
               },
               {
                 "dutch": "muts",
                 "english": "beanie",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De muts houdt mijn hoofd warm.",
                     "english": "The beanie keeps my head warm."
                   },
                   {
                     "dutch": "Ik zet de muts op bij koude.",
                     "english": "I put the beanie on when cold."
                   }
                 ]
               },
               {
                 "dutch": "sjaal",
                 "english": "scarf",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik draag een sjaal om mijn nek.",
                     "english": "I wear a scarf around my neck."
                   },
                   {
                     "dutch": "De sjaal is zacht.",
                     "english": "The scarf is soft."
                   }
                 ]
               },
               {
                 "dutch": "riem",
                 "english": "belt",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "De riem is van leer.",
                     "english": "The belt is made of leather."
                   },
                   {
                     "dutch": "Ik doe de riem om mijn broek.",
                     "english": "I put the belt on my trousers."
                   }
                 ]
               },
               {
                 "dutch": "ondergoed",
                 "english": "underwear",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik koop nieuw ondergoed.",
                     "english": "I buy new underwear."
                   },
                   {
                     "dutch": "Ondergoed draag je elke dag.",
                     "english": "You wear underwear every day."
                   }
                 ]
               },
               {
                 "dutch": "pak",
                 "english": "suit",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Hij draagt een pak naar het werk.",
                     "english": "He wears a suit to work."
                   },
                   {
                     "dutch": "Het pak is zwart.",
                     "english": "The suit is black."
                   }
                 ]
               },
               {
                 "dutch": "sandalen",
                 "english": "sandals",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik draag sandalen in de zomer.",
                     "english": "I wear sandals in summer."
                   },
                   {
                     "dutch": "De sandalen zijn comfortabel.",
                     "english": "The sandals are comfortable."
                   }
                 ]
               },
               {
                 "dutch": "laarzen",
                 "english": "boots",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik draag laarzen als het regent.",
                     "english": "I wear boots when it rains."
                   },
                   {
                     "dutch": "De laarzen zijn groot.",
                     "english": "The boots are big."
                   }
                 ]
               },
               {
                 "dutch": "pyjama",
                 "english": "pyjama",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik draag pyjama om te slapen.",
                     "english": "I wear pajamas to sleep."
                   },
                   {
                     "dutch": "De pyjama is zacht.",
                     "english": "The pajamas are soft."
                   }
                 ]
               },
               {
                 "dutch": "tas",
                 "english": "bag",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Mijn tas is vol.",
                     "english": "My bag is full."
                   },
                   {
                     "dutch": "Ik neem mijn tas mee.",
                     "english": "I take my bag with me."
                   }
                 ]
               },
               {
                 "dutch": "pocket",
                 "english": "pocket",
                 "type": "noun",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Er zit een sleutel in de pocket.",
                     "english": "There is a key in the pocket."
                   },
                   {
                     "dutch": "De pocket is klein.",
                     "english": "The pocket is small."
                   }
                 ]
               }
            ],
            "verbs": [
              {
                "dutch": "zijn",
                "english": "to be",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik ben student.",
                    "english": "I am a student."
                  },
                  {
                    "dutch": "Hij is mijn vriend.",
                    "english": "He is my friend."
                  }
                ]
              },
              {
                "dutch": "hebben",
                "english": "to have",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik heb een pen.",
                    "english": "I have a pen."
                  },
                  {
                    "dutch": "Zij heeft een hond.",
                    "english": "She has a dog."
                  }
                ]
              },
              {
                "dutch": "gaan",
                "english": "to go",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik ga naar school.",
                    "english": "I go to school."
                  },
                  {
                    "dutch": "Hij gaat naar huis.",
                    "english": "He goes home."
                  }
                ]
              },
              {
                "dutch": "komen",
                "english": "to come",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Kom naar binnen.",
                    "english": "Come inside."
                  },
                  {
                    "dutch": "Hij komt morgen.",
                    "english": "He comes tomorrow."
                  }
                ]
              },
              {
                "dutch": "doen",
                "english": "to do",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Wat doe je?",
                    "english": "What are you doing?"
                  },
                  {
                    "dutch": "Ik doe mijn huiswerk.",
                    "english": "I do my homework."
                  }
                ]
              },
              {
                "dutch": "willen",
                "english": "to want",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik wil water.",
                    "english": "I want water."
                  },
                  {
                    "dutch": "Wil je koffie?",
                    "english": "Do you want coffee?"
                  }
                ]
              },
              {
                "dutch": "eten",
                "english": "to eat",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik eet brood.",
                    "english": "I eat bread."
                  },
                  {
                    "dutch": "Hij eet vis.",
                    "english": "He eats fish."
                  }
                ]
              },
              {
                "dutch": "drinken",
                "english": "to drink",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik drink melk.",
                    "english": "I drink milk."
                  },
                  {
                    "dutch": "Zij drinkt thee.",
                    "english": "She drinks tea."
                  }
                ]
              },
              {
                "dutch": "zien",
                "english": "to see",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik zie een vogel.",
                    "english": "I see a bird."
                  },
                  {
                    "dutch": "Zie je dat huis?",
                    "english": "Do you see that house?"
                  }
                ]
              },
              {
                "dutch": "horen",
                "english": "to hear",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik hoor muziek.",
                    "english": "I hear music."
                  },
                  {
                    "dutch": "Hoor je de auto?",
                    "english": "Do you hear the car?"
                  }
                ]
              },
              {
                "dutch": "praten",
                "english": "to talk",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Kun je praten?",
                    "english": "Can you talk?"
                  },
                  {
                    "dutch": "We praten over school.",
                    "english": "We talk about school."
                  }
                ]
              },
              {
                "dutch": "lezen",
                "english": "to read",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik lees een boek.",
                    "english": "I read a book."
                  },
                  {
                    "dutch": "Hij leest de krant.",
                    "english": "He reads the newspaper."
                  }
                ]
              },
              {
                "dutch": "schrijven",
                "english": "to write",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik schrijf een brief.",
                    "english": "I write a letter."
                  },
                  {
                    "dutch": "Zij schrijft in haar notebook.",
                    "english": "She writes in her notebook."
                  }
                ]
              },
              {
                "dutch": "lopen",
                "english": "to walk",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik loop naar het station.",
                    "english": "I walk to the station."
                  },
                  {
                    "dutch": "Hij loopt snel.",
                    "english": "He walks fast."
                  }
                ]
              },
               {
                 "dutch": "rennen",
                 "english": "to run",
                 "type": "verb",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik ren in de ochtend.",
                     "english": "I run in the morning."
                   },
                   {
                     "dutch": "Hij rent naar de bus.",
                     "english": "He runs to the bus."
                   }
                 ]
               },
              {
                "dutch": "slapen",
                "english": "to sleep",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik slaap acht uur.",
                    "english": "I sleep eight hours."
                  },
                  {
                    "dutch": "Het kind slaapt.",
                    "english": "The child sleeps."
                  }
                ]
              },
              {
                "dutch": "werken",
                "english": "to work",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "Ik werk in een kantoor.",
                    "english": "I work in an office."
                  },
                  {
                    "dutch": "Hij werkt hard.",
                    "english": "He works hard."
                  }
                ]
              },
              {
                "dutch": "spelen",
                "english": "to play",
                "type": "verb",
                "difficulty": "beginner",
                "examples": [
                  {
                    "dutch": "De kinderen spelen buiten.",
                    "english": "The children play outside."
                  },
                  {
                    "dutch": "Ik speel piano.",
                    "english": "I play piano."
                  }
                ]
              },
               {
                 "dutch": "kopen",
                 "english": "to buy",
                 "type": "verb",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik koop brood.",
                     "english": "I buy bread."
                   },
                   {
                     "dutch": "Hij koopt een cadeau.",
                     "english": "He buys a gift."
                   }
                 ]
               },
               {
                 "dutch": "betalen",
                 "english": "to pay",
                 "type": "verb",
                 "difficulty": "beginner",
                 "examples": [
                   {
                     "dutch": "Ik betaal de rekening.",
                     "english": "I pay the bill."
                   },
                   {
                     "dutch": "Hij betaalt contant.",
                     "english": "He pays cash."
                   }
                 ]
               }
            ]
          }
    }

    showLoadingComplete() {
        // Remove any loading indicators and enable the interface
        document.body.classList.remove('loading');
        console.log('✅ Vocabulary data loaded successfully!');
    }

    showLoadingError(error) {
        // Show error message to user
        const errorMessage = document.createElement('div');
        errorMessage.className = 'loading-error';
        errorMessage.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Failed to Load Vocabulary Data</h3>
                <p>Could not load vocabulary-data.json: ${error.message}</p>
                <p>Please make sure the file exists and you're running this from a web server.</p>
                <button onclick="location.reload()" class="retry-btn">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
        document.body.appendChild(errorMessage);
    }

    initializeSpeech() {
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
            this.loadDutchVoices();
        } else {
            console.warn('Speech synthesis not supported in this browser');
            this.elements.pronounceBtn.style.display = 'none';
        }
    }

    loadDutchVoices() {
        const loadVoices = () => {
            const voices = this.speechSynthesis.getVoices();
            this.dutchVoices = voices.filter(voice => 
                voice.lang.startsWith('nl') || 
                voice.name.toLowerCase().includes('dutch') ||
                voice.name.toLowerCase().includes('nederlands')
            );
            
            if (this.dutchVoices.length === 0) {
                this.dutchVoices = voices.slice(0, 1);
            }
        };

        loadVoices();
        this.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }

    pronounceDutchWord(text) {
        if (!this.speechSynthesis || !text) return;

        this.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        if (this.dutchVoices && this.dutchVoices.length > 0) {
            utterance.voice = this.dutchVoices[0];
        }
        
        utterance.lang = 'nl-NL';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;

        this.elements.pronounceBtn.classList.add('pulse');
        
        utterance.onend = () => {
            this.elements.pronounceBtn.classList.remove('pulse');
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.elements.pronounceBtn.classList.remove('pulse');
        };

        this.speechSynthesis.speak(utterance);
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
        const totalCount = Object.values(this.vocabularyData).reduce((sum, words) => sum + words.length, 0);
        const allCountElement = document.getElementById('count-all');
        if (allCountElement) {
            allCountElement.textContent = `${totalCount} words`;
        }
    }

    bindEvents() {
        // Learning mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = btn.dataset.mode;
                this.selectLearningDirection(mode);
            });
        });

        // Category selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const category = card.dataset.category;
                this.selectCategory(category);
            });
        });

        // Back to categories button
        this.elements.backToCategoriesBtn.addEventListener('click', () => {
            this.showCategorySelection();
        });

        // Direction toggle button
        this.elements.directionToggle.addEventListener('click', () => {
            this.toggleLearningDirection();
        });

        // Search functionality
        this.elements.categorySearch.addEventListener('input', (e) => {
            this.searchCategories(e.target.value);
        });

        this.elements.categorySearch.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });

        this.elements.clearSearch.addEventListener('click', () => {
            this.clearSearch();
        });

        // Examples functionality
        this.elements.examplesToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.showExamples();
            } else {
                this.hideExamples();
            }
        });

        this.elements.closeExamples.addEventListener('click', () => {
            this.elements.examplesToggle.checked = false;
            this.hideExamples();
        });

        // Pronunciation button
        this.elements.pronounceBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentWord = this.currentVocabulary[this.currentIndex];
            if (currentWord) {
                // Always pronounce Dutch word regardless of direction
                this.pronounceDutchWord(currentWord.dutch);
            }
        });

        // Card flip (click on flashcard)
        this.elements.flashcard.addEventListener('click', () => this.flipCard());

        // Navigation
        this.elements.prevBtn.addEventListener('click', () => this.previousCard());
        this.elements.nextBtn.addEventListener('click', () => this.nextCard());

        // Control buttons
        this.elements.shuffleBtn.addEventListener('click', () => this.shuffleCards());

        // Answer buttons
        this.elements.correctBtn.addEventListener('click', () => this.markAnswer(true));
        this.elements.incorrectBtn.addEventListener('click', () => this.markAnswer(false));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleGlobalKeyboard(e));
    }

    handleKeyboard(e) {
        if (!this.isLearningMode) return;

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousCard();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextCard();
                break;
            case 'p':
            case 'P':
                e.preventDefault();
                const currentWord = this.currentVocabulary[this.currentIndex];
                if (currentWord) {
                    this.pronounceDutchWord(currentWord.dutch);
                }
                break;
            case '1':
                e.preventDefault();
                this.markAnswer(false);
                break;
            case '2':
                e.preventDefault();
                this.markAnswer(true);
                break;
            case 'Escape':
                e.preventDefault();
                this.showCategorySelection();
                break;
            case 't':
            case 'T':
                e.preventDefault();
                this.toggleLearningDirection();
                break;
            case 'e':
            case 'E':
                e.preventDefault();
                this.elements.examplesToggle.checked = !this.elements.examplesToggle.checked;
                // Trigger the change event manually
                this.elements.examplesToggle.dispatchEvent(new Event('change'));
                break;
        }
    }

    handleGlobalKeyboard(e) {
        // Only handle global shortcuts when not in learning mode or when search is not focused
        if (this.isLearningMode || document.activeElement === this.elements.categorySearch) return;

        switch(e.key) {
            case '/':
                e.preventDefault();
                if (this.elements.categorySelection.style.display !== 'none') {
                    this.elements.categorySearch.focus();
                }
                break;
        }
    }

    selectLearningDirection(direction) {
        this.learningDirection = direction;
        
        // Update active button with animation
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active', 'just-selected');
        });
        
        const selectedBtn = document.querySelector(`[data-mode="${direction}"]`);
        selectedBtn.classList.add('active', 'just-selected');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            selectedBtn.classList.remove('just-selected');
        }, 600);
        
        // Update direction display info
        this.updateDirectionInfo();
    }

    updateDirectionInfo() {
        if (this.learningDirection === 'dutch-to-english') {
            this.elements.directionIndicator.textContent = '🇳🇱 → 🇬🇧';
            this.elements.directionText.textContent = 'Dutch to English';
        } else {
            this.elements.directionIndicator.textContent = '🇬🇧 → 🇳🇱';
            this.elements.directionText.textContent = 'English to Dutch';
        }
    }

    toggleLearningDirection() {
        // Switch direction
        this.learningDirection = this.learningDirection === 'dutch-to-english' 
            ? 'english-to-dutch' 
            : 'dutch-to-english';
        
        // Update UI
        this.updateDirectionInfo();
        
        // Also update the mode buttons on category selection page with animation
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active', 'just-selected');
        });
        
        const selectedBtn = document.querySelector(`[data-mode="${this.learningDirection}"]`);
        selectedBtn.classList.add('active', 'just-selected');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            selectedBtn.classList.remove('just-selected');
        }, 600);
        
        // Reload current card with new direction
        this.loadCard();
        
        // Add visual feedback
        this.elements.directionToggle.classList.add('pulse');
        setTimeout(() => {
            this.elements.directionToggle.classList.remove('pulse');
        }, 600);
    }

    selectCategory(category) {
        if (!this.isDataLoaded) {
            console.warn('Vocabulary data not loaded yet');
            return;
        }

        this.currentCategory = category;
        
        // Get vocabulary for selected category
        if (category === 'all') {
            this.currentVocabulary = Object.values(this.vocabularyData).flat();
        } else {
            this.currentVocabulary = [...this.vocabularyData[category]];
        }

        // Reset learning state
        this.currentIndex = 0;
        this.isFlipped = false;
        this.correctCount = 0;
        this.totalAttempts = 0;
        this.isLearningMode = true;

        // Update UI
        this.showLearningInterface();
        this.updateCategoryInfo();
        this.updateDirectionInfo();
        this.loadCard();
        this.updateStats();
        this.updateProgress();
        this.enableControls();

        // Add visual feedback
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('selected');
    }

    showCategorySelection() {
        this.elements.categorySelection.style.display = 'block';
        this.elements.learningInterface.style.display = 'none';
        this.isLearningMode = false;
        
        // Remove selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected');
        });
    }

    showLearningInterface() {
        this.elements.categorySelection.style.display = 'none';
        this.elements.learningInterface.style.display = 'block';
        this.elements.learningInterface.classList.add('fade-in');
    }

    updateCategoryInfo() {
        const categoryData = this.categoryInfo[this.currentCategory];
        this.elements.currentCategoryName.textContent = categoryData.name;
        this.elements.currentCategoryIcon.textContent = categoryData.icon;
    }

    enableControls() {
        this.elements.prevBtn.disabled = false;
        this.elements.nextBtn.disabled = false;
        this.elements.shuffleBtn.disabled = false;
        this.elements.pronounceBtn.disabled = false;
        this.elements.examplesToggle.disabled = false;
    }

    loadCard() {
        if (this.currentVocabulary.length === 0) return;

        const word = this.currentVocabulary[this.currentIndex];
        
        // Reset flip state
        this.isFlipped = false;
        this.elements.flashcard.classList.remove('flipped');
        
        // Update card content based on learning direction
        if (this.learningDirection === 'dutch-to-english') {
            // Show Dutch on front, English on back
            this.elements.dutchWord.textContent = word.dutch;
            this.elements.englishWord.textContent = word.english;
            // Update language tags
            document.querySelector('.card-front .language-tag').textContent = 'Dutch';
            document.querySelector('.card-back .language-tag').textContent = 'English';
        } else {
            // Show English on front, Dutch on back
            this.elements.dutchWord.textContent = word.english;
            this.elements.englishWord.textContent = word.dutch;
            // Update language tags
            document.querySelector('.card-front .language-tag').textContent = 'English';
            document.querySelector('.card-back .language-tag').textContent = 'Dutch';
        }
        
        this.elements.wordType.textContent = word.type;
        this.elements.difficulty.textContent = word.difficulty;
        this.elements.difficulty.className = `difficulty ${word.difficulty}`;
        
        // Hide answer buttons
        this.elements.answerButtons.style.display = 'none';
        
        // Update current card number
        this.elements.currentCard.textContent = this.currentIndex + 1;
        
        // Update pronunciation button text based on direction
        const pronounceText = this.learningDirection === 'dutch-to-english' ? 'Pronounce' : 'Hear Dutch';
        this.elements.pronounceBtn.querySelector('span').textContent = pronounceText;
        
        // Show examples automatically if toggle is enabled
        if (this.elements.examplesToggle.checked) {
            this.showExamples();
        } else {
            this.hideExamples();
        }
    }

    flipCard() {
        if (!this.isLearningMode) return;

        this.isFlipped = !this.isFlipped;
        this.elements.flashcard.classList.toggle('flipped');
        
        // Always show answer buttons when flipping
        this.elements.answerButtons.style.display = 'flex';
    }

    previousCard() {
        if (!this.isLearningMode) return;

        this.currentIndex = (this.currentIndex - 1 + this.currentVocabulary.length) % this.currentVocabulary.length;
        this.loadCard();
        this.updateProgress();
    }

    nextCard() {
        if (!this.isLearningMode) return;

        this.currentIndex = (this.currentIndex + 1) % this.currentVocabulary.length;
        this.loadCard();
        this.updateProgress();
    }

    markAnswer(correct) {
        this.totalAttempts++;
        if (correct) {
            this.correctCount++;
        }
        
        this.updateStats();
        
        // Auto-advance to next card
        setTimeout(() => {
            this.nextCard();
        }, 500);
    }

    shuffleCards() {
        for (let i = this.currentVocabulary.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentVocabulary[i], this.currentVocabulary[j]] = 
            [this.currentVocabulary[j], this.currentVocabulary[i]];
        }
        
        this.currentIndex = 0;
        this.loadCard();
        this.updateProgress();
        
        this.elements.shuffleBtn.classList.add('pulse');
        setTimeout(() => {
            this.elements.shuffleBtn.classList.remove('pulse');
        }, 600);
    }


    updateStats() {
        this.elements.totalCards.textContent = this.currentVocabulary.length;
    }

    updateProgress() {
        if (this.currentVocabulary.length === 0) return;
        
        const progress = ((this.currentIndex + 1) / this.currentVocabulary.length) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
    }

    searchCategories(searchTerm) {
        const categoryCards = document.querySelectorAll('.category-card');
        const searchLower = searchTerm.toLowerCase().trim();
        let visibleCount = 0;

        // Show/hide clear button
        if (searchTerm.length > 0) {
            this.elements.clearSearch.style.display = 'flex';
        } else {
            this.elements.clearSearch.style.display = 'none';
        }

        // Remove existing no-results message
        const existingNoResults = document.querySelector('.no-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }

        categoryCards.forEach(card => {
            const categoryName = card.querySelector('.category-name').textContent.toLowerCase();
            const categoryType = card.dataset.category;
            
            // Search in category name and type
            const matches = categoryName.includes(searchLower) || 
                           categoryType.includes(searchLower);

            if (searchLower === '' || matches) {
                card.classList.remove('hidden');
                card.classList.toggle('search-highlight', searchLower !== '' && matches);
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.classList.remove('search-highlight');
            }
        });

        // Update results count
        if (searchTerm.length > 0) {
            this.elements.resultCount.textContent = visibleCount;
            this.elements.searchResultsCount.style.display = 'block';
            
            // Show no results message if needed
            if (visibleCount === 0) {
                this.showNoResults();
            }
        } else {
            this.elements.searchResultsCount.style.display = 'none';
        }
    }

    showNoResults() {
        const categoryGrid = document.querySelector('.category-grid');
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <i class="fas fa-search"></i>
            <div>No categories found</div>
            <div style="font-size: 0.9rem; margin-top: 10px; opacity: 0.8;">Try a different search term</div>
        `;
        categoryGrid.appendChild(noResults);
    }

    clearSearch() {
        this.elements.categorySearch.value = '';
        this.elements.categorySearch.focus();
        this.searchCategories('');
    }

    showExamples() {
        const currentWord = this.currentVocabulary[this.currentIndex];
        if (!currentWord) return;

        // Update examples content
        this.updateExamplesContent(currentWord);
        
        // Show panel and add class for layout
        this.elements.examplesPanel.style.display = 'block';
        this.elements.learningContent.classList.add('examples-visible');
    }

    hideExamples() {
        this.elements.examplesPanel.style.display = 'none';
        this.elements.learningContent.classList.remove('examples-visible');
    }

    updateExamplesContent(word) {
        const content = this.elements.examplesContent;
        
        if (!word.examples || word.examples.length === 0) {
            content.innerHTML = `
                <div class="no-examples">
                    <i class="fas fa-info-circle"></i>
                    <p>No example sentences available for "<strong>${word.dutch}</strong>".</p>
                </div>
            `;
            return;
        }

        let examplesHTML = '';
        word.examples.forEach((example, index) => {
            examplesHTML += `
                <div class="example-sentence">
                    <div class="dutch-sentence">
                        <span>${example.dutch}</span>
                        <button class="play-example" onclick="app.pronounceDutchWord('${example.dutch.replace(/'/g, "\\'")}')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                    <div class="english-sentence">${example.english}</div>
                </div>
            `;
        });

        content.innerHTML = examplesHTML;
    }
}

// Initialize the application when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DutchFlashcards();
});

// Console messages
console.log('🇳🇱 Dutch Flashcards with Categories loaded!');
console.log('Keyboard shortcuts:');
console.log('  Arrow keys: Navigate cards');
console.log('  P: Pronounce Dutch word');
console.log('  T: Toggle learning direction');
console.log('  E: Toggle example sentences');
console.log('  1: Mark as incorrect');
console.log('  2: Mark as correct');
console.log('  Escape: Back to categories / Clear search');
console.log('  /: Focus search (on category page)');