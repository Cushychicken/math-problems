function toggleAnswer(event) {
    const answerSpan = event.target.parentNode.parentNode.querySelector('.answer');
    const isVisible = answerSpan.style.visibility === 'visible';
    answerSpan.style.visibility = isVisible ? 'hidden' : 'visible';
    event.target.textContent = isVisible ? 'Show' : 'Hide';
}

function generateProblem(min, max, positiveAnswersOnly) {
    let num1, num2, operation, answer;
    do {
        num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        num2 = Math.floor(Math.random() * (max - min + 1)) + min;
        operation = Math.random() > 0.5 ? '+' : '-';
        answer = operation === '+' ? num1 + num2 : num1 - num2;
    } while (positiveAnswersOnly && answer < 0);

    return { problem: `${num1} ${operation} ${num2}`, answer };
}

function displayProblems() {
    const minNumber = parseInt(document.getElementById('minNumber').value, 10);
    const maxNumber = parseInt(document.getElementById('maxNumber').value, 10);
    const numProblems = parseInt(document.getElementById('numProblems').value, 10);
    const positiveAnswersOnly = document.getElementById('positiveAnswersOnly').checked;
    const problemsTable = document.getElementById('problems');
    let tableHTML = '<thead><tr><th>Problem</th><th>Answer</th><th>Action</th></tr></thead><tbody>';

    for (let i = 0; i < numProblems; i++) {
        const { problem, answer } = generateProblem(minNumber, maxNumber, positiveAnswersOnly);
        tableHTML += `<tr>
                          <td>${problem} = ?</td>
                          <td class="answer" style="visibility: hidden;">${answer}</td>
                          <td><button class="btn btn-sm btn-outline-primary" onclick="toggleAnswer(event)">Show</button></td>
                      </tr>`;
    }

    tableHTML += '</tbody>';
    problemsTable.innerHTML = tableHTML;
}

// Initialize with default values on page load
document.addEventListener('DOMContentLoaded', displayProblems);

