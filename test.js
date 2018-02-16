
/**
 * test
 *
 */
export class test {

  /**
   * constructor
   *
   * @param {type}	param1 - this is the parameter param1
   * @param {String}	param2 - this is the parameter param2
   */
  constructor(param1, param2 = "test") {
    this.name = param1;
  }

  /** @type {String} */
  get hello() {
    return "hello";
  }

  /** @type {Number} */
  get numb() {
    return 123;
  }

  /** @type {<type>} */
  get name() {
    return this.name;
  }

  /** @type {Object} */
  set name(value = {}) {
    this.name = value;
  }

  /**
   * calculate
   *
   * @param {String}	a - this is the parameter a
   * @param {Number}	b - this is the parameter b
   * @param {type}	c - this is the parameter c
   *
   * @return {String}
   *
   * @throws {Error} - test
   * @throws {Error}
   */
  calculate(a = "asdfasdf", b = 122, c) {
    this.name = a;
    if(a === b) {
      throw new Error("test");
    }

    for(let i = 0; i < c.length; i++) {
      if(b === c) {
        throw new  Error();
      }
    }
    return "";
  }

  /**
   * testWithDefaultValues
   *
   * @param {Object}	options - this is the parameter options
   * @param {Boolean}	options.propA - this is the parameter propA
   * @param {Boolean}	options.propB - this is the parameter propB
   * @param {Object}	options.test - this is the parameter test
   * @param {Number}	options.test.var1 - this is the parameter var1
   *
   * @throws {TypeError}
   */
  testWithDefaultValues(options = { propA: false, propB: false, test: { var1: 1 } }) {
    throw new TypeError();
  }

}


/**
 * test
 *
 * @param {type}	param1 - this is the parameter param1
 */
async function test(param1) {

}

/**
 * testWithDefaultValues
 *
 * @param {Object}	options - this is the parameter options
 * @param {Boolean}	options.insert - this is the parameter insert
 * @param {Boolean}	options.update - this is the parameter update
 * @param {Object}	options.test - this is the parameter test
 * @param {Number}	options.test.var1 - this is the parameter var1
 *
 * @throws {TypeError}
 */
function testWithDefaultValues(options = { insert: false, update: false, test: { var1: 1 } }) {
  throw new TypeError();
}


/**
 * test_func
 *
 * @param {type}	hello - this is the parameter hello
 *
 * @return {String}
 *
 */
function test_func(hello) {
  return "";
}

/** @type {Array} */
const ab = new Array();


/** @type {Array} */
const [asd, def] = test_fun();

/** @type {Object} */
var test = {
  hello: ["test", {
    abc: 1
  }]
}

/** @type {String} */
const test = "hello";
