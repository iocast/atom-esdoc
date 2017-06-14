'use babel';

import { CompositeDisposable } from 'atom';

import { comment } from './esdocer';

/**
 * createComment - Create and insert a ES Doc comment for the comment next to
 * the cursor.
 *
 * @returns {void}
 */
function createComment() {

  const editor = atom.workspace.getActiveTextEditor();
  const code = editor.getText();
  const { row } = editor.getCursorBufferPosition();
  const lineNum = row + 1;

  const { content, line } = comment(code, lineNum);


  if (content && line) {
    editor.setCursorBufferPosition([(line - 1), 0]);
    editor.insertText(`\n${content}`);
  }

}

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'esdoc:generate': () => this.generate()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  generate() {
    createComment();
  }

};
