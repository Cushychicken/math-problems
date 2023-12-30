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

function tableToPDF() {
    const pdf = new jspdf.jsPDF(); // Default to portrait orientation

    // Get the original table and clone it
    const originalTable = document.getElementById('problems');
    const clonedTable = originalTable.cloneNode(true);

    // Remove the "Action" column from each row in the cloned table
    Array.from(clonedTable.rows).forEach(row => {
        row.deleteCell(-1); // Assuming the "Action" column is the last one
    });

    // Header, Footer, and Name Line Text
    const headerFooterText = "Create worksheets like this for free at www.math-problems.com!";
    const nameLine = "Name: __________________________________________________";
    const nameLinePositionY = 25; // Vertical position for the name line
    const tableStartPositionY = 50; // Adjusted start position for the table

    let isFirstPage = true; // Flag to check if it's the first page

    // Generate PDF with header, footer, and name line on the first page
    pdf.autoTable({
        html: clonedTable,
        startY: tableStartPositionY, // Start the table below the name line
        didDrawPage: function(data) {
            // Settings for header, footer, and name line
            pdf.setFontSize(10);
            pdf.setTextColor(40);
            const pageWidth = pdf.internal.pageSize.width;
            const margin = 10; // Define the margin for right alignment
            const headerFooterTxtWidth = pdf.getStringUnitWidth(headerFooterText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
            const headerFooterX = (pageWidth - headerFooterTxtWidth) / 2; // Center alignment for header/footer

            // Header
            pdf.text(headerFooterText, headerFooterX, 10);

            // Name Line on the first page only
            if (isFirstPage) {
                const nameLineX = pageWidth - margin; // Right alignment for name line
                pdf.text(nameLine, nameLineX, nameLinePositionY, { align: 'right' }); // Right-aligned name line
                isFirstPage = false; // Set the flag to false after drawing on the first page
            }

            // Footer
            pdf.text(headerFooterText, headerFooterX, pdf.internal.pageSize.height - 10);
        }
    });

    pdf.save('math-problems.pdf');
}
