if (typeof require === 'function') {
    var Exception = require('../src/exception');
}

//console.log(Exception);

//throw new Exception(['message', 1, 2]);

/*
try {
    throw new Exception(['message {}, {}', 1, 2]);
} catch(exception) {
    console.log(exception);
}
*/

var ERROR = Exception.messageFrom('An exception {2}', 123);

//console.log(ERROR);

(function X() {
    //throw new Error('aaa');
    //throw new Exception(ERROR, 1, 2, 3);

})();

try {
    throw new Exception(ERROR, 1, 2, 3);
} catch(exception) {
    console.log(exception);
    //console.log(exception.stack);
}