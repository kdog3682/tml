transform the 
[
    {
        name: 'NUMBER',
        match: /\d+/,
    }
]



const TokenTypes = {
    NUMBER: "num",
    PLUS: "PLUS",
    ATOM: "atom",
    MINUS: "MINUS",
    STAR: "STAR",
    SLASH: "SLASH",
    LABEL: "LABEL",
    COLON: "COLON",
    EQUALS: "equals",
    PARENTHESIS_RIGHT: "pright",
    PARENTHESIS_LEFT: "pleft",
    EOF: "EOF",
    SPACE: "SPACE",
    WORD: "WORD",
    EXPONENT: "exp",
}
class Tokenizer {
    constructor(input) {
        this.input = input.replace(/ +/g, ' ')
        this.tokens = []
        this.cursor = 0
        this.expCount = 0
        this.labelCount = 0
        this.expIndexes = []
        this.divCount = 0
    }

    lookbehind(key) {
        let c = this.cursor
        while (c >= 0) {
            const ch = this.input[--c]
            if (ch == key) {
                return c
            }
        }
    }
    get(r) {
        let cond = testf(r)
        let word = ''
        do {
            word += this.eat()
        } while (cond(this.peek(1)))
        return word
    }
    lookahead(key) {
        let c = this.cursor
        while (c < this.input.length) {
            const ch = this.input[++c]
            if (ch == key) {
                return c
            }
        }
    }
    peek(n = 0) {
        if (isRegExp(n)) {
            const s = this.input.slice(this.cursor + 1)
            const r = RegExp('^' + n.source)
            return r.test(s)
        }
        return this.input[this.cursor + n]
    }

    eat() {
        return this.input[this.cursor++]
    }

    add(type, value = null) {
        this.tokens.push({ type, value, index: this.cursor })
    }

    tokenize() {
        while (this.cursor < this.input.length) {
            let char = this.eat()

            if (char == 'p') {
                this.add('plus', '+')
            } 
            else if (char == 't') {
                this.add('times', '*')
            } 
            else if (/[abcxyzmn]/.test(char)) {
                    if (/\d/.test(this.peek(1))) {
                        this.add('exp')
                        this.add('num', this.get(/\d+/))
                    }
                this.add('exp')
                this.expIndexes.push(this.cursor - 1)
                this.add('vlparen')
            }
            else if (/[a-z]/.test(char)) {

                else if (char in atomVariables) {
                    this.add('atom', this.get((x) => x in atomVariables))
                } else {
                    let word = this.get(/[a-z]/)
                    this.add(TokenTypes.WORD, word)
                }
            } else if (/\d/.test(char)) {
                let num = this.get(/\d/)
                if (this.peek(/\.\d/)) {
                    num += this.eat() + this.get(/\d/)
                }
                this.add(TokenTypes.NUMBER, num)
            } else if (char === "+") {
                this.add(TokenTypes.PLUS)
            } else if (char === "-") {
                this.add(TokenTypes.MINUS)
            } else if (char === "*") {
                this.add(TokenTypes.STAR)
            } else if (char === "/") {
                if (this.peek(1) == '/') {
                    this.eat()
                    this.add('superslash')
                    this.add('vrparen')
                    this.divCount += 1
                    // maybe backfix ...
                } else {
                    this.add(TokenTypes.SLASH)
                }
            } else if (char === ":") {
                this.add(TokenTypes.COLON)
                if (!this.peek(/\(/)) {
                    this.add('vrparen')
                }
                this.labelCount += 1
                // red:xe2 pg:xe3
            } else if (char === " ") {

                if (this.labelCount) {
                    for (let i = 0; i < this.labelCount; i++) {
                        this.add('vrparen')
                    }
                    this.labelCount = 0
                }
                if (this.expIndexes.length) {
                    do {
                        const currentStoreIndex = this.tokens.length
                        const expStoreIndex = findIndex(this.tokens, (x) => x.type== 'exp', -1)
                        if (currentStoreIndex - expStoreIndex > 1) {
                            insert2(this.tokens, expStoreIndex, {type: 'vlparen'})
                            this.add('vrparen')
                        }
                    } while (this.expIndexes.length)
                }
                if (this.divCount) {
                    for (let i = 0; i < this.divCount; i++) {
                        this.add('vrparen')
                    }
                    this.divCount = 0
                }
            }
        }
        return this.tokens
    }
}

// Usage
const input = "x: 10 + y:20"
const tokenizer = new Tokenizer(input)
const tokens = tokenizer.tokenize()
console.log(tokens)
