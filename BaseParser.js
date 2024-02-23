
import { Tokenizer, TokenTypes } from "./Tokenizer.js"
export {
    BaseParser,
}
class BaseParser {
    constructor(options) {
    }
    parse(input) {
        this.input = input
        this.tokenizer = new Tokenizer(input)
        this.lookahead = this.tokenizer.getNextToken()

        this.operators = {
            "^": 5,
            unary: 4,
            "*": 3,
            "/": 3,
            "÷": 3,
            "+": 2,
            "-": 2
        }

        return this.Expression()
    }
    maybeEat(tokenType) {
        const token = this.lookahead
        if (token.type == tokenType) {
            this.lookahead = this.tokenizer.getNextToken()
            return token
        }
    }

    eat(tokenType) {
        const token = this.lookahead
        if (arguments.length == 0) {
            /* returning anytthing */
            this.lookahead = this.tokenizer.getNextToken()
            return token
        }

        if (token == null) {
            throw new SyntaxError(
                `Unexpected end of input, expected "${tokenType}"`
            )
        }

        if (token.type !== tokenType) {
            throw new SyntaxError(
                `Unexpected token: "${token.value}", expected "${tokenType}"`
            )
        }

        this.lookahead = this.tokenizer.getNextToken()

        return token
    }

    getPrecedence(token, implicit) {
        // console.log({token})
        if (token === "unary") {
            return this.operators.unary
        }
        if (!token) {
            return 0
        }
        if (token.type === TokenTypes.PARENTHESIS_RIGHT) {
            // throw 'this will never be seen because it will be consumed'
            return 0
        }

        if (token.type === TokenTypes.SPACE) {
            throw 'space should never be seen'
            // this.look()
            // throw 'this space should never be seen'
            this.eat()
            return 0
            // maybe eat this
            // return 0
        }

        const prec = this.operators[token.value]
        if (this.implicit) {
            // return 0
            return 100
        }
        return prec
    }

    UnaryExpression() {
        this.eat(TokenTypes.SUBTRACTION)

        return {
            type: "UnaryExpression",
            value: this.Expression(this.getPrecedence("unary"))
        }
    }
}
