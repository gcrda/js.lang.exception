(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['Exception'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../src/exception'));
    } else {
        root.MainTest = factory(root.Exception);
  }
}(this, function (Exception) {
    return {
        run : function() {
            describe('Exception', function() {
                it('should exists and it should be a function', function() {
                    assert(typeof Exception === 'function');
                })
            });

            describe('check proper export from UMD', function() {
                it('should have the properties', function() {
                    assert(1 === 1);
                });
            });
        }
    };
}));
