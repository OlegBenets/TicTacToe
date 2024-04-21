let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = 'circle';

function init() {
    render();
}

function render() {
    let container = document.getElementById('content');
    let table = '<table>';

    for (let i = 0; i < 3; i++) {
        table += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = fields[index] === 'circle' ? generateCircleSVG() : (fields[index] === 'cross' ? generateCrossSVG() : '');
            table += `<td onclick="addSymbol(${index}, this)">${symbol}</td>`;
        }
        table += '</tr>';
    }

    table += '</table>';
    container.innerHTML = table;
}

function highlightCurrentPlayerSymbol() {
    const circleSVG = document.getElementById('circleSVG');
    const crossSVG = document.getElementById('crossSVG');

    circleSVG.style.transition = 'opacity 0.225s ease';
    crossSVG.style.transition = 'opacity 0.225s ease';
    
    // Wenn Circle an der Reihe ist, leuchte das Circle-SVG auf und mache das Cross-SVG transparent
    if (currentPlayer === 'circle') {
        circleSVG.style.opacity = '1'; // Volle Deckkraft für das Circle-SVG
        crossSVG.style.opacity = '0.3'; // Transparent mit 30% Deckkraft für das Cross-SVG
    } else {
        // Wenn Cross an der Reihe ist, leuchte das Cross-SVG auf und mache das Circle-SVG transparent
        crossSVG.style.opacity = '1'; // Volle Deckkraft für das Cross-SVG
        circleSVG.style.opacity = '0.3'; // Transparent mit 30% Deckkraft für das Circle-SVG
    }
}
// Funktion, die prüft, ob das Spiel beendet ist
function checkGameOver() {
    const winningCombinations = [
        // Horizontale Gewinnkombinationen
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Vertikale Gewinnkombinationen
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonale Gewinnkombinationen
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            // Gewinnkombination gefunden, Rückgabe des siegreichen Symbols
            drawWinningLine(combination); // Zeichne die Linie für die Gewinnkombination
            return {
                winner: fields[a],
                combination: combination
            };
        }
    }

    // Überprüfen, ob alle Felder ausgefüllt sind (Unentschieden)
    if (fields.every(field => field)) {
        return {
            winner: 'draw'
        };
    }

    // Das Spiel ist noch nicht vorbei
    return null;
}

function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;

    const startCell = document.querySelectorAll('td')[combination[0]];
    const endCell = document.querySelectorAll('td')[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const contentRect = document.getElementById('content').getBoundingClientRect();

    const lineLength = Math.sqrt(Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2));
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = 'top left';
    document.getElementById('content').appendChild(line);
}

function restartGame() {
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];

    render();
}

function addSymbol(index, tdElement) {
    // Wenn das Spiel vorbei ist, beende die Funktion
    if (checkGameOver()) return;

    // Wenn das Feld nicht bereits markiert ist
    if (!fields[index]) {
        // Fügen Sie das Symbol des aktuellen Spielers in das Feld ein
        fields[index] = currentPlayer;
        // Generiere das entsprechende SVG-Symbol
        let symbol = fields[index] === 'circle' ? generateCircleSVG() : generateCrossSVG();
        // Füge das Symbol in das <td>-Element ein
        tdElement.innerHTML = symbol;

        // Überprüfe, ob das Spiel vorbei ist
        const gameResult = checkGameOver();
        if (gameResult) {
            // Wenn das Spiel vorbei ist, zeichne die siegreiche Linie
            if (gameResult.winner !== 'draw') {
                drawWinningLine(gameResult.combination);
            }
            // Hier kannst du weitere Logik hinzufügen, um das Spielende zu behandeln, z.B. eine Meldung anzeigen
        } else {
            // Spieler wechseln, wenn das Spiel nicht vorbei ist
            currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
            highlightCurrentPlayerSymbol(); // Hervorheben des aktuellen Symbols
        }
    }
}

function generateCircleSVG() {
    const svgCode = `
        <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="30" fill="none" stroke="#00B0FF" stroke-width="5">
                <animate attributeName="stroke-dasharray" attributeType="XML" from="0 188" to="188 0" dur="225ms" fill="freeze" />
            </circle>
        </svg>
    `;
    return svgCode;
}

function generateCrossSVG() {
    const svgCode = `
        <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="10" x2="60" y2="60" stroke="#FFC000" stroke-width="5">
                <animate attributeName="stroke-dasharray" attributeType="XML" from="0 70" to="70 0" dur="225ms" fill="freeze" />
            </line>
            <line x1="10" y1="60" x2="60" y2="10" stroke="#FFC000" stroke-width="5">
                <animate attributeName="stroke-dasharray" attributeType="XML" from="0 70" to="70 0" dur="225ms" fill="freeze" />
            </line>
        </svg>
    `;
    return svgCode;
}

// Initiales Rendern des
