function toggleAnswer(event) {
    const answerSpan = event.target.parentNode.parentNode.querySelector('.answer');
    const isVisible = answerSpan.style.visibility === 'visible';
    answerSpan.style.visibility = isVisible ? 'hidden' : 'visible';
    event.target.textContent = isVisible ? 'Show' : 'Hide';
}

function generateProblem(min, max, positiveAnswersOnly, operations, integerOnly) {
    let num1, num2, operation, answer;
    do {
        num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        num2 = Math.floor(Math.random() * (max - min + 1)) + min;

        operation = operations[Math.floor(Math.random() * operations.length)];

        switch (operation) {
            case '+':
                answer = num1 + num2;
                break;
            case '-':
                answer = num1 - num2;
                break;
            case '*':
                answer = num1 * num2;
                break;
            case '/':
                if (integerOnly) {
                    // Adjust num1 and num2 to ensure integer division
                    num1 = num1 * num2; // This ensures the division result is an integer
                }
                // Ensure no division by zero
                num2 = num2 === 0 ? 1 : num2;
                answer = Math.floor(num1 / num2);
                break;
        }
    } while ((positiveAnswersOnly && answer < 0) || (integerOnly && !Number.isInteger(answer)));

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
        const { problem, answer } = generateProblem(minNumber, maxNumber, positiveAnswersOnly, ['+'], true);
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

function prepareTable(hideAnswers) {
    const originalTable = document.getElementById('problems');
    const newTable = document.createElement('table');
    newTable.className = originalTable.className; // Copy classes from the original table

    // Style for spacing
    newTable.style.borderCollapse = 'separate';
    newTable.style.borderSpacing = '10px'; // Horizontal and vertical spacing

    let newRow, problemNumber = 1;
    Array.from(originalTable.rows).forEach((row, index) => {
        if (index === 0) return; // Skip the header row of the original table

        // Start a new row for every 4 problems
        if ((problemNumber - 1) % 4 === 0) {
            newRow = newTable.insertRow(-1);
        }

        const problemCell = newRow.insertCell(-1);
        problemCell.style.width = '25%'; // Each problem takes up 25% of the row width
        problemCell.style.verticalAlign = 'top'; // Align content to the top

        // Corrected formatting for problem number
        let problemContent = `<span style="font-weight: bold; text-decoration: underline;">${problemNumber}:</span><br>${row.cells[0].textContent}`;
        if (!hideAnswers) {
            problemContent += ` Answer: (${row.cells[1].textContent})`;
        }
        problemContent += '<br><br>'; // Add two additional line breaks for spacing
        problemCell.innerHTML = problemContent;

        problemNumber++;
    });

    return newTable;
}

function tableToPDF() {
    const pdf = new jspdf.jsPDF(); // Default to portrait orientation

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

