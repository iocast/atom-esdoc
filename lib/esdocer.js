'use babel';

import { parse } from './parser';
import { render } from './renderer';


export function comment(code, lineNum = 1) {

  const desc = parse(code, lineNum);

  if (!desc) {
    return '';
  }

  const content = render(desc);
  const line = lineNum;
  return { content, line };
}
