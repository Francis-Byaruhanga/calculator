// ============================================================
//  PART 1 — PURE MATH FUNCTIONS
//  These know nothing about the DOM. They just take numbers
//  and return numbers. Easy to test in the browser console.
// ============================================================

function add(a, b) 
{
    return a + b;
}

function subtract(a, b)
{
    return a - b;
}

function multiply(a, b)
{
    return a * b;
}

function divide(a, b)
{
    if (b === 0) return 'ERR: DIV/0'; // Guard against division by zero
    return a / b
}

/**
 * operate - dispatches to the correct math function.
 * @param {string} operator     One of: '+', '-', '*', '/'
 * @param {number} a            First operand
 * @param {number} b            Second operand
 * @returns {number | string}   Result, or an error string.
 */

function operate(operator, a, b) 
{
    switch (operator) {
        case '+': return add(a, b);
        case '-': return subtract(a, b);
        case '*': return multiply(a, b);
        case '/': return divide(a, b);
        default: return null;
    }
}

/**
 * roundResult - prevents long floating point tails like 0.30000000000004
 * by rounding to at most 10 significant digits.
 */

function roundResult(value)
{
    //parseFloat removes any trailing zeros that Number.toPrecision adds
    return parseFloat(parseFloat(value).toPrecision(10));
}

// ============================================================
//  PART 2 — CALCULATOR STATE & DOM
// ============================================================

// ---- STATE ----
// These variables hold everything together the calculator "knows" at any moment.
let firstOperand = null; // the first number entered.
let secondOperand = null; // the second number entered.
let currentOperator = null; // the operator selected 
let displayValue = '0'; // What's currently being displayed
let shouldResetDisplay = false; // Flag: next digit press starts afresh

// ---- DOM REFERENCES ----
// Grab elements once, store them in variables — faster than querying every time.
const expressionE1  = document.getElementById('expression');
const resultE1      = document.getElementById('result');
const allButtons    = document.querySelectorAll('.btn');

// ============================================================
//  DISPLAY HELPERS
// ============================================================

function updateDisplay() 
{
    expressionE1.textContent = displayValue;
    // Shrink font if the number gets very long
    if (displayValue.length > 9) 
    {
        expressionE1.style.fontSize = 'clamp(1rem, 5vw, 1.3rem)';
    } 
    else
    {
        expressionE1.style.fontSize = ''; // Revert to CSS default
    }
}

function setResult(value) {
    resultE1.textContent = value !== null ? String(value) : '';
}

// ============================================================
//  INPUT HANDLERS
// ============================================================

function handleDigit(digit)
{
    // If the previous actions was '=' or an operator result, start afresh.
    if (shouldResetDisplay)
    {
        displayValue = digit === '.' ? '0.' : digit;
        shouldResetDisplay = false;
    } 
    else 
    {
        // Prevent multiple decimal points
        if (digit === '.' && displayValue.includes('.')) return;

        // Replace the initial '0' when a digit is typed, but keep '0' for '0.'
        if (displayValue === '0' && digit !== '.')
        {
            displayValue = digit;
        }
        else
        {
            // Limit input length to avoid display overflow
            if (displayValue.length >= 12) return;
            displayValue += digit;
        }
    }
    updateDisplay();
}

function handleOperator(operator) 
{
    const currentValue = parseFloat(displayValue); // convert string -> number

    // If we already have a pending operation, evaluate it first
    // (handles the "12 + 7 -" chaining described in the spec)
    if (currentOperator !== null && !shouldResetDisplay)
    {
        const result = operate(currentOperator, firstOperand, currentValue);

        if (typeof result === 'string')
        {
            // It's an error (division by zero)
            displayValue = result;
            updateDisplay();
            clearState();
            return;
        }

        const rounded = roundResult(result);
        displayValue = String(rounded);
        firstOperand = rounded;
        updateDisplay();
        setResult('');
    }
    else
    {
        // First operator press - just store the current number 
        firstOperand = currentValue;
    }

    currentOperator = operator;
    shouldResetDisplay = true; // next digit will start a fresh second number

    // Highlight the active operator button
    highlightOperator(operator);
}

function handleEquals() {
    // Guard: we need both operands and an operator
    if (currentOperator === null || shouldResetDisplay) return;

    const currentValue = parseFloat(displayValue);
    const result = operate(currentOperator, firstOperand, currentValue);

    if (typeof result === 'string')
    {
        displayValue = result;
        updateDisplay();
        clearState();
        return;
    }
}

const rounded = roundResult(result);
 
// Show the full expression in the smaller line above the result
const operatorSymbol = { '+': '+', '-': '-', '*': '×', '/':'÷'}[currentOperator];
setResult(`${firstOperand} ${operatorSymbol} $(currentValue) =`);

displayValue        = String(rounded);
firstOperand        = rounded; // allow chaining: result becomes new firstOperand
currentOperator     = null;
secondOperand       = null;
shouldResetDisplay = true;     // next digit starts a new calculation

updateDisplay();
clearOperatorHighlight();

function handleClear()
{
    clearState();
    displayValue = '0';
    updateDisplay();
    setResult('');
}