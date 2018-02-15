"use babel";

import * as parser from 'babylon';
import traverse from 'babel-traverse';

const PARSE_OPTS = {
  locations: true,
  sourceType: 'module',
  plugins: ['*'],
};

export const firstBlockComment = /^\s*\/\*[^\/]/; // Matches zero to many white spaces followed by /*, not followed by /
export const blockComment = /^\s+\*/; // Matches zero to many white spaces followed by *, not followed by /
export const lineComment = /^((\s*\/\/))/;
export const endBlockComment = /\*\/[ \t]*$/;


const SWITCHES = {
  ClassDeclaration: node => {
    return {
      kind: "class",
      name: node.id.name
    }
  },
  Identifier: node => {
    return {
      name: node.name
    }
  },
  StringLiteral: node => {
    return {
      value: node.value,
      type: "String"
    }
  },
  NumericLiteral: node => {
    return {
      value: node.value,
      type: "Number"
    }
  },
  ObjectExpression: node => {
    return { type: "Object" }
  },
  ArrayPattern: node => {
    return { type: "Array" };
  },
  NewExpression: node => {
    return { type: node.callee.name }
  },
  AssignmentPattern: node => {
    return Object.assign(SWITCHES[node.left.type](node.left), SWITCHES[node.right.type](node.right));
  }
};


const BODY_SWITCHES = {
  ReturnStatement: node => {
    return {
      returns: (node.argument.type in SWITCHES) ? SWITCHES[node.argument.type](node.argument) : {}
    };
  },
  ThrowStatement: node => {
    let exception = {
      throws: (node.argument.callee) ? node.argument.callee.name : "Error"
    }

    // take first argument as description
    for (let arg of node.argument.arguments) {
      Object.assign(exception, SWITCHES[arg.type](arg));
      break;
    }

    return exception;
  },
  BlockStatement: node => {
    return parseBody(node);
  },
  IfStatement: node => {
    return parseBody(node.consequent);
  },
  ForStatement: node => {
    return parseBody(node.body);
  }
}

// https://github.com/babel/babylon/blob/master/ast/spec.md
const NODE_SWITCHES = {

  VariableDeclaration: node => {
    let obj = {
      kind: node.kind
    }
    Object.assign(obj, SWITCHES[node.declarations[0].id.type](node.declarations[0].id));
    //Object.assign(obj, SWITCHES[node.declarations[0].init.type](node.declarations[0].init));

    return obj;
  },

  ExportNamedDeclaration: node => {
    return Object.assign({
      export: true
    }, SWITCHES[node.declaration.type](node.declaration));
  },

  ClassMethod: node => {
    let out = {
      kind: node.kind,
      async: node.async,
      params: [],
      throws: []
    };

    Object.assign(out, SWITCHES[node.key.type](node.key));

    for (let param of node.params) {
      out.params.push(SWITCHES[param.type](param));
    }

    let bodies = [];
    for (let body of node.body.body) {
      if (body.type in BODY_SWITCHES)
        bodies.push(BODY_SWITCHES[body.type](body));
    }

    for (let body of bodies) {
      if ("returns" in body) {
        Object.assign(out, body);
      } else if ("throws" in body) {
        out.throws.push(body);
      }
    }

    return out;

  },

  FunctionDeclaration: node => {
    let out = {
      kind: "function",
      async: node.async,
      params: [],
      throws: []
    }

    Object.assign(out, SWITCHES[node.id.type](node.id));

    for (let param of node.params) {
      out.params.push(SWITCHES[param.type](param));
    }

    let bodies = [];
    for (let body of bodies) {
      if ("returns" in body) {
        Object.assign(out, body);
      } else if ("throws" in body) {
        out.throws.push(body);
      }
    }

    return out;

  }

}

function parseBody(node) {
  let obj = {};
  for (let body of node.body) {
    if (body.type in BODY_SWITCHES)
      obj = BODY_SWITCHES[body.type](body);
  }
  return obj;
}


function parseNode(node) {
  return obj = (node.type in NODE_SWITCHES) ? NODE_SWITCHES[node.type](node) : "";
}


function onLine(node, lineNum) {
  const startLine = node.loc.start.line;
  return startLine === lineNum || startLine - 1 === lineNum;
}

function getNode(ast, lineNum) {
  let node = {};

  traverse(ast, {
    enter(path) {
      if (onLine(path.node, lineNum)) {
        if (!node) node = path.node;
        Object.assign(node, parseNode(path.node));
      }
    }
  });

  return node;
}

function getAST(code) {
  try {
    const ast = parser.parse(code, PARSE_OPTS);
    return ast;
  } catch (e) {
    throw new Error(`esdoc expects valid JavaScript. Error parsing: ${e.message}`);
  }
}


export function parse(code, lineNum = 1) {
  let ast = getAST(code);
  let node = getNode(ast, lineNum + 1);

  if (!node) {
    return null;
  }

  return node;
}
