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

