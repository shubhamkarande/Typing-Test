class TypingTest {
    constructor() {
        this.currentText = '';
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.isTestActive = false;
        this.errors = 0;
        this.totalChars = 0;
        this.correctChars = 0;
        this.testDuration = 60;
        this.timeLeft = 60;
        this.timer = null;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.loadText();
        this.updateDisplay();
    }

    initializeElements() {
        this.textDisplay = document.getElementById('text-display');
        this.inputArea = document.getElementById('input-area');
        this.wpmElement = document.getElementById('wpm');
        this.accuracyElement = document.getElementById('accuracy');
        this.timerElement = document.getElementById('timer');
        this.errorsElement = document.getElementById('errors');
        this.progressFill = document.getElementById('progress-fill');
        this.progressChars = document.getElementById('progress-chars');
        this.totalCharsElement = document.getElementById('total-chars');
        this.resultsSection = document.getElementById('results');
        this.timeSelect = document.getElementById('time-select');
        this.difficultySelect = document.getElementById('difficulty-select');
        this.themeToggle = document.getElementById('theme-toggle');
        this.resetBtn = document.getElementById('reset-btn');
        this.restartBtn = document.getElementById('restart-btn');
    }

    initializeEventListeners() {
        this.inputArea.addEventListener('input', (e) => this.handleInput(e));
        this.inputArea.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.timeSelect.addEventListener('change', () => this.changeTestDuration());
        this.difficultySelect.addEventListener('change', () => this.changeDifficulty());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.resetBtn.addEventListener('click', () => this.resetTest());
        this.restartBtn.addEventListener('click', () => this.resetTest());
        
        // Focus input area when clicking on text display
        this.textDisplay.addEventListener('click', () => this.inputArea.focus());
    }

    texts = {
        easy: [
            "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is perfect for typing practice.",
            "A journey of a thousand miles begins with a single step. Every expert was once a beginner who never gave up on their dreams.",
            "Practice makes perfect. The more you type, the better you become. Speed and accuracy come with consistent daily practice.",
            "Technology has changed the way we communicate. From letters to emails to instant messages, we are more connected than ever before."
        ],
        medium: [
            "In the realm of software development, debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
            "The best programs are written so that computing machines can perform them quickly and so that human beings can understand them clearly. A programmer is ideally an essayist who works with traditional aesthetic and literary forms.",
            "Computer science is no more about computers than astronomy is about telescopes. The computer was born to solve problems that did not exist before, and programming is the art of solving problems with code.",
            "Artificial intelligence is the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions. The term may also be applied to any machine that exhibits traits associated with a human mind."
        ],
        hard: [
            "Quantum computing represents a fundamental shift in computational paradigms, leveraging quantum-mechanical phenomena such as superposition and entanglement to process information in ways that classical computers cannot efficiently replicate.",
            "Cryptographic algorithms rely on mathematical complexity theory to ensure data security; however, the advent of quantum computers poses significant challenges to current encryption methodologies, necessitating the development of quantum-resistant protocols.",
            "Machine learning algorithms, particularly deep neural networks, have demonstrated remarkable capabilities in pattern recognition tasks, yet their decision-making processes often remain opaque, leading to the 'black box' problem in artificial intelligence.",
            "Distributed systems architecture requires careful consideration of consistency, availability, and partition tolerance trade-offs, as described by the CAP theorem, which fundamentally constrains the design of large-scale networked applications."
        ],
        code: [
            'function calculateFactorial(n) {\n    if (n <= 1) return 1;\n    return n * calculateFactorial(n - 1);\n}\n\nconst result = calculateFactorial(5);\nconsole.log(`Factorial: ${result}`);',
            'class BinarySearchTree {\n    constructor() {\n        this.root = null;\n    }\n    \n    insert(value) {\n        const newNode = { value, left: null, right: null };\n        if (!this.root) {\n            this.root = newNode;\n            return;\n        }\n        this.insertNode(this.root, newNode);\n    }\n}',
            'const apiEndpoint = "https://api.example.com/data";\n\nasync function fetchData() {\n    try {\n        const response = await fetch(apiEndpoint);\n        const data = await response.json();\n        return data.filter(item => item.active);\n    } catch (error) {\n        console.error("Error fetching data:", error);\n        return [];\n    }\n}',
            'import React, { useState, useEffect } from "react";\n\nconst UserProfile = ({ userId }) => {\n    const [user, setUser] = useState(null);\n    const [loading, setLoading] = useState(true);\n    \n    useEffect(() => {\n        fetchUser(userId).then(userData => {\n            setUser(userData);\n            setLoading(false);\n        });\n    }, [userId]);\n    \n    return loading ? <div>Loading...</div> : <div>{user.name}</div>;\n};'
        ]
    };

    loadText() {
        const difficulty = this.difficultySelect.value;
        const texts = this.texts[difficulty];
        this.currentText = texts[Math.floor(Math.random() * texts.length)];
        this.displayText();
        this.totalCharsElement.textContent = this.currentText.length;
    }

    displayText() {
        this.textDisplay.innerHTML = '';
        for (let i = 0; i < this.currentText.length; i++) {
            const span = document.createElement('span');
            span.textContent = this.currentText[i];
            span.className = 'char';
            if (i === 0) span.classList.add('current');
            this.textDisplay.appendChild(span);
        }
    }

    handleInput(e) {
        if (!this.isTestActive) {
            this.startTest();
        }

        const inputValue = e.target.value;
        this.updateTextDisplay(inputValue);
        this.updateStats();
        this.updateProgress();

        if (inputValue.length === this.currentText.length) {
            this.endTest();
        }
    }

    handleKeyDown(e) {
        // Prevent certain keys that might interfere with the test
        if (e.key === 'Tab') {
            e.preventDefault();
        }
    }

    updateTextDisplay(inputValue) {
        const chars = this.textDisplay.querySelectorAll('.char');
        this.errors = 0;
        this.correctChars = 0;

        chars.forEach((char, index) => {
            char.className = 'char';
            
            if (index < inputValue.length) {
                if (inputValue[index] === this.currentText[index]) {
                    char.classList.add('correct');
                    this.correctChars++;
                } else {
                    char.classList.add('incorrect');
                    this.errors++;
                }
            } else if (index === inputValue.length) {
                char.classList.add('current');
            }
        });

        this.totalChars = inputValue.length;
    }

    updateStats() {
        if (!this.startTime) return;

        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // in minutes
        const wordsTyped = this.correctChars / 5; // standard: 5 characters = 1 word
        const wpm = Math.round(wordsTyped / timeElapsed) || 0;
        const accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;

        this.wpmElement.textContent = wpm;
        this.accuracyElement.textContent = accuracy + '%';
        this.errorsElement.textContent = this.errors;
    }

    updateProgress() {
        const progress = (this.totalChars / this.currentText.length) * 100;
        this.progressFill.style.width = progress + '%';
        this.progressChars.textContent = this.totalChars;
    }

    startTest() {
        this.isTestActive = true;
        this.startTime = Date.now();
        this.startTimer();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft + 's';
            
            if (this.timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }

    endTest() {
        this.isTestActive = false;
        this.endTime = Date.now();
        clearInterval(this.timer);
        this.inputArea.disabled = true;
        this.showResults();
    }

    showResults() {
        const timeElapsed = (this.endTime - this.startTime) / 1000 / 60;
        const wordsTyped = this.correctChars / 5;
        const finalWpm = Math.round(wordsTyped / timeElapsed) || 0;
        const finalAccuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;

        document.getElementById('final-wpm').textContent = finalWpm;
        document.getElementById('final-accuracy').textContent = finalAccuracy + '%';
        document.getElementById('final-errors').textContent = this.errors;
        document.getElementById('final-chars').textContent = this.totalChars;

        this.resultsSection.classList.remove('hidden');
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    changeTestDuration() {
        this.testDuration = parseInt(this.timeSelect.value);
        this.resetTest();
    }

    changeDifficulty() {
        this.resetTest();
    }

    resetTest() {
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.isTestActive = false;
        this.errors = 0;
        this.totalChars = 0;
        this.correctChars = 0;
        this.timeLeft = this.testDuration;
        
        clearInterval(this.timer);
        this.timer = null;
        
        this.inputArea.value = '';
        this.inputArea.disabled = false;
        this.inputArea.focus();
        
        this.timerElement.textContent = this.timeLeft + 's';
        this.wpmElement.textContent = '0';
        this.accuracyElement.textContent = '100%';
        this.errorsElement.textContent = '0';
        this.progressFill.style.width = '0%';
        this.progressChars.textContent = '0';
        
        this.resultsSection.classList.add('hidden');
        
        this.loadText();
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.themeToggle.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
        
        // Save theme preference
        localStorage.setItem('typing-test-theme', newTheme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('typing-test-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.themeToggle.textContent = savedTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
}

// Initialize the typing test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const typingTest = new TypingTest();
    typingTest.loadTheme();
    
    // Focus on input area initially
    typingTest.inputArea.focus();
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R to reset (prevent default browser refresh)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        document.getElementById('reset-btn').click();
    }
    
    // Escape to reset
    if (e.key === 'Escape') {
        document.getElementById('reset-btn').click();
    }
});