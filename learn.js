// Load shared functionality
document.head.appendChild(Object.assign(document.createElement('script'), {
    src: 'shared.js',
    onload: initializeLearnMode
}));

// Dutch Flashcards Learning Mode
class LearnMode {
    constructor() {
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
    }

    initializeElements() {
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

    async initialize() {
        try {
            await window.vocabularyData.loadVocabularyData();
            window.vocabularyData.updateCategoryCounts();
            Utils.removeLoadingState();
            console.log('✅ Learn mode initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize learn mode:', error);
            Utils.showLoadingError(error);
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
                window.speechManager.pronounceDutchWord(currentWord.dutch);
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
                    window.speechManager.pronounceDutchWord(currentWord.dutch);
                }
                break;
            case ' ':
                e.preventDefault();
                this.flipCard();
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
                if (this.elements.examplesToggle.checked) {
                    this.showExamples();
                } else {
                    this.hideExamples();
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
                if (this.isLearningMode) {
                    this.showCategorySelection();
                } else {
                    this.clearSearch();
                }
                break;
            case '/':
                if (!this.isLearningMode) {
                    e.preventDefault();
                    this.elements.categorySearch.focus();
                }
                break;
        }
    }

    selectLearningDirection(direction) {
        this.learningDirection = direction;
        
        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${direction}"]`).classList.add('active');

        // Update direction display in learning interface
        if (direction === 'dutch-to-english') {
            this.elements.directionIndicator.textContent = '🇳🇱 → 🇬🇧';
            this.elements.directionText.textContent = 'Dutch to English';
        } else {
            this.elements.directionIndicator.textContent = '🇬🇧 → 🇳🇱';
            this.elements.directionText.textContent = 'English to Dutch';
        }

        // If already in learning mode, update the current card
        if (this.isLearningMode && this.currentVocabulary.length > 0) {
            this.isFlipped = false;
            this.updateCard();
        }
    }

    toggleLearningDirection() {
        const newDirection = this.learningDirection === 'dutch-to-english' ? 'english-to-dutch' : 'dutch-to-english';
        this.selectLearningDirection(newDirection);
        
        // Add visual feedback
        this.elements.directionToggle.classList.add('pulse');
        setTimeout(() => {
            this.elements.directionToggle.classList.remove('pulse');
        }, 600);
    }

    selectCategory(category) {
        if (!window.vocabularyData.isDataLoaded) {
            console.warn('Vocabulary data not loaded yet');
            return;
        }

        this.currentCategory = category;
        this.currentVocabulary = window.vocabularyData.getCategoryWords(category);

        // Reset learning state
        this.currentIndex = 0;
        this.isFlipped = false;
        this.correctCount = 0;
        this.totalAttempts = 0;
        this.isLearningMode = true;

        // Update UI
        this.elements.currentCategoryName.textContent = window.vocabularyData.categoryInfo[category].name;
        this.elements.currentCategoryIcon.textContent = window.vocabularyData.categoryInfo[category].icon;

        this.showLearningInterface();
        this.updateCard();
        this.updateStats();
        this.updateProgress();

        // Mark selected category
        this.markSelectedCategory(category);
    }

    markSelectedCategory(category) {
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

        // Enable controls
        this.elements.pronounceBtn.disabled = false;
        this.elements.shuffleBtn.disabled = false;
        this.updateNavigationButtons();
    }

    updateCard() {
        if (!this.currentVocabulary.length) return;

        const currentWord = this.currentVocabulary[this.currentIndex];
        
        // Reset card state
        this.elements.flashcard.classList.remove('flipped');
        this.isFlipped = false;

        // Update content based on learning direction
        if (this.learningDirection === 'dutch-to-english') {
            this.elements.dutchWord.textContent = currentWord.dutch;
            this.elements.englishWord.textContent = currentWord.english;
        } else {
            this.elements.dutchWord.textContent = currentWord.english;
            this.elements.englishWord.textContent = currentWord.dutch;
        }

        // Update word details
        this.elements.wordType.textContent = currentWord.type || '';
        this.elements.difficulty.textContent = currentWord.difficulty || '';
        this.elements.difficulty.className = `difficulty ${currentWord.difficulty || ''}`;

        // Update examples if panel is open
        if (this.elements.examplesPanel.style.display !== 'none') {
            this.updateExamples(currentWord);
        }
    }

    flipCard() {
        if (!this.isLearningMode) return;
        
        this.isFlipped = !this.isFlipped;
        this.elements.flashcard.classList.toggle('flipped');
        
        // Show answer buttons when card is flipped
        if (this.isFlipped) {
            this.elements.answerButtons.style.display = 'flex';
        } else {
            this.elements.answerButtons.style.display = 'none';
        }
    }

    nextCard() {
        if (this.currentIndex < this.currentVocabulary.length - 1) {
            this.currentIndex++;
            this.updateCard();
            this.updateStats();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    previousCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCard();
            this.updateStats();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    shuffleCards() {
        this.currentVocabulary = Utils.shuffleArray(this.currentVocabulary);
        this.currentIndex = 0;
        this.updateCard();
        this.updateStats();
        this.updateProgress();
        this.updateNavigationButtons();
        
        // Visual feedback
        this.elements.shuffleBtn.classList.add('pulse');
        setTimeout(() => {
            this.elements.shuffleBtn.classList.remove('pulse');
        }, 600);
    }

    markAnswer(isCorrect) {
        if (!this.isFlipped) return;
        
        this.totalAttempts++;
        if (isCorrect) {
            this.correctCount++;
        }
        
        // Visual feedback
        const button = isCorrect ? this.elements.correctBtn : this.elements.incorrectBtn;
        button.classList.add('pulse');
        setTimeout(() => {
            button.classList.remove('pulse');
        }, 300);
        
        // Auto-advance to next card after a short delay
        setTimeout(() => {
            this.nextCard();
        }, 500);
    }

    updateStats() {
        this.elements.currentCard.textContent = this.currentIndex + 1;
        this.elements.totalCards.textContent = this.currentVocabulary.length;
    }

    updateProgress() {
        const progress = ((this.currentIndex + 1) / this.currentVocabulary.length) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
    }

    updateNavigationButtons() {
        this.elements.prevBtn.disabled = this.currentIndex === 0;
        this.elements.nextBtn.disabled = this.currentIndex === this.currentVocabulary.length - 1;
    }

    // Search functionality
    searchCategories(query) {
        const cards = document.querySelectorAll('.category-card');
        const searchQuery = query.toLowerCase().trim();
        let visibleCount = 0;

        cards.forEach(card => {
            const categoryName = card.querySelector('.category-name').textContent.toLowerCase();
            const isVisible = categoryName.includes(searchQuery) || searchQuery === '';
            
            if (isVisible) {
                card.classList.remove('hidden');
                card.classList.toggle('search-highlight', searchQuery !== '');
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.classList.remove('search-highlight');
            }
        });

        // Update search results count
        if (searchQuery) {
            this.elements.searchResultsCount.style.display = 'block';
            this.elements.resultCount.textContent = visibleCount;
            this.elements.clearSearch.style.display = 'block';
        } else {
            this.elements.searchResultsCount.style.display = 'none';
            this.elements.clearSearch.style.display = 'none';
        }

        // Show no results message if needed
        this.toggleNoResultsMessage(visibleCount === 0 && searchQuery);
    }

    clearSearch() {
        this.elements.categorySearch.value = '';
        this.searchCategories('');
    }

    toggleNoResultsMessage(show) {
        let noResultsMessage = document.querySelector('.no-results');
        
        if (show && !noResultsMessage) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results';
            noResultsMessage.innerHTML = `
                <i class="fas fa-search"></i>
                <p>No categories found matching your search.</p>
            `;
            document.querySelector('.category-grid').appendChild(noResultsMessage);
        } else if (!show && noResultsMessage) {
            noResultsMessage.remove();
        }
    }

    // Examples functionality
    showExamples() {
        this.elements.examplesPanel.style.display = 'block';
        this.elements.learningContent.classList.add('examples-visible');
        
        const currentWord = this.currentVocabulary[this.currentIndex];
        if (currentWord) {
            this.updateExamples(currentWord);
        }
    }

    hideExamples() {
        this.elements.examplesPanel.style.display = 'none';
        this.elements.learningContent.classList.remove('examples-visible');
    }

    updateExamples(word) {
        const content = this.elements.examplesContent;
        
        if (!word.examples || word.examples.length === 0) {
            content.innerHTML = `
                <div class="no-examples">
                    <i class="fas fa-info-circle"></i>
                    <p>No example sentences available for this word.</p>
                </div>
            `;
            return;
        }

        const examplesHTML = word.examples.map(example => {
            return `
                <div class="example-sentence">
                    <div class="dutch-sentence">
                        ${example.dutch}
                        <button class="play-example" onclick="window.speechManager.pronounceDutchWord('${example.dutch}')">
                            <i class="fas fa-volume-up"></i>
                        </button>
                    </div>
                    <div class="english-sentence">${example.english}</div>
                </div>
            `;
        }).join('');

        content.innerHTML = examplesHTML;
    }
}

// Initialize when shared.js is loaded
function initializeLearnMode() {
    const app = new LearnMode();
    app.initialize();
    
    // Global reference for debugging
    window.learnApp = app;
    
    // Console messages
    console.log('🇳🇱 Dutch Flashcards Learn Mode loaded!');
    console.log('Keyboard shortcuts:');
    console.log('  Arrow keys: Navigate cards');
    console.log('  P: Pronounce Dutch word');
    console.log('  T: Toggle learning direction');
    console.log('  E: Toggle example sentences');
    console.log('  1: Mark as incorrect');
    console.log('  2: Mark as correct');
    console.log('  Escape: Back to categories / Clear search');
    console.log('  /: Focus search (on category page)');
}
