'use babel';

import {
  firstBlockComment,
  blockComment,
  lineComment
} from './parser';


const START = ' * '
const DELIMITER = `\t`

const RENDERERS = {
  _function: node => {
    let lines = [];

    for(let param of node.params) {
      lines.push(`${START}@param {type}${DELIMITER}${param.name} - this is the parameter ${param.name}`);
    }

    if(`returns` in node) {
      lines.push(`${START}`);
      lines.push(`${START}@return {${node.returns}} `);
    }

    return lines;
  },
  _class: node => {
    return [];
  },
  _classAttribute: node => {
    if('type' in node) {
      return `/** @type {${node.type}} */`;
    }
    return `/** @type {<type>} */`;
  },
  _constructor: node => {
    let lines = [];

    for(let param of node.params) {
      lines.push(`${START}@param {type}${DELIMITER}${param.name} - this is the parameter ${param.name}`);
    }

    return lines;
  },
  _get: node => {
    return `/** @type {${node.returns}} */`;
  },
  _set: node => {
    return `/** @type {<type>} */`;
  },
  _method: node => {
    let lines = [];

    for(let param of node.params) {
      lines.push(`${START}@param {type}${DELIMITER}${param.name} - this is the parameter ${param.name}`);
    }

    if(`returns` in node) {
      lines.push(`${START}`);
      lines.push(`${START}@return {${node.returns}} `);
    }

    if(`exceptions` in node) {
      lines.push(`${START}`);
      for(let exec of node.exceptions) {
        let line = `${START}@throws {${exec.throws}}`;
        if(exec.value) line += ` - ${exec.value}`;
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
  if("name" in structure) {
    name = structure.name;
  }

  if(!("kind" in structure)) {
    return {content, lineNums};
  }

  if(structure.kind === '_get' || structure.kind === '_set' || structure.kind === '_classAttribute') {
    content = RENDERERS[structure.kind](structure);
    lineNums = 1;
    return {content, lineNums};
  }

  lines.push(...['/**', `${START}${name}`, `${START}`]);

  if(RENDERERS[structure.kind])
    lines.push(...RENDERERS[structure.kind](structure));


  lines.push(...[' */']);

  content = lines.join('\n');
  lineNums = lines.length;

  return {content, lineNums};
}

export function newLine(previousLine) {
  if (firstBlockComment.test(previousLine) || blockComment.test(previousLine)) {
      return `\n* `;
  } else if (lineComment.test(previousLine)) {
      return `\n// `;
  }
}
