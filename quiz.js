// Load shared functionality
document.head.appendChild(Object.assign(document.createElement('script'), {
    src: 'shared.js',
    onload: initializeQuizMode
}));

// Dutch Flashcards Quiz Mode
class QuizMode {
    constructor() {
        this.quizQuestions = [];
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.selectedAnswer = null;
        this.quizCategory = null;
        this.quizDirection = 'english-to-dutch'; // Default direction

        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.elements = {
            quizInterface: document.getElementById('quizInterface'),
            quizCategorySelection: document.getElementById('quizCategorySelection'),
            quizQuestions: document.getElementById('quizQuestions'),
            quizResults: document.getElementById('quizResults'),
            quizCategoryGrid: document.getElementById('quizCategoryGrid'),
            backToQuizCategories: document.getElementById('backToQuizCategories'),
            
            // Search elements
            categorySearch: document.getElementById('categorySearch'),
            clearSearch: document.getElementById('clearSearch'),
            searchResultsCount: document.getElementById('searchResultsCount'),
            resultCount: document.getElementById('resultCount'),
            quizCategoryName: document.getElementById('quizCategoryName'),
            quizCategoryIcon: document.getElementById('quizCategoryIcon'),
            quizCurrent: document.getElementById('quizCurrent'),
            quizTotal: document.getElementById('quizTotal'),
            quizQuestionPrompt: document.getElementById('quizQuestionPrompt'),
            quizWord: document.getElementById('quizWord'),
            quizOptions: document.getElementById('quizOptions'),
            quizFeedback: document.getElementById('quizFeedback'),
            feedbackIcon: document.getElementById('feedbackIcon'),
            feedbackText: document.getElementById('feedbackText'),
            correctAnswer: document.getElementById('correctAnswer'),
            correctAnswerText: document.getElementById('correctAnswerText'),
            quizNextBtn: document.getElementById('quizNextBtn'),
            quizScore: document.getElementById('quizScore'),
            quizTotalQuestions: document.getElementById('quizTotalQuestions'),
            scorePercentage: document.getElementById('scorePercentage'),
            finalCorrect: document.getElementById('finalCorrect'),
            finalIncorrect: document.getElementById('finalIncorrect'),
            retryQuiz: document.getElementById('retryQuiz'),
            backToCategoriesFromResults: document.getElementById('backToCategoriesFromResults')
        };
    }

    async initialize() {
        try {
            await window.vocabularyData.loadVocabularyData();
            this.populateQuizCategories();
            Utils.removeLoadingState();
            console.log('✅ Quiz mode initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize quiz mode:', error);
            Utils.showLoadingError(error);
        }
    }

