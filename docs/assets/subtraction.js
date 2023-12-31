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
        operation = '-';
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

function tableToPDF() {
    const pdf = new jspdf.jsPDF(); // Default to portrait orientation

    // Function to clone and prepare the table
    function prepareTable(hideAnswers) {
        const originalTable = document.getElementById('problems');
        const clonedTable = originalTable.cloneNode(true);

        Array.from(clonedTable.rows).forEach((row, index) => {
            const cell = row.insertCell(0);
            if (index === 0) {
                cell.textContent = 'No.'; // Header row
                cell.style.fontWeight = 'bold';
            } else {
                cell.textContent = index; // Line number
                if (hideAnswers) {
                    row.cells[row.cells.length - 2].textContent = ''; // Hide answers
                }
            }
            row.deleteCell(-1); // Remove "Action" column
        });

        return clonedTable;
    }

    const headerFooterText = "Create worksheets like this for free at www.math-problems.com!";
    const nameLine = "Name: __________________________________________________";

    function addTableToPDF(table, startY, isAnswerKey) {
        pdf.autoTable({
            html: table,
            startY: startY,
            didDrawPage: function(data) {
                const pageWidth = pdf.internal.pageSize.width;
                const margin = 10;
                const headerFooterTxtWidth = pdf.getStringUnitWidth(headerFooterText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
                const headerFooterX = (pageWidth - headerFooterTxtWidth) / 2;

                pdf.setFontSize(10);
                pdf.setTextColor(40);

                // "Answer Key" on the first page of the answer key section only
                if (isAnswerKey && data.pageNumber === 1) {
                    pdf.setFontSize(20);
                    pdf.text('Answer Key', margin, 20); // Left-aligned "Answer Key" text
                    pdf.setFontSize(10); // Reset font size
                }

                // Header and Footer
                pdf.text(headerFooterText, headerFooterX, 10);
                pdf.text(headerFooterText, headerFooterX, pdf.internal.pageSize.height - 10);

                // Name Line on the first page of the worksheet only
                if (!isAnswerKey && data.pageNumber === 1) {
                    pdf.text(nameLine, pageWidth - margin, 25, { align: 'right' });
                }
            }
        });
    }

    // Add the version of the table without answers (Worksheet)
    const worksheetTable = prepareTable(true);
    addTableToPDF(worksheetTable, 50, false);

    // Add a new page for the version of the table with answers (Answer Key)
    pdf.addPage();
    const answerKeyTable = prepareTable(false);
    addTableToPDF(answerKeyTable, 50, true);

    pdf.save('math-problems.pdf');
}

