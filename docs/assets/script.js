function generateProblem() {
    const num1 = Math.floor(Math.random() * 100);
    const num2 = Math.floor(Math.random() * 100);
    const operation = Math.random() > 0.5 ? '+' : '-';
    const answer = operation === '+' ? num1 + num2 : num1 - num2;
    return { problem: `${num1} ${operation} ${num2}`, answer };
}

function toggleAnswer(event) {
    const answerSpan = event.target.parentNode.parentNode.querySelector('.answer');
    const isVisible = answerSpan.style.visibility === 'visible';
    answerSpan.style.visibility = isVisible ? 'hidden' : 'visible';
    event.target.textContent = isVisible ? 'Show' : 'Hide';
}

function displayProblems() {
    const problemsTable = document.getElementById('problems');
    let tableHTML = '<thead><tr><th>Problem</th><th>Answer</th><th>Action</th></tr></thead><tbody>';

    for (let i = 0; i < 50; i++) {
        const { problem, answer } = generateProblem();
        tableHTML += `<tr>
                          <td>${problem} = ?</td>
                          <td class="answer" style="visibility: hidden;">${answer}</td>
                          <td><button class="btn btn-sm btn-outline-primary" onclick="toggleAnswer(event)">Show</button></td>
                      </tr>`;
    }

    tableHTML += '</tbody>';
    problemsTable.innerHTML = tableHTML;
}

document.addEventListener('DOMContentLoaded', displayProblems);

