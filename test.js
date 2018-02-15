
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

}


/**
 * test
 *
 * @param {type}	param1 - this is the parameter param1
 */
async function test(param1) {

}


/**
 * test_func
 *
 * @param {type}	hello - this is the parameter hello
 */
function test_func(hello) {
  return "";
}


/** @type {Array} */
const ab = new Array();


/** @type {Array} */
const [asd, def] = test_fun();


/** @type {object} */
var test = {
  hello: ["test", {
    abc: 1
  }]
}


/** @type {string} */
const test = "hello";
