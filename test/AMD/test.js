var root = '../../';

requirejs.config({
    baseUrl : root,
    urlArgs: "pc=" + (new Date()).getTime(),
    paths : {
        'Exception' : 'src/exception',
        'MainTest'  : 'test/main'
    }
});

define(function(require) {
    var test = require('MainTest');

    window.assert = chai.assert;
    test.run();
    mocha.run();
});