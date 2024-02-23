export { TokenTypes, Tokenizer }

function fix(tokenValue, type) {
    const  ref = {
        'e': '^',
        't': '*',
        'p': '+',
        'd': '÷',
        'div': '÷',
    }
    if (ref.hasOwnProperty(tokenValue)) {
        return ref[tokenValue]
    }
    return tokenValue
}

const TokenTypes = {
    VAR: "VAR",
    PRINT: "PRINT",
    LABEL: "LABEL",
    NUMBER: "NUMBER",
    EQUALS: "EQUALS",
    CHAR: "CHAR",
    IDENTIFIER: "IDENTIFIER",
    ADDITION: "+",
    SPACE: "SPACE",
    SUBTRACTION: "-",
    DIVISION: "div",
    // EOF: "EOF",
    MULTIPLICATION: "*",
    FRACTION: "/",
    EXPONENTIATION: "^",
    PARENTHESIS_LEFT: "(",
    PARENTHESIS_RIGHT: ")",
    SEMICOLON: ";",
    ASSIGNMENT: "="
}

const TokenSpec = [
    [/^\s+/, TokenTypes.SPACE],
    [/^(?:\d+(?:\.\d*)?|\.\d+)/, TokenTypes.NUMBER],
    // [/^\bvar\b/, TokenTypes.VAR],
    // [/^\bprint\b/, TokenTypes.PRINT],
    // [/^[a-z]+/, TokenTypes.IDENTIFIER],
    [/^\+/, TokenTypes.ADDITION],
    [/^p/, TokenTypes.ADDITION],
    [/^d(?:iv)?/, TokenTypes.DIVISION],
    [/^e/, TokenTypes.EXPONENTIATION],
    [/^t/, TokenTypes.MULTIPLICATION],
    [/^(\w+):/, TokenTypes.LABEL],
    [/^[abcmnxyz]/, TokenTypes.CHAR],
    [/^\-/, TokenTypes.SUBTRACTION],
    [/^\*/, TokenTypes.MULTIPLICATION],
    [/^\//, TokenTypes.FRACTION],
    [/^\^/, TokenTypes.EXPONENTIATION],
    [/^\(/, TokenTypes.PARENTHESIS_LEFT],
    [/^\)/, TokenTypes.PARENTHESIS_RIGHT],
    [/^;/, TokenTypes.SEMICOLON],
    [/^\=/, TokenTypes.ASSIGNMENT]
    [/^\=/, TokenTypes.EQUALS]
]

class Tokenizer {
    constructor(input) {
        this.input = input
        this.cursor = 0
    }

    hasMoreTokens() {
        return this.cursor < this.input.length
    }

    match(regex, inputSlice) {
        const matched = regex.exec(inputSlice)
        if (matched === null) {
            return null
        }

        this.cursor += matched[0].length
        return matched[1] || matched[0]
    }

    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null
        }

        const inputSlice = this.input.slice(this.cursor)

        for (let [regex, type] of TokenSpec) {
            const tokenValue = this.match(regex, inputSlice)

            // No rule was matched!
            if (tokenValue === null) {
                continue
            }

            // Skip whitespace!
            if (type === null) {
                return this.getNextToken()
            }

            return {
                type,
                value: fix(tokenValue, type)
            }
        }

        throw new SyntaxError(`Unexpected token: "${inputSlice[0]}"`)
    }

    printAllTokens() {
        let token
        while ((token = this.getNextToken())) {
            console.log(token)
        }
    }
}