    bindEvents() {
        // Quiz direction selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = btn.dataset.mode;
                this.selectQuizDirection(mode);
            });
        });

        // Quiz navigation buttons
        this.elements.backToQuizCategories.addEventListener('click', () => {
            this.showQuizCategorySelection();
        });

        this.elements.quizNextBtn.addEventListener('click', () => {
            this.nextQuizQuestion();
        });

        // Quiz results buttons
        this.elements.retryQuiz.addEventListener('click', () => {
            this.startQuiz(this.quizCategory);
        });

        this.elements.backToCategoriesFromResults.addEventListener('click', () => {
            this.showQuizCategorySelection();
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

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        // Handle keyboard shortcuts for quiz
        switch(e.key) {
            case '1':
            case '2':
            case '3':
                e.preventDefault();
                const optionIndex = parseInt(e.key) - 1;
                const options = document.querySelectorAll('.quiz-option');
                if (options[optionIndex] && !this.selectedAnswer) {
                    options[optionIndex].click();
                }
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (this.elements.quizNextBtn.style.display !== 'none') {
                    this.elements.quizNextBtn.click();
                }
                break;
            case 'Escape':
                e.preventDefault();
                if (this.elements.quizQuestions.style.display !== 'none') {
                    this.showQuizCategorySelection();
                } else {
                    this.clearSearch();
                }
                break;
            case '/':
                if (this.elements.quizCategorySelection.style.display !== 'none') {
                    e.preventDefault();
                    this.elements.categorySearch.focus();
                }
                break;
        }
    }

    selectQuizDirection(direction) {
        this.quizDirection = direction;
        
        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${direction}"]`).classList.add('active');
    }

    showQuizCategorySelection() {
        this.elements.quizCategorySelection.style.display = 'block';
        this.elements.quizQuestions.style.display = 'none';
        this.elements.quizResults.style.display = 'none';
        
        this.populateQuizCategories();
    }

    populateQuizCategories() {
        const grid = this.elements.quizCategoryGrid;
        grid.innerHTML = '';

        // Create category cards for quiz (including 'all' category)
        Object.entries(window.vocabularyData.categoryInfo).forEach(([key, info]) => {
            let wordCount;
            
            if (key === 'all') {
                // Calculate total words across all categories
                wordCount = Object.values(window.vocabularyData.vocabularyData).flat().length;
            } else {
                wordCount = window.vocabularyData.vocabularyData[key] ? window.vocabularyData.vocabularyData[key].length : 0;
            }
            
            if (wordCount === 0) return; // Skip empty categories

            const card = document.createElement('div');
            card.className = 'quiz-category-card';
            card.dataset.category = key;
            card.innerHTML = `
                <div class="category-icon">${info.icon}</div>
                <div class="category-name">${info.name}</div>
                <div class="category-count">${wordCount} words</div>
            `;

            card.addEventListener('click', () => {
                this.startQuiz(key);
            });

            grid.appendChild(card);
        });
    }

    startQuiz(category) {
        this.quizCategory = category;
        let categoryWords;
        
        if (category === 'all') {
            // Get words from all categories
            categoryWords = Object.values(window.vocabularyData.vocabularyData).flat();
        } else {
            categoryWords = window.vocabularyData.vocabularyData[category] || [];
        }
        
        if (categoryWords.length < 3) {
            alert('This category needs at least 3 words to create a quiz.');
            return;
        }

        // Generate quiz questions (all words in category)
        this.generateQuizQuestions(categoryWords);
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.selectedAnswer = null;

        // Update UI
        this.elements.quizCategoryName.textContent = window.vocabularyData.categoryInfo[category].name;
        this.elements.quizCategoryIcon.textContent = window.vocabularyData.categoryInfo[category].icon;
        this.elements.quizTotal.textContent = this.quizQuestions.length;
        this.elements.quizTotalQuestions.textContent = this.quizQuestions.length;

        // Show quiz questions interface
        this.elements.quizCategorySelection.style.display = 'none';
        this.elements.quizQuestions.style.display = 'block';
        this.elements.quizResults.style.display = 'none';

        this.displayQuizQuestion();
    }

    generateQuizQuestions(categoryWords) {
        // Shuffle all words in the category to randomize question order
        const shuffled = Utils.shuffleArray(categoryWords);

        // Create questions for ALL words in the category based on direction
        this.quizQuestions = shuffled.map(word => {
            if (this.quizDirection === 'english-to-dutch') {
                return {
                    question: word.english,
                    correctAnswer: word.dutch,
                    options: this.generateQuizOptions(word, categoryWords, 'dutch')
                };
            } else {
                return {
                    question: word.dutch,
                    correctAnswer: word.english,
                    options: this.generateQuizOptions(word, categoryWords, 'english')
                };
            }
        });
    }

    generateQuizOptions(correctWord, allWords, language) {
        const correctAnswer = language === 'dutch' ? correctWord.dutch : correctWord.english;
        
        // Get other words in the target language for incorrect options
        const otherWords = allWords
            .filter(word => {
                const wordAnswer = language === 'dutch' ? word.dutch : word.english;
                return wordAnswer !== correctAnswer;
            })
            .map(word => language === 'dutch' ? word.dutch : word.english);

        // Shuffle and take 2 random incorrect options
        const incorrectOptions = otherWords
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);

        // If we don't have enough options from the category, get more from all categories
        if (incorrectOptions.length < 2 && this.quizCategory !== 'all') {
            const allCategoryWords = Object.values(window.vocabularyData.vocabularyData)
                .flat()
                .filter(word => {
                    const wordAnswer = language === 'dutch' ? word.dutch : word.english;
                    return wordAnswer !== correctAnswer && !incorrectOptions.includes(wordAnswer);
                })
                .map(word => language === 'dutch' ? word.dutch : word.english);
            
            const additionalOptions = allCategoryWords
                .sort(() => Math.random() - 0.5)
                .slice(0, 2 - incorrectOptions.length);
            
            incorrectOptions.push(...additionalOptions);
        }

        // Combine correct and incorrect options, then shuffle
        const options = [correctAnswer, ...incorrectOptions]
            .sort(() => Math.random() - 0.5);

        return options;
    }

    displayQuizQuestion() {
        const question = this.quizQuestions[this.currentQuizIndex];
        
        // Update progress
        this.elements.quizCurrent.textContent = this.currentQuizIndex + 1;
        this.elements.quizScore.textContent = this.quizScore;

        // Update question prompt and word based on direction
        if (this.quizDirection === 'english-to-dutch') {
            this.elements.quizQuestionPrompt.textContent = 'What is the Dutch word for:';
        } else {
            this.elements.quizQuestionPrompt.textContent = 'What is the English word for:';
        }

        // Display the question word
        this.elements.quizWord.textContent = question.question;

        // Create option buttons
        this.elements.quizOptions.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.dataset.answer = option;
            
            button.addEventListener('click', () => {
                this.selectQuizAnswer(button, option);
            });

            this.elements.quizOptions.appendChild(button);
        });

        // Hide feedback and next button
        this.elements.quizFeedback.style.display = 'none';
        this.elements.quizNextBtn.style.display = 'none';
        this.selectedAnswer = null;
    }

    selectQuizAnswer(buttonElement, selectedAnswer) {
        if (this.selectedAnswer !== null) return; // Already answered

        this.selectedAnswer = selectedAnswer;
        const question = this.quizQuestions[this.currentQuizIndex];
        const isCorrect = selectedAnswer === question.correctAnswer;

        // Disable all options
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.classList.add('disabled');
        });

        // Mark the selected answer
        buttonElement.classList.add('selected');

        // Show correct/incorrect styling
        document.querySelectorAll('.quiz-option').forEach(btn => {
            if (btn.dataset.answer === question.correctAnswer) {
                btn.classList.add('correct');
            } else if (btn === buttonElement && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Update score
        if (isCorrect) {
            this.quizScore++;
        }

        // Show feedback
        this.showQuizFeedback(isCorrect, question.correctAnswer);
    }

    showQuizFeedback(isCorrect, correctAnswer) {
        const feedbackContent = this.elements.quizFeedback.querySelector('.feedback-content');
        
        if (isCorrect) {
            feedbackContent.className = 'feedback-content correct';
            this.elements.feedbackIcon.textContent = '✓';
            this.elements.feedbackText.textContent = 'Correct!';
            this.elements.correctAnswer.style.display = 'none';
        } else {
            feedbackContent.className = 'feedback-content incorrect';
            this.elements.feedbackIcon.textContent = '✗';
            this.elements.feedbackText.textContent = 'Incorrect!';
            this.elements.correctAnswer.style.display = 'block';
            this.elements.correctAnswerText.textContent = correctAnswer;
        }

        this.elements.quizFeedback.style.display = 'flex';
        
        // Show next button or finish quiz
        if (this.currentQuizIndex < this.quizQuestions.length - 1) {
            this.elements.quizNextBtn.style.display = 'block';
            this.elements.quizNextBtn.innerHTML = 'Next Question <i class="fas fa-arrow-right"></i>';
        } else {
            this.elements.quizNextBtn.style.display = 'block';
            this.elements.quizNextBtn.innerHTML = 'View Results <i class="fas fa-trophy"></i>';
        }
    }

    nextQuizQuestion() {
        if (this.currentQuizIndex < this.quizQuestions.length - 1) {
            this.currentQuizIndex++;
            this.displayQuizQuestion();
        } else {
            this.showQuizResults();
        }
    }

    showQuizResults() {
        this.elements.quizQuestions.style.display = 'none';
        this.elements.quizResults.style.display = 'block';

        const totalQuestions = this.quizQuestions.length;
        const percentage = Math.round((this.quizScore / totalQuestions) * 100);

        this.elements.scorePercentage.textContent = `${percentage}%`;
        this.elements.finalCorrect.textContent = this.quizScore;
        this.elements.finalIncorrect.textContent = totalQuestions - this.quizScore;
    }

    // Search functionality
    searchCategories(query) {
        const cards = document.querySelectorAll('.quiz-category-card');
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
            this.elements.quizCategoryGrid.appendChild(noResultsMessage);
        } else if (!show && noResultsMessage) {
            noResultsMessage.remove();
        }
    }
}

// Initialize when shared.js is loaded
function initializeQuizMode() {
    const app = new QuizMode();
    app.initialize();
    
    // Global reference for debugging
    window.quizApp = app;
    
    // Console messages
    console.log('🇳🇱 Dutch Flashcards Quiz Mode loaded!');
    console.log('📝 Quiz includes ALL words from selected category in random order');
    console.log('🔄 Choose quiz direction: English→Dutch (default) or Dutch→English');
    console.log('Keyboard shortcuts:');
    console.log('  1, 2, 3: Select quiz option');
    console.log('  Enter/Space: Next question');
    console.log('  Escape: Back to categories / Clear search');
    console.log('  /: Focus search (on category page)');
}
