export function evaluateMathExpression(expression: string): number | null {
  if (!expression) return null;

  // Replace commas with dots for internationalization support
  let sanitized = expression.replace(/,/g, '.');

  // Basic validation: only numbers, operators, dots, and spaces
  if (!/^[0-9+\-*/. ]+$/.test(sanitized)) {
    const val = parseFloat(sanitized);
    return isNaN(val) ? null : val;
  }

  try {
    // Tokenize the expression
    const tokens: string[] = [];
    let numberBuffer = '';

    for (let i = 0; i < sanitized.length; i++) {
      const char = sanitized[i];
      if (/[0-9.]/.test(char)) {
        numberBuffer += char;
      } else if (['+', '-', '*', '/'].includes(char)) {
        if (numberBuffer) {
          tokens.push(numberBuffer);
          numberBuffer = '';
        }
        tokens.push(char);
      } else if (char === ' ') {
        if (numberBuffer) {
          tokens.push(numberBuffer);
          numberBuffer = '';
        }
      }
    }
    if (numberBuffer) {
      tokens.push(numberBuffer);
    }

    if (tokens.length === 0) return null;

    // Evaluate tokens (logic borrowed from CalculatorComponent)

    // Process * and / first (Precedence)
    let tempTokens: (number | string)[] = [];
    let i = 0;
    while (i < tokens.length) {
      const token = tokens[i];
      if (token === '*' || token === '/') {
        const prev = tempTokens.pop() as number;
        if (prev === undefined) return null;
        const nextVal = tokens[i + 1];
        if (nextVal === undefined) return null;
        const next = parseFloat(nextVal);
        if (isNaN(next)) return null;
        const result = token === '*' ? prev * next : prev / next;
        tempTokens.push(result);
        i += 2;
      } else {
        const val = parseFloat(token);
        tempTokens.push(isNaN(val) ? token : val);
        i++;
      }
    }

    // Process + and -
    if (tempTokens.length === 0) return null;
    let result = tempTokens[0];
    if (typeof result !== 'number') return null;

    let j = 1;
    while (j < tempTokens.length) {
      const op = tempTokens[j] as string;
      const nextVal = tempTokens[j + 1];
      if (nextVal === undefined || typeof nextVal !== 'number') return null;
      if (op === '+') result += nextVal;
      if (op === '-') result -= nextVal;
      j += 2;
    }

    return Number(result.toFixed(10));
  } catch (e) {
    console.error('Error evaluating expression:', expression, e);
    return null;
  }
}
