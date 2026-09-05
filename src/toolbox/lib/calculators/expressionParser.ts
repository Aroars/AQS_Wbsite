/**
 * Expression Parser Module
 * Parses and evaluates mathematical expressions with PEMDAS order of operations
 * Supports named variables for formula mode
 * @module calculators/expressionParser
 */

export const ExpressionParser = {
    // Reserved words that cannot be used as variable names
    RESERVED_WORDS: ['ans', 'pi', 'e', 'sin', 'cos', 'tan', 'sqrt', 'log', 'ln', 'abs', 'floor', 'ceil', 'round'],

    /**
     * Evaluate a mathematical expression string
     * Supports: +, -, *, /, ^, %, parentheses, common math functions, and named variables
     * @param {string} expression - The expression to evaluate
     * @param {number} lastAnswer - The value of 'ans' (last result)
     * @param {Object} variables - Object mapping variable names to values (e.g., {A: 5, B: 3})
     * @returns {Object} Result object with value, error, and undefinedVars properties
     */
    evaluate(expression: string, lastAnswer: number = 0, variables: Record<string, any> = {}) {
        try {
            // Clean and preprocess expression, get undefined variables
            const preprocessResult = this.preprocess(expression, lastAnswer, variables)
            let expr = preprocessResult.expr
            const undefinedVars = preprocessResult.undefinedVars

            // If there are undefined variables, return early with pending state
            if (undefinedVars.length > 0) {
                return {
                    value: null,
                    error: null,
                    undefinedVars,
                    pending: true
                }
            }

            // Tokenize
            const tokens = this.tokenize(expr)

            // Parse and evaluate
            const result = this.parseExpression(tokens)

            if (tokens.length > 0) {
                throw new Error('Unexpected token: ' + tokens[0])
            }

            if (isNaN(result) || !isFinite(result)) {
                throw new Error('Invalid result')
            }

            return { value: result, error: null, undefinedVars: [] as string[], pending: false }
        } catch (error: any) {
            return { value: null, error: error.message, undefinedVars: [] as string[], pending: false }
        }
    },

    /**
     * Validate a variable name
     * @param {string} name - The variable name to validate
     * @returns {Object} { valid: boolean, error: string|null }
     */
    validateVariableName(name: string) {
        if (!name || name.length === 0) {
            return { valid: false, error: 'Variable name required' }
        }
        if (name.length > 2) {
            return { valid: false, error: 'Max 2 characters' }
        }
        if (!/^[a-zA-Z][a-zA-Z0-9]?$/.test(name)) {
            return { valid: false, error: 'Use letters/numbers only' }
        }
        if (this.RESERVED_WORDS.includes(name.toLowerCase())) {
            return { valid: false, error: `"${name}" is reserved` }
        }
        return { valid: true, error: null }
    },

    /**
     * Extract variable names used in an expression
     * @param {string} expression - The expression to analyze
     * @returns {Array<string>} Array of variable names found
     */
    extractVariables(expression: string): string[] {
        // Remove spaces
        let expr = expression.replace(/\s+/g, '')

        // Remove function names so they don't get picked up as variables
        const funcs = ['sin', 'cos', 'tan', 'sqrt', 'log', 'ln', 'abs', 'floor', 'ceil', 'round']
        funcs.forEach(func => {
            expr = expr.replace(new RegExp(func, 'gi'), '')
        })

        // Remove constants
        expr = expr.replace(/\bpi\b/gi, '')
        expr = expr.replace(/\bans\b/gi, '')
        // Don't remove 'e' as it could be part of a variable name

        // Find all 1-2 character variable names (letter followed by optional letter/number)
        const varMatches = expr.match(/\b[a-zA-Z][a-zA-Z0-9]?\b/g) || []

        // Filter out 'e' (Euler's number) and duplicates
        const uniqueVars = [...new Set(varMatches)].filter(v => v.toLowerCase() !== 'e')

        return uniqueVars
    },

    /**
     * Preprocess the expression string
     * @param {string} expr - Raw expression
     * @param {number} lastAnswer - Value to substitute for 'ans'
     * @param {Object} variables - Object mapping variable names to values
     * @returns {Object} { expr: string, undefinedVars: string[] }
     */
    preprocess(expr: string, lastAnswer: number, variables: Record<string, any> = {}): { expr: string, undefinedVars: string[] } {
        const undefinedVars: string[] = []

        // Remove spaces
        expr = expr.replace(/\s+/g, '')

        // Accountant-style: if expression starts with an operator, prepend 'ans'
        // This allows "/30" to mean "ans/30", "*5" to mean "ans*5", etc.
        if (/^[+\-*/%^]/.test(expr)) {
            expr = 'ans' + expr
        }

        // Replace 'ans' with last answer value (case insensitive)
        expr = expr.replace(/\bans\b/gi, `(${lastAnswer})`)

        // Replace named variables with their values
        // Sort by length descending to replace longer names first (e.g., "AB" before "A")
        const varNames = Object.keys(variables).sort((a: string, b: string) => b.length - a.length)
        varNames.forEach((varName: string) => {
            const regex = new RegExp(`\\b${varName}\\b`, 'g')
            expr = expr.replace(regex, `(${variables[varName]})`)
        })

        // Find any remaining undefined variables (1-2 char identifiers)
        // First, temporarily remove function names
        let checkExpr = expr
        const funcs = ['sin', 'cos', 'tan', 'sqrt', 'log', 'ln', 'abs', 'floor', 'ceil', 'round']
        funcs.forEach(func => {
            checkExpr = checkExpr.replace(new RegExp(func, 'gi'), '___')
        })

        // Find undefined variables
        const remainingVars = checkExpr.match(/\b[a-zA-Z][a-zA-Z0-9]?\b/g) || []
        remainingVars.forEach((varName: string) => {
            // Skip if it's pi or e (constants)
            if (varName.toLowerCase() === 'pi' || varName.toLowerCase() === 'e') {
                return
            }
            if (!undefinedVars.includes(varName)) {
                undefinedVars.push(varName)
            }
        })

        // Handle implied multiplication: 2(3) -> 2*(3), (2)(3) -> (2)*(3)
        expr = expr.replace(/(\d)\(/g, '$1*(')
        expr = expr.replace(/\)(\d)/g, ')*$1')
        expr = expr.replace(/\)\(/g, ')*(')

        // Handle math functions - implied multiplication before functions
        funcs.forEach(func => {
            const regex = new RegExp(`(\\d)(${func})`, 'gi')
            expr = expr.replace(regex, '$1*$2')
        })

        // Replace constants
        expr = expr.replace(/\bpi\b/gi, Math.PI.toString())
        expr = expr.replace(/\be\b/gi, Math.E.toString())

        // Replace ** with ^ for power
        expr = expr.replace(/\*\*/g, '^')

        return { expr, undefinedVars }
    },

    /**
     * Tokenize the expression into an array of tokens
     * @param {string} expr - Preprocessed expression
     * @returns {Array} Array of tokens
     */
    tokenize(expr: string): any[] {
        const tokens: any[] = []
        let i = 0

        while (i < expr.length) {
            const char = expr[i]

            // Number (including decimals and negative at start)
            if (/\d/.test(char) || (char === '.' && /\d/.test(expr[i + 1]))) {
                let num = ''
                while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) {
                    num += expr[i]
                    i++
                }
                tokens.push({ type: 'number', value: parseFloat(num) })
                continue
            }

            // Operators
            if ('+-*/^%'.includes(char)) {
                tokens.push({ type: 'operator', value: char })
                i++
                continue
            }

            // Parentheses
            if (char === '(') {
                tokens.push({ type: 'lparen' })
                i++
                continue
            }
            if (char === ')') {
                tokens.push({ type: 'rparen' })
                i++
                continue
            }

            // Functions
            const funcMatch = expr.slice(i).match(/^(sin|cos|tan|sqrt|log|ln|abs|floor|ceil|round)/i)
            if (funcMatch) {
                tokens.push({ type: 'function', value: funcMatch[1].toLowerCase() })
                i += funcMatch[1].length
                continue
            }

            throw new Error(`Unknown character: ${char}`)
        }

        return tokens
    },

    /**
     * Parse and evaluate expression (handles addition and subtraction)
     * @param {Array} tokens - Token array (modified in place)
     * @returns {number} Result
     */
    parseExpression(tokens: any[]): number {
        let left = this.parseTerm(tokens)

        while (tokens.length > 0 && tokens[0].type === 'operator' && '+-'.includes(tokens[0].value)) {
            const op = tokens.shift().value
            const right = this.parseTerm(tokens)

            if (op === '+') {
                left = left + right
            } else {
                left = left - right
            }
        }

        return left
    },

    /**
     * Parse term (handles multiplication, division, modulo)
     * @param {Array} tokens - Token array
     * @returns {number} Result
     */
    parseTerm(tokens: any[]): number {
        let left = this.parsePower(tokens)

        while (tokens.length > 0 && tokens[0].type === 'operator' && '*/%'.includes(tokens[0].value)) {
            const op = tokens.shift().value
            const right = this.parsePower(tokens)

            if (op === '*') {
                left = left * right
            } else if (op === '/') {
                if (right === 0) {
                    throw new Error('Division by zero')
                }
                left = left / right
            } else {
                left = left % right
            }
        }

        return left
    },

    /**
     * Parse power (handles exponentiation, right-associative)
     * @param {Array} tokens - Token array
     * @returns {number} Result
     */
    parsePower(tokens: any[]): number {
        let base = this.parseUnary(tokens)

        if (tokens.length > 0 && tokens[0].type === 'operator' && tokens[0].value === '^') {
            tokens.shift()
            const exp = this.parsePower(tokens) // Right-associative
            base = Math.pow(base, exp)
        }

        return base
    },

    /**
     * Parse unary operators (handles negative numbers)
     * @param {Array} tokens - Token array
     * @returns {number} Result
     */
    parseUnary(tokens: any[]): number {
        if (tokens.length > 0 && tokens[0].type === 'operator' && tokens[0].value === '-') {
            tokens.shift()
            return -this.parsePrimary(tokens)
        }
        if (tokens.length > 0 && tokens[0].type === 'operator' && tokens[0].value === '+') {
            tokens.shift()
            return this.parsePrimary(tokens)
        }
        return this.parsePrimary(tokens)
    },

    /**
     * Parse primary (numbers, parentheses, functions)
     * @param {Array} tokens - Token array
     * @returns {number} Result
     */
    parsePrimary(tokens: any[]): number {
        if (tokens.length === 0) {
            throw new Error('Unexpected end of expression')
        }

        const token = tokens[0]

        // Number
        if (token.type === 'number') {
            tokens.shift()
            return token.value
        }

        // Function
        if (token.type === 'function') {
            tokens.shift()

            // Expect opening paren
            if (tokens.length === 0 || tokens[0].type !== 'lparen') {
                throw new Error(`Expected ( after ${token.value}`)
            }
            tokens.shift()

            // Get argument
            const arg = this.parseExpression(tokens)

            // Expect closing paren
            if (tokens.length === 0 || tokens[0].type !== 'rparen') {
                throw new Error('Missing closing parenthesis')
            }
            tokens.shift()

            // Apply function
            return this.applyFunction(token.value, arg)
        }

        // Parenthesized expression
        if (token.type === 'lparen') {
            tokens.shift()
            const result = this.parseExpression(tokens)

            if (tokens.length === 0 || tokens[0].type !== 'rparen') {
                throw new Error('Missing closing parenthesis')
            }
            tokens.shift()

            return result
        }

        throw new Error(`Unexpected token: ${JSON.stringify(token)}`)
    },

    /**
     * Apply a math function to an argument
     * @param {string} funcName - Function name
     * @param {number} arg - Argument value
     * @returns {number} Result
     */
    applyFunction(funcName: string, arg: number): number {
        switch (funcName) {
            case 'sin': return Math.sin(arg)
            case 'cos': return Math.cos(arg)
            case 'tan': return Math.tan(arg)
            case 'sqrt':
                if (arg < 0) throw new Error('Cannot take square root of negative number')
                return Math.sqrt(arg)
            case 'log': return Math.log10(arg)
            case 'ln': return Math.log(arg)
            case 'abs': return Math.abs(arg)
            case 'floor': return Math.floor(arg)
            case 'ceil': return Math.ceil(arg)
            case 'round': return Math.round(arg)
            default:
                throw new Error(`Unknown function: ${funcName}`)
        }
    },

    /**
     * Format a number for display
     * @param {number} value - The value to format
     * @param {number} precision - Maximum decimal places
     * @returns {string} Formatted number string
     */
    formatResult(value: number, precision: number = 10): string {
        if (Number.isInteger(value)) {
            return value.toString()
        }

        // Use toPrecision for very large or small numbers
        if (Math.abs(value) >= 1e10 || (Math.abs(value) < 1e-6 && value !== 0)) {
            return value.toExponential(6)
        }

        // Round to precision decimal places and remove trailing zeros
        const rounded = parseFloat(value.toFixed(precision))
        return rounded.toString()
    },

    /**
     * Build a variables object from formula calculator history
     * @param {Array} history - Array of history entries with optional variable property
     * @returns {Object} Object mapping variable names to their values
     */
    buildVariablesFromHistory(history: any[]): Record<string, any> {
        const variables: Record<string, any> = {}
        history.forEach((entry: any) => {
            if (entry.variable && entry.result !== null && !entry.pending) {
                variables[entry.variable] = entry.result
            }
        })
        return variables
    },

    /**
     * Find entries that depend on a given variable
     * @param {Array} history - Array of history entries
     * @param {string} varName - Variable name to check dependencies for
     * @returns {Array<number>} Indices of entries that use this variable
     */
    findDependents(history: any[], varName: string): number[] {
        const dependents: number[] = []
        history.forEach((entry: any, index: number) => {
            const usedVars = this.extractVariables(entry.expression)
            if (usedVars.includes(varName)) {
                dependents.push(index)
            }
        })
        return dependents
    },

    /**
     * Detect circular dependencies in history
     * @param {Array} history - Array of history entries
     * @returns {Array<string>} Array of variable names involved in circular dependencies
     */
    detectCircularDependencies(history: any[]): string[] {
        const circular: string[] = []

        // Build dependency graph
        const deps: Record<string, string[]> = {}
        history.forEach((entry: any) => {
            if (entry.variable) {
                deps[entry.variable] = this.extractVariables(entry.expression)
            }
        })

        // Check each variable for circular dependencies using DFS
        const visited = new Set<string>()
        const recursionStack = new Set<string>()

        const hasCycle = (varName: string): boolean => {
            if (recursionStack.has(varName)) {
                return true
            }
            if (visited.has(varName)) {
                return false
            }

            visited.add(varName)
            recursionStack.add(varName)

            const dependencies = deps[varName] || []
            for (const dep of dependencies) {
                if (deps[dep] && hasCycle(dep)) {
                    if (!circular.includes(varName)) {
                        circular.push(varName)
                    }
                    return true
                }
            }

            recursionStack.delete(varName)
            return false
        }

        Object.keys(deps).forEach((varName: string) => {
            if (hasCycle(varName)) {
                if (!circular.includes(varName)) {
                    circular.push(varName)
                }
            }
        })

        return circular
    }
}
