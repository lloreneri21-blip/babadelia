// ===================================
// BA-BA DE L'IA — Script principal
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM carregado! JavaScript funcionando!');
});
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

// ===== SIMULATEUR =====

const examples = {
    1: `URGENT : Votre compte bancaire a été bloqué suite à une activité suspecte détectée ce matin.

Pour débloquer votre compte IMMÉDIATEMENT, vous devez confirmer vos informations personnelles en cliquant sur ce lien : bit.ly/secure-bank-fr

⚠️ ATTENTION : Si vous ne réagissez pas dans les 24H, votre compte sera définitivement supprimé et vous perdrez l'accès à vos fonds.

Service Sécurité Bancaire`,

    2: `Bonjour,

Votre colis numéro FR28493019 est actuellement en attente dans notre entrepôt depuis 3 jours. Des frais de stockage de 2,99€ sont dus pour organiser la livraison.

Veuillez régler ces frais rapidement en cliquant sur ce lien : bit.ly/colis29x

Passé ce délai, votre colis sera retourné à l'expéditeur.

Cordialement,
La Poste`,

    3: `Bonjour,

Je vous confirme notre rendez-vous de demain mardi 20 février à 14h30 dans nos bureaux au 12 rue de la Paix.

N'hésitez pas à me contacter si vous avez des questions ou si vous souhaitez modifier l'horaire.

À demain,
Marie Dupont`,

    4: `🎉 FÉLICITATIONS ! 🎉

Vous avez été sélectionné parmi des milliers de participants pour gagner un iPhone 15 Pro Max d'une valeur de 1 299€ !

Pour réclamer votre prix GRATUITEMENT, cliquez ici MAINTENANT : goo.gl/prix-iphone

⏰ Cette offre expire dans 2 heures ! Ne manquez pas cette chance unique !

L'équipe des Grands Prix`
};

