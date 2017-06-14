'use babel';

const START = ' * '
const DELIMITER = `\t`

const RENDERERS = {
  function: node => {
    let lines = [];

    for(let param of node.params) {
      lines.push(`${START}@param {Object}${DELIMITER}${param.name} - this is the parameter ${param.name}`)
    }

    if(`returns` in node) {
      lines.push(`${START}`);
      lines.push(`${START}@return ${node.returns} `);
    }

    return lines;
  }}


export function render(structure) {
  let lines = [];
  //console.log(structure);

  lines.push(...['/**', `${START}${structure.name}`, `${START}`]);

  lines.push(...RENDERERS[structure.kind](structure));


  lines.push(...[' */']);

  return lines.join('\n');
}
