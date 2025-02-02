class QuizManager {
    constructor(storageManager) {
        this.storage = storageManager;
        this.setupQuizButton();
    }

    setupQuizButton() {
        const quizButton = document.createElement('button');
        quizButton.className = 'quiz-button';
        quizButton.innerHTML = '❓';
        quizButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            font-size: 24px;
        `;

        document.body.appendChild(quizButton);
        quizButton.addEventListener('click', () => this.startQuiz());
    }

    startQuiz() {
        const data = this.storage.getData();
        const memorizedSurahs = data.surahs.filter(surah => surah.memorized > 0);
        
        if (memorizedSurahs.length === 0) {
            alert('يجب حفظ بعض الآيات أولاً قبل بدء الاختبار');
            return;
        }

        const questions = this.generateQuestions(memorizedSurahs);
        this.showQuizModal(questions);
    }

    generateQuestions(memorizedSurahs) {
        const questions = [];
        const numQuestions = Math.min(5, memorizedSurahs.length);

        for (let i = 0; i < numQuestions; i++) {
            const randomSurah = memorizedSurahs[Math.floor(Math.random() * memorizedSurahs.length)];
            questions.push({
                surah: randomSurah,
                type: Math.random() > 0.5 ? 'name' : 'ayahs',
                correct: null
            });
        }

        return questions;
    }

    showQuizModal(questions) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        let currentQuestion = 0;
        let score = 0;

        const renderQuestion = () => {
            const question = questions[currentQuestion];
            const isNameQuestion = question.type === 'name';

            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>اختبار الحفظ</h2>
                    <div class="quiz-progress">السؤال ${currentQuestion + 1} من ${questions.length}</div>
                    <div class="quiz-question">
                        ${isNameQuestion 
                            ? `ما هو رقم سورة ${question.surah.name}؟`
                            : `كم عدد آيات سورة ${question.surah.name}؟`}
                    </div>
                    <form id="quizForm">
                        <input type="number" id="answer" required min="1" 
                            max="${isNameQuestion ? 114 : 286}" 
                            placeholder="أدخل إجابتك">
                        <button type="submit" class="button">إجابة</button>
                    </form>
                </div>
            `;

            this.setupModalListeners(modal);

            const quizForm = document.getElementById('quizForm');
            quizForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const answer = parseInt(quizForm.querySelector('#answer').value);
                const correct = isNameQuestion ? question.surah.id : question.surah.ayahs;
                
                questions[currentQuestion].correct = answer === correct;
                if (answer === correct) score++;

                if (currentQuestion < questions.length - 1) {
                    currentQuestion++;
                    renderQuestion();
                } else {
                    this.showResults(modal, score, questions);
                }
            });
        };

        document.body.appendChild(modal);
        renderQuestion();
    }

    showResults(modal, score, questions) {
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>نتائج الاختبار</h2>
                <div class="quiz-score">
                    النتيجة: ${score} من ${questions.length}
                    (${Math.round((score / questions.length) * 100)}%)
                </div>
                <div class="quiz-review">
                    ${questions.map((q, i) => `
                        <div class="quiz-answer ${q.correct ? 'correct' : 'incorrect'}">
                            سؤال ${i + 1}: ${q.correct ? 'صحيح ✓' : 'خطأ ✗'}
                        </div>
                    `).join('')}
                </div>
                <button class="button" onclick="this.closest('.modal').remove()">إغلاق</button>
            </div>
        `;
    }

    setupModalListeners(modal) {
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
}