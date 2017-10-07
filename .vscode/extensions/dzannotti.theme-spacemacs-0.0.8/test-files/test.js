import foo from 'bar'
import bar from "bar"

const bar = 23
let foo = 'bar'

// Cross-browser xml parsing
var parseXML = function( data ) {
  var xml, tmp;
  if ( !data || typeof data !== "string" || typeof data !== 'string' ) {
    return null;
  }
  try {
    if ( window.DOMParser ) { // Standard
      tmp = new DOMParser();
      xml = tmp.parseFromString( data , "text/xml" );
    } else { // IE
      xml = new ActiveXObject( "Microsoft.XMLDOM" );
      xml.async = false;
      xml.loadXML( data );
    }
  } catch( e ) {
    xml = undefined;
  }
  if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
    jQuery.error( "Invalid XML: " + data );
  }
  return xml;
};

type foo {
  bar: number
}

function fooBar(asd : string) {

}

/* Bind a function to a context, optionally partially applying any arguments.*/
var proxy = function( fn, context ) {
  var tmp, args, proxy;

  if ( typeof context === "string" ) {
    tmp = fn[ context ];
    context = fn;
    fn = tmp;
  }

  // Quick check to determine if target is callable, in the spec
  // this throws a TypeError, but we will just return undefined.
  if ( !jQuery.isFunction( fn ) ) {
    return undefined;
  }

  // Simulated bind
  args = core_slice.call( arguments, 2 );
  proxy = function() {
    return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
  };

  // Set the guid of unique handler to the same of original handler, so it can be removed
  proxy.guid = fn.guid = fn.guid || jQuery.guid++;

  return proxy;
};

Sound.play = function() {}
Sound.prototype = { something; }
Sound.prototype.play = function() {}
Sound.prototype.play = myfunc
var parser = document.createElement('a');
parser.href = "http://example.com:3000/pathname/?search=test#hash";
parser.hostname; // => "example.com"
let bar = 'asdf'
let minchia = "barba"
const foo = {
  some: 34,
  object: {
    foo: bar
  }
  bar: [2, 3, 4]
}

for (var i=1; i<table.rows.length; i++) {
  var row = table.rows[i]
  var data = []
  for (var j=0; j<row.cells.length; j++) {
    data[top[j]] = row.cells[j].innerHTML;
  }
  data.push(data)
}

<div /* comment */ onClick={this.onClick}>
  <Emoji.stuck_out_tongue />
  <StyledForms.Input
    $parent={this}
    has_emoji={true}
    /* here's another comment */
    className='styled-input'
    className="styled-input">
  </StyledForms.Input>
</div>

class MyClass {
  regularMethod() {}
  *generatorMethod() {}
  static staticRegularMethod() {}
  static get staticGetterMethod() {}
  static set staticSetterMethod(arg) {}
  static *staticGeneratorMethod() {}
  static async staticAsyncMethod() {}
  async asyncMethod() {}
  [computedMethod()]() {}
  ["computedString"]() {}
  ["computed" + "String"]() {}
  *[Symbol.iterator]() {}
}

A = function() {}
B = function(z) {}
C = function c() {}
D = function d(z) {}
E = () => {}
F = (z) => {}
G = z => {}
function() {}
function(z) {}
function H() {}
function I(z) {}
() => {}
(z) => {}
J.prototype.j = () => {}
K.prototype.k = (z) => {}
L.prototype.l = z => {}
M.prototype.m = function() {}
N.prototype.n = function(z) {}
O.prototype.o = function oo() {}
P.prototype.p = function pp(z) {}
Q.q = () => {}
R.r = (z) => {}
S.s = z => {}
T.t = function() {}
U.u = function(z) {}
V.v = function vv() {}
W.w = function ww(z) {}

class X extends XX {}
class Y {}

var node = Relay.QL`
  node(123) {
    ${Relay.QL}
      User {
        address {
          ${fragment},
        },
      }
    }
  }
`;
