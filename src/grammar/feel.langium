grammar Feel

// ============================================================
// Entry Rule
// ============================================================

entry FeelDocument:
    (expressions+=Expression)*;

// ============================================================
// Expressions (ordered by precedence, lowest first)
// ============================================================

Expression:
    Disjunction;

Disjunction infers Expression:
    Conjunction ({infer BinaryExpression.left=current} op='or' right=Conjunction)*;

Conjunction infers Expression:
    Comparison ({infer BinaryExpression.left=current} op='and' right=Comparison)*;

// Comparison handles =, !=, <, >, <=, >= plus 'between', 'in', 'instance of' as suffix
Comparison infers Expression:
    Addition (
        {infer BinaryExpression.left=current}
            op=('=' | '!=' | '<' | '>' | '<=' | '>=')
            right=Addition
        | {infer BetweenExpression.value=current}
            'between' low=Addition 'and' high=Addition
        | {infer InExpression.value=current}
            'in' tests+=PositiveUnaryTest (',' tests+=PositiveUnaryTest)*
        | {infer InstanceOf.value=current}
            'instance' 'of' typeName=QualifiedName
    )?;

Addition infers Expression:
    Multiplication ({infer BinaryExpression.left=current}
        op=('+' | '-')
        right=Multiplication
    )*;

Multiplication infers Expression:
    Exponentiation ({infer BinaryExpression.left=current}
        op=('*' | '/')
        right=Exponentiation
    )*;

Exponentiation infers Expression:
    UnaryExpr ({infer BinaryExpression.left=current}
        op='**'
        right=UnaryExpr
    )*;

UnaryExpr infers Expression:
    {infer UnaryExpression} op='-' operand=UnaryExpr
    | {infer NotExpression} 'not' '(' operand=Expression ')'
    | PostfixExpression;

PostfixExpression infers Expression:
    PrimaryExpression (
        {infer DotExpression.receiver=current} '.' member=ID
        | {infer FunctionCall.callee=current} '(' (args+=Expression (',' args+=Expression)*)? ')'
        | {infer FilterExpression.source=current} '[' filter=Expression ']'
    )*;

PrimaryExpression infers Expression:
    '(' Expression ')'
    | IfExpression
    | ForExpression
    | QuantifiedExpression
    | FunctionDefinition
    | ContextLiteral
    | ListLiteral
    | Literal;

// ============================================================
// Control Flow
// ============================================================

IfExpression:
    'if' condition=Expression 'then' thenBranch=Expression 'else' elseBranch=Expression;

ForExpression:
    'for' iterators+=FeelIterator (',' iterators+=FeelIterator)* 'return' body=Expression;

FeelIterator:
    name=ID 'in' range=Expression;

QuantifiedExpression:
    quantifier=('some' | 'every') iterators+=FeelIterator (',' iterators+=FeelIterator)* 'satisfies' condition=Expression;

FunctionDefinition:
    'function' '(' (params+=ID (',' params+=ID)*)? ')' body=Expression;

// ============================================================
// Unary Tests (for DMN input entries)
// Used by InExpression and potentially as top-level
// ============================================================

PositiveUnaryTest:
    {infer RangeTest} range=Range
    | {infer ComparisonTest} op=('<' | '>' | '<=' | '>=') endpoint=Addition
    | {infer WildcardTest} '-';

Range:
    (openStart?='(' | '[') low=Expression '..' high=Expression (openEnd?=')' | ']');

// ============================================================
// Literals
// ============================================================

Literal:
    NumberLiteral
    | StringLiteral
    | BooleanLiteral
    | NullLiteral
    | DateTimeLiteral
    | NameReference;

NumberLiteral:
    value=NUMBER;

StringLiteral:
    value=STRING;

BooleanLiteral:
    value?='true' | 'false';

NullLiteral:
    {infer NullLiteral} 'null';

DateTimeLiteral:
    func=('date' | 'time' | 'duration') '(' args+=Expression (',' args+=Expression)* ')';

NameReference:
    name=QualifiedName;

// ============================================================
// Collection / Context
// ============================================================

ListLiteral:
    '[' (elements+=Expression (',' elements+=Expression)*)? ']';

ContextLiteral:
    '{' (entries+=ContextEntry (',' entries+=ContextEntry)*)? '}';

ContextEntry:
    key=ContextKey ':' value=Expression;

ContextKey:
    name=ID | stringName=STRING;

// ============================================================
// Types / Names
// ============================================================

QualifiedName returns string:
    ID ('.' ID)*;

// ============================================================
// Terminals
// ============================================================

terminal ID: /[a-zA-Z_]\w*/;
terminal NUMBER: /\d+(\.\d+)?/;
terminal STRING: /"[^"]*"/;

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
