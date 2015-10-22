(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.Exception = factory();
  }
}(this, function () {
    var EXCEPTION_NAME  = 'Exception',
        DISALLOWED_KEYS = [
            'name',
            'stack',
            '_id',
            '_args',
            '_originalMessage',
            '_originalArguments'
        ];

    function format(message) {
        var pattern = /(\{)(\d*)(\})/g,
            args    = arguments,
            index   = 1;

        return message.replace(pattern, function(match, left, num, right) {
            if (left === '{' && right === '}') {
                if (num !== '') {
                    return args[parseInt(num)];
                } else {
                    return args[index++];
                }
            } else {
                return match;
            }
        });
    }

    function Message(message, id) {
        this._message = message;
        this._id = id;
    }

    Message.prototype = {
        constructor : Message,
        getMessage : function() {
            return this._message;
        },
        getID : function() {
            return this._id;
        }
    };

    function Exception(message, id, args) {
        var name              = EXCEPTION_NAME,
            originalMessage   = '',
            originalArguments = [];

        this._id   = id || null;
        this._args = args || null;

        if (typeof message === 'string') {
            this._message = message || name;
        } else if (message && typeof message === 'object') {
            if (Object.prototype.toString.call(message) === '[object Array]') {
                if (message.length > 0) {
                    originalMessage = message[0];
                    originalArguments = message.slice(1);
                    message = format.apply(null, message);
                } else {
                    message = '';
                }
                this._message = message;
            } else if (message instanceof Message) {
                var formatArgs = Array.prototype.slice.call(arguments, 1);
                    formatArgs.unshift(message.getMessage());
                this._message = format.apply(null, formatArgs);
                this._id = message.getID();
                originalMessage = message.getMessage();
                originalArguments = Array.prototype.slice.call(arguments, 1);
            } else {
                for (var key in message) {
                    if (message.hasOwnProperty(key)) {
                        if (DISALLOWED_KEYS.indexOf(key) === -1) {
                            this[key] = message[key];
                        }
                    }
                }
            }
        }

        this._originalMessage = originalMessage;
        this._originalArguments = originalArguments;

        this.name  = name;
        this.stack = (new Error(this._message, this._id)).stack;
    }

    Exception.prototype = Object.create(Error.prototype);
    Exception.prototype.constructor = Exception;
    Exception.prototype.getMessage = function() {
        return this._message;
    };
    Exception.prototype.getID = function() {
        return this._id;
    };

    Exception.messageFrom = function(message, id) {
        return new Message(message, id);
    };

    return Exception;
}));