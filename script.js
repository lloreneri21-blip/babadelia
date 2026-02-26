// ===================================
// BA-BA DE L'IA — Script principal
// ===================================

// ===== QUIZ =====
let score = 0;
let answeredQuestions = new Set();

// Nombre total de questions détecté dynamiquement
function getTotalQuestions() {
    return document.querySelectorAll('.quiz-question').length;
}

function checkAnswer(button, isCorrect, questionId) {
    // Empêcher de répondre plusieurs fois
    if (answeredQuestions.has(questionId)) return;
    answeredQuestions.add(questionId);

    const question = button.closest('.quiz-question');
    const feedbackEl = document.getElementById('feedback-' + questionId);
    const allOptions = question.querySelectorAll('.quiz-option');

    // Désactiver tous les boutons de cette question
    allOptions.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'default';
    });

    // Marquer la bonne et la mauvaise réponse
    if (isCorrect) {
        button.classList.add('correct');
        score++;
        if (feedbackEl) {
            feedbackEl.textContent = '✅ Bonne réponse ! Excellent !';
            feedbackEl.className = 'quiz-feedback show correct-fb';
        }
    } else {
        button.classList.add('incorrect');
        // Montrer la bonne réponse
        allOptions.forEach(btn => {
            if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('true')) {
                btn.classList.add('correct');
            }
        });
        if (feedbackEl) {
            feedbackEl.textContent = '❌ Mauvaise réponse. La réponse correcte est surlignée en vert.';
            feedbackEl.className = 'quiz-feedback show incorrect-fb';
        }
    }

    // Mettre à jour le score
    updateScore();

    // Vérifier si toutes les questions ont été répondues
    const total = getTotalQuestions();
    if (answeredQuestions.size === total) {
        setTimeout(showFinalResults, 700);
    }
}

function updateScore() {
    const total = getTotalQuestions();
    const scoreEl = document.getElementById('score');
    const totalEl = document.getElementById('total');
    const progressFill = document.getElementById('progress-fill');

    if (scoreEl) scoreEl.textContent = score;
    if (totalEl) totalEl.textContent = total;
    if (progressFill) {
        const percent = (answeredQuestions.size / total) * 100;
        progressFill.style.width = percent + '%';
    }
}

function showFinalResults() {
    const total = getTotalQuestions();
    const finalResultsEl = document.getElementById('final-results');
    const finalScoreEl = document.getElementById('final-score');
    const scoreMessageEl = document.getElementById('score-message');

    if (!finalResultsEl) return;

    finalResultsEl.style.display = 'block';
    if (finalScoreEl) finalScoreEl.textContent = score;

    const percent = (score / total) * 100;
    let message = '';

    if (percent === 100) {
        message = '🏆 Score parfait ! Vous êtes un expert de la cybersécurité ! Partagez vos connaissances avec votre entourage.';
    } else if (percent >= 80) {
        message = '🌟 Excellent résultat ! Vous maîtrisez très bien les risques liés à l\'IA. Continuez à vous former !';
    } else if (percent >= 60) {
        message = '👍 Bon résultat ! Vous avez de bonnes bases. Relisez les sections où vous avez eu des erreurs pour progresser.';
    } else if (percent >= 40) {
        message = '📚 Résultat moyen. Nous vous conseillons de relire attentivement les sections du site avant de retenter le quiz.';
    } else {
        message = '💪 Ne vous découragez pas ! Parcourez le site depuis le début pour mieux comprendre les enjeux de l\'IA.';
    }

    if (scoreMessageEl) scoreMessageEl.textContent = message;

    finalResultsEl.scrollIntoView({ behavior: 'smooth' });
}

function resetQuiz() {
    score = 0;
    answeredQuestions.clear();

    // Réinitialiser tous les boutons
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'incorrect');
        btn.style.cursor = 'pointer';
    });

    // Cacher les feedbacks
    document.querySelectorAll('.quiz-feedback').forEach(fb => {
        fb.className = 'quiz-feedback';
        fb.textContent = '';
    });

    // Cacher les résultats finaux
    const finalResultsEl = document.getElementById('final-results');
    if (finalResultsEl) finalResultsEl.style.display = 'none';

    updateScore();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}



 

 

  

  

// ===== CHECKLIST avec sauvegarde localStorage =====
function initChecklist() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    checkboxes.forEach(cb => {
        // Restaurer l'état
        const saved = localStorage.getItem('checklist_' + cb.id);
        if (saved === 'true') {
            cb.checked = true;
        }
        // Sauvegarder au changement
        cb.addEventListener('change', () => {
            localStorage.setItem('checklist_' + cb.id, cb.checked);
        });
    });
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le score du quiz
    updateScore();

    // Initialiser la checklist
    initChecklist();

    // ✅ CORRIGÉ : Bouton analyser via event listener (plus robuste que onclick inline)
    const btnAnalyze = document.getElementById('btn-analyze');
    if (btnAnalyze) {
        btnAnalyze.addEventListener('click', analyzeMessage);
    }

    // ✅ CORRIGÉ : Exemples via event listeners
    document.querySelectorAll('.example-card').forEach(card => {
        card.addEventListener('click', () => {
            const num = parseInt(card.getAttribute('data-example'));
            if (num) loadExample(num);
        });
    });

    // Animations au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .quiz-question, .step-card, .resource-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(el);
    });
});
