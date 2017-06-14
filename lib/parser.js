"use babel";

import * as parser from 'babylon';
import traverse from 'babel-traverse';


const PARSE_OPTS = {
  locations: true, sourceType: 'module',
  plugins: ['*'],
};

// https://github.com/babel/babylon/blob/master/ast/spec.md
const NODE_SWITCHES = {
  ExportNamedDeclaration: node => {
    return { export: true }
  },
  ExportDefaultDeclaration: node => {
    return { export: true, default: true }
  },
  FunctionDeclaration: node => {
    return {
      kind: 'function',
      name: node.id.name,
      params: parseParameters(node)
    }
  },
  ClassDeclaration: node => {
    return { kind: 'class', name: node.id.name }
  },
  ClassMethod: node => {
    return {
      kind: node.kind, // [constructor | method | get | set]
      params: parseParameters(node)
    }
  },

  BlockStatement: node => {
    let obj = {};

    for(let body of node.body) {
      Object.assign(obj, BODY_SWITCHES[body.type](body) || {});
    }

    return obj;
  }
}



const BODY_SWITCHES = {
  ReturnStatement: node => {
    if(node.argument.type === "StringLiteral")
      return { returns: "String" };
    return { returns: "" };
  }
}



function parseParameters(node) {
  let params = [];

  for(let param of node.params) {
    params.push({
      name: param.name
    });
  }

  return params;
}

function parseNode(node) {
  //console.log(node);
  return (node.type in NODE_SWITCHES) ? NODE_SWITCHES[node.type](node) : "";
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
  let node = getNode(ast, lineNum);

  if (!node) {
    return null;
  }

  return node;
}