function loadExample(num) {
    const textarea = document.getElementById('message-input');
    if (textarea && examples[num]) {
        textarea.value = examples[num];
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function analyzeMessage() {
    const textarea = document.getElementById('message-input');
    const resultDiv = document.getElementById('analysis-result');

    if (!textarea || !resultDiv) return;

    const message = textarea.value.trim();

    if (message.length < 10) {
        resultDiv.innerHTML = `
            <div class="result-header warning">
                ⚠️ Veuillez entrer un message plus long pour l'analyser
            </div>`;
        return;
    }

    const msgLower = message.toLowerCase();
    const indicators = [];
    let suspicionScore = 0;

    // Mots-clés d'urgence
    const urgencyWords = ['urgent', 'immédiatement', 'maintenant', 'immédiat', 'rapidement',
        '24h', '24 heures', '48h', 'dernière chance', 'expire', 'expirer',
        'bloqué', 'suspendu', 'supprimé', 'définitivement'];
    const urgencyFound = urgencyWords.filter(w => msgLower.includes(w));
    if (urgencyFound.length > 0) {
        suspicionScore += urgencyFound.length * 15;
        indicators.push({ level: 'red', text: `⏰ Urgence artificielle détectée : "${urgencyFound.slice(0,3).join('", "')}"` });
    }

    // URLs raccourcies
    const shortUrls = ['bit.ly', 'goo.gl', 'tinyurl', 't.co', 'ow.ly', 'short.io', 'rb.gy'];
    const urlsFound = shortUrls.filter(u => msgLower.includes(u));
    if (urlsFound.length > 0) {
        suspicionScore += 30;
        indicators.push({ level: 'red', text: `🔗 URL raccourcie suspecte détectée : ${urlsFound.join(', ')}` });
    }

    // Demandes d'infos sensibles
    const sensitiveWords = ['mot de passe', 'password', 'carte bancaire', 'numéro de carte',
        'code secret', 'code pin', 'iban', 'coordonnées bancaires', 'informations personnelles',
        'sécurité sociale'];
    const sensitiveFound = sensitiveWords.filter(w => msgLower.includes(w));
    if (sensitiveFound.length > 0) {
        suspicionScore += 40;
        indicators.push({ level: 'red', text: `🔐 Demande d'informations sensibles : "${sensitiveFound[0]}"` });
    }

    // Gains / cadeaux
    const gainWords = ['gagné', 'félicitations', 'sélectionné', 'prix', 'gratuit', 'cadeau',
        'récompense', 'remboursement', 'héritage'];
    const gainsFound = gainWords.filter(w => msgLower.includes(w));
    if (gainsFound.length >= 2) {
        suspicionScore += 25;
        indicators.push({ level: 'red', text: `💰 Offre trop attractive / gain improbable` });
    }

    // Majuscules excessives
    const uppercaseRatio = (message.replace(/[^A-Z]/g, '').length / Math.max(message.replace(/[^a-zA-Z]/g, '').length, 1));
    if (uppercaseRatio > 0.2) {
        suspicionScore += 15;
        indicators.push({ level: 'yellow', text: `⚠️ Usage excessif de majuscules (technique de pression)` });
    }

    // Points d'exclamation
    const exclamCount = (message.match(/!/g) || []).length;
    if (exclamCount >= 3) {
        suspicionScore += 10;
        indicators.push({ level: 'yellow', text: `⚠️ ${exclamCount} points d'exclamation — technique d'alarmisme` });
    }

    // Frais inattendus
    const feeWords = ['frais', 'payer', 'paiement', 'règlement', '€', 'euros'];
    const feesFound = feeWords.filter(w => msgLower.includes(w));
    if (feesFound.length >= 2) {
        suspicionScore += 20;
        indicators.push({ level: 'yellow', text: `💳 Demande de paiement inattendue détectée` });
    }

    // Indicateurs positifs
    if (!urlsFound.length && !urgencyFound.length && !sensitiveFound.length) {
        indicators.push({ level: 'green', text: `✅ Aucun lien raccourci suspect détecté` });
    }
    if (message.includes('@') && message.split('@').length > 1) {
        const domain = message.split('@')[1].split(/[\s<>]/)[0];
        if (domain && domain.length > 3) {
            indicators.push({ level: 'green', text: `📧 Adresse email présente — vérifiez qu'elle correspond au domaine officiel` });
        }
    }

    // Déterminer le niveau
    let headerClass, headerText, advice;
    if (suspicionScore === 0) {
        headerClass = 'safe';
        headerText = '✅ Message d\'apparence légitime';
        advice = 'Ce message ne présente pas de signes évidents d\'arnaque. Restez cependant vigilant : vérifiez l\'expéditeur et le contexte.';
    } else if (suspicionScore < 30) {
        headerClass = 'warning';
        headerText = '⚠️ Message légèrement suspect — score : ' + Math.min(suspicionScore, 100) + '/100';
        advice = 'Quelques signaux d\'alerte ont été détectés. Vérifiez l\'expéditeur et contactez directement l\'organisation concernée avant d\'agir.';
    } else if (suspicionScore < 60) {
        headerClass = 'warning';
        headerText = '🚨 Message suspect — score : ' + Math.min(suspicionScore, 100) + '/100';
        advice = 'Plusieurs signaux d\'alerte détectés. Ne cliquez sur aucun lien et ne donnez aucune information. Signalez ce message.';
    } else {
        headerClass = 'danger';
        headerText = '🛑 ARNAQUE TRÈS PROBABLE — score : ' + Math.min(suspicionScore, 100) + '/100';
        advice = 'Ce message présente de nombreux signes caractéristiques d\'une arnaque. Ne répondez pas, ne cliquez sur rien. Signalez-le sur cybermalveillance.gouv.fr';
    }

    const indicatorsHtml = indicators.map(ind =>
        `<div class="indicator ${ind.level}">${ind.text}</div>`
    ).join('');

    resultDiv.innerHTML = `
        <div class="result-header ${headerClass}">${headerText}</div>
        <div class="result-body">
            <p><strong>Analyse :</strong> ${advice}</p>
            <div class="result-indicators">
                ${indicatorsHtml}
            </div>
            <p style="margin-top:15px;font-size:0.85rem;color:#666;">
                💡 Rappel : cet outil est pédagogique et ne remplace pas votre jugement. En cas de doute, contactez directement l'organisation concernée.
            </p>
        </div>`;

    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
