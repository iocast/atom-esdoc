'use babel';

import { firstBlockComment, endBlockComment, blockComment, lineComment } from './parser';


const START = ' * '
const DELIMITER = `\t`

const RENDERERS = {
  function: node => {
    let lines = [];

    for (let param of node.params) {
      lines.push(`${START}@param {${param.type ? param.type : 'type'}}${DELIMITER}${param.name} - this is the parameter ${param.name}`);
    }

    if (`returns` in node) {
      lines.push(`${START}`);
      lines.push(`${START}@return {${node.returns}} `);
    }

    return lines;
  },
  class: node => {
    return [];
  },
  constructor: node => {
    let lines = [];

    for (let param of node.params) {
      lines.push(`${START}@param {${param.type ? param.type : 'type'}}${DELIMITER}${param.name} - this is the parameter ${param.name}`);
    }

    return lines;
  },
  get: node => {
    if (node.returns.type) {
      return `/** @type {${node.returns.type}} */`;
    }
    return `/** @type {<type>} */`;
  },
  set: node => {
    if (node.params.length > 0) {
      return `/** @type {${node.params[0].type}} */`;
    }
    return `/** @type {<type>} */`;
  },
  var: node => {
    return `/** @type {${node.type}} */`;
  },
  let: node => {
    return `/** @type {${node.type}} */`;
  },
  const: node => {
    return `/** @type {${node.type}} */`;
  },
  method: node => {
    let lines = [];

    for (let param of node.params) {
      lines.push(`${START}@param {${param.type ? param.type : 'type'}}${DELIMITER}${param.name} - this is the parameter ${param.name}`);
    }

    if (`returns` in node) {
      lines.push(`${START}`);
      lines.push(`${START}@return {${node.returns.type}} `);
    }

    if (`throws` in node) {
      lines.push(`${START}`);
      for (let exec of node.throws) {
        let line = `${START}@throws {${exec.throws}}`;
        if (exec.value) line += ` - ${exec.value}`;
        lines.push(line);
      }
    }

    return lines;
  }
}

export function render(structure) {
  let lines = [];
  let content = null;
  let lineNums = lines.length;

  let name = "";
  if ("name" in structure) {
    name = structure.name;
  }

  if (!("kind" in structure)) {
    return { content, lineNums };
  }

  if (structure.kind === 'get' || structure.kind === 'set' || structure.kind === 'var' || structure.kind === 'const' || structure.kind === 'let') {
    content = RENDERERS[structure.kind](structure);
    lineNums = 1;
    return { content, lineNums };
  }

  lines.push(...['/**', `${START}${name}`, `${START}`]);

  if (RENDERERS[structure.kind])
    lines.push(...RENDERERS[structure.kind](structure));


  lines.push(...[' */']);

  content = lines.join('\n');
  lineNums = lines.length;

  return { content, lineNums };
}

export function newLine(previousLine) {
  if (endBlockComment.test(previousLine)) {
    return "";
  } else
  if (firstBlockComment.test(previousLine) || blockComment.test(previousLine)) {
    return `\n* `;
  } else if (lineComment.test(previousLine)) {
    return `\n// `;
  }
}
