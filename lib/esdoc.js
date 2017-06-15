'use babel';

import {
  CompositeDisposable
} from 'atom';

import {
  comment,
  addLine
} from './esdocer';


import provider from './esdoc-provider';



export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'esdoc:generate': () => this.generate(),
      'editor:newline': (evt) => this.continue(evt)
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  generate() {
    const editor = atom.workspace.getActiveTextEditor();
    let code = editor.getText();
    let {
      row
    } = editor.getCursorBufferPosition();
    let lineNum = row + 1;

    let {
      content,
      line
    } = comment(code, lineNum);

    if (content && line) {
      editor.setCursorBufferPosition([(line - 1), 0]);
      editor.insertText(`\n${content}`);
    }
  },

  continue (evt) {
    const editor = atom.workspace.getActiveTextEditor();

    let currentPosition = editor.getCursorBufferPosition(),
      previousLineText = editor.lineTextForBufferRow(currentPosition.row - 1),
      moveColumns = 0;

    let content = addLine(previousLineText);

    editor.insertText(content);
  },


  provide() {
    return provider;
  }

};
