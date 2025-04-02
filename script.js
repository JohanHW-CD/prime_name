// Count entries
let count = 0;

// Default names to be processed when the page loads
const predefinedInputs = ["Johan", "Scooby Doo", "Jesus Christ", "Sherlock Holmes", "Doctor Watson"];

// Converts a string into an array of numbers (a=1, b=2, ..., z=26)
function stringToValues(str) {
    const values = [];
    for (let char of str.toLowerCase()) {
        if (char >= 'a' && char <= 'z') {
            // push = append, using ascii count: a=1, b=2, ..., z=26
            values.push(char.charCodeAt(0) - 96);
        }
    }
    return values;
}

// Primility test
function isPrime(n) {
    if (n < 2) return false; 
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true; // Prime if no divisors found
}

// Calculates sum, product, and checks if sum is prime for a given string
function calculate(str) {
    const values = stringToValues(str);
    const sum = values.reduce((a, b) => a + b, 0); // cool notation
    const product = values.reduce((a, b) => a * b, values.length > 0 ? 1 : 0);
    return { sum, product, isPrime: isPrime(sum) };
}

// Toggles visibility of the math explanation square (hidden by default)
function toggleBreakdown(button) {
    const div = button.nextElementSibling; 
    div.style.display = (div.style.display === "none") ? "block" : "none";
}

// Adds a new row to the table with all the computed information
function addToTable(input) {
    count++;
    const { sum, product, isPrime } = calculate(input); 
    const values = stringToValues(input);
    const breakdown = values.map(v => `${v} (${String.fromCharCode(v + 96)})`).join(" + ") + " = " + sum;

    // Display if sum is prime
    const sumText = isPrime ? `Sum: ${sum} (prime)` : `Sum: ${sum}`;
    const productText = `Product: ${product}`;

    // Get the table and insert a new row at the top
    const table = document.querySelector("#historyTable tbody");
    const row = table.insertRow(0);

    // Fill the row with data
    row.innerHTML = `
        <td>${count}</td>
        <td>${input}</td>
        <td>
            ${sumText}<br>${productText}
            <br>
            <button onclick="toggleBreakdown(this)">&#9660;</button>
            <div class="breakdown" style="display:none;">${breakdown}</div>
        </td>`;
}

// Displays the most recent input result at the top
function displayRecentInput(input) {
    const { sum, isPrime } = calculate(input);
    const recentInputDisplay = document.getElementById("recentInputDisplay");
    // Show sum and whether it's prime
    recentInputDisplay.innerHTML = `${input} — Sum: ${sum} ${isPrime ? '(prime)' : ''}`;
    
    // Animate the display (small pulse effect)
    recentInputDisplay.classList.add("animate");
    setTimeout(() => recentInputDisplay.classList.remove("animate"), 300);

    // Trigger celebration if sum is prime
    if (isPrime) triggerCelebration();
}

// Flashes the screen and throws confetti if the sum is prime
function triggerCelebration() {
    // Flash effect
    const celebration = document.getElementById("celebration");
    celebration.classList.add("celebrate");
    setTimeout(() => celebration.classList.remove("celebrate"), 500);

    // Confetti animation
    confetti({
        particleCount: 300,
        spread: 120,
        angle: 90,
        origin: { y: 0.5 },
        colors: ['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#ff00ff']
    });
}

// Automatically populate the table with the predefined names
predefinedInputs.forEach(input => {
    addToTable(input);
});

// Display the first predefined input result in the "recent input" area
displayRecentInput(predefinedInputs[0]);

// Press Enter runs the program
document.getElementById("inputField").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        const input = this.value.trim(); // Get the input and remove extra spaces
        if (input) { // Only proceed if not empty
            addToTable(input); // Add to history
            displayRecentInput(input); // Display as recent
            this.value = ""; // Clear input field
        }
    }
});
