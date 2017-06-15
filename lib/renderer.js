'use babel';

const firstBlockComment = /^\s+\/\*[^\/]/; // Matches zero to many white spaces followed by /*, not followed by /
const blockComment = /^\s+\*[^\/]/; // Matches zero to many white spaces followed by *, not followed by /
const lineComment = /^((\s+\/\/)|(\/\/))/;


const START = ' * '
const DELIMITER = `\t`

const RENDERERS = {
  FUNCTION: node => {
    let lines = [];

    for(let param of node.params) {
      lines.push(`${START}@param {type}${DELIMITER}${param.name} - this is the parameter ${param.name}`)
    }

    if(`returns` in node) {
      lines.push(`${START}`);
      lines.push(`${START}@return ${node.returns} `);
    }

    return lines;
  },
  CLASS: node => {
    return [];
  },
  CONSTRUCTOR: node => {
    let lines = [];

    for(let param of node.params) {
      lines.push(`${START}@param {type}${DELIMITER}${param.name} - this is the parameter ${param.name}`)
    }

    return lines;
  },
  GET: node => {
    return `/** @type {${node.returns}} */`
  },
  SET: node => {
    return `/** @type {<type>} */`
  },
  METHOD: node => {
    let lines = [];

    for(let param of node.params) {
      lines.push(`${START}@param {type}${DELIMITER}${param.name} - this is the parameter ${param.name}`)
    }

    if(`returns` in node) {
      lines.push(`${START}`);
      lines.push(`${START}@return ${node.returns} `);
    }

    return lines;
  }
}

export function render(structure) {
  let lines = [];
  let content = "";
  let lineNums = lines.length;

  let name = "";
  if("name" in structure) {
    name = structure.name;
  }

  if(structure.kind === 'get' || structure.kind === 'set') {
    content = RENDERERS[structure.kind.toUpperCase()](structure);
    lineNums = 1;
    return {content, lineNums}
  }

  lines.push(...['/**', `${START}${name}`, `${START}`]);

  if(RENDERERS[structure.kind.toUpperCase()])
    lines.push(...RENDERERS[structure.kind.toUpperCase()](structure));


  lines.push(...[' */']);

  content = lines.join('\n');
  lineNums = lines.length;

  return {content, lineNums}
}

export function newLine(previousLine) {
  if (previousLine.match(firstBlockComment)) {
      return `${START}`
  } else if (previousLine.match(blockComment)) {
      return `* `;
  } else if (previousLine.match(lineComment)) {
      return `//`;
  }
  return "";
}
