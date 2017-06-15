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
  }
}

export function render(structure) {
  let lines = [];

  let name = "";
  if("name" in structure) {
    name = structure.name;
  }

  lines.push(...['/**', `${START}${name}`, `${START}`]);

  console.log(structure);

  if(RENDERERS[structure.kind])
    lines.push(...RENDERERS[structure.kind.toUpperCase()](structure));


  lines.push(...[' */']);

  let content = lines.join('\n');
  let lineNums = lines.length;

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
