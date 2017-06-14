# Atom ESDoc package

![dependency status](https://david-dm.org/iocast/atom-esdoc.svg)

Atom package for quick jsdoc comment generation.
Forked from [Atom easy JSDoc by Tom Andrews](https://github.com/tgandrews/atom-easy-jsdoc)

## Install

```bash
apm install atom-easy-jsdoc
```

## Usage

Control-Shift-d or Control-Shift-j to add comment templates.

To add comments for any piece of code, position the cursor anywhere on the line preceding the line you wish to comment on.
```javascript
/**
 * functionComment - description
 *  
 * @param  {type} argA description
 * @param  {type} argB description
 * @param  {type} argC description
 * @return {type}      description
 */
function functionComment (argA, argB, argC) {
    return 'esdoc';
}
```

```javascript
/**
 * This is an empty comment
 */
var a = 'A';
```

## Autocontinue

Comments now are automatically continued if the user hits enter (new line event) while inside of a block (`/**...` etc.).

## Contribute
I'll be adding features periodically, however bug fixes, feature requests, and pull requests are all welcome.
