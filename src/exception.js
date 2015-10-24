/**
 * Exception module.
 *
 * @module js/lang/Exception
 *
 * @version 1.0.0
 * @author Richard King <richrdkng@gmail.com>
 */
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
    /**
     * @private
     * @const {string} EXCEPTION_NAME Description of the constant
     * @memberOf module:js/lang/Exception.Exception
     */
    var EXCEPTION_NAME = 'Exception';

    /**
     * @private
     * @const {Array} DISALLOWED_KEYS Descripton of disall
     * @memberOf module:js/lang/Exception.Exception
     */
    var DISALLOWED_KEYS = [
            'name',
            'stack',
            '_id',
            '_args',
            '_originalMessage',
            '_originalArguments'
        ];

    /**
     * A private function to format Exception messages.
     *
     * @private
     * @function format
     *
     * @param {string} message
     */
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

    /**
     * Constructor of the Exception Message
     *
     * @private
     * @class Message
     * @memberOf module:js/lang/Exception
     *
     * @param {string} message
     * @param {int}    id
     */
    function Message(message, id) {
        this._message = message;
        this._id = id;
    }

    Message.prototype = {
        constructor : Message,

        /**
         * @instance
         * @function getMessage
         * @memberOf module:js/lang/Exception.Message
         *
         * @returns {string}
         */
        getMessage : function() {
            return this._message;
        },

        /**
         * @instance
         * @function getID
         * @memberOf module:js/lang/Exception.Message
         *
         * @returns {number}
         */
        getID : function() {
            return this._id;
        }
    };

    /**
     * Constructor of the Exception
     *
     * @class Exception
     * @memberOf module:js/lang/Exception
     *
     * @param {string|Message} [message]
     * @param {int}            [id]
     * @param {Array}          [args]
     */
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

    /**
     * @instance
     * @function getMessage
     * @memberOf module:js/lang/Exception.Exception
     *
     * @returns {string}
     */
    Exception.prototype.getMessage = function() {
        return this._message;
    };

    /**
     * @instance
     * @function getID
     * @memberOf module:js/lang/Exception.Exception
     *
     * @returns {number}
     */
    Exception.prototype.getID = function() {
        return this._id;
    };

    /**
     * Creates an Exception message from a message string and from an ID.
     *
     * @static
     * @function messageFrom
     * @memberOf module:js/lang/Exception.Exception
     *
     * @param {string} message
     * @param {number} id
     *
     * @returns {Message}
     */
    Exception.messageFrom = function (message, id) {
        return new Message(message, id);
    };

    /**
     * @exports js/lang/Exception.Exception
     */
    return Exception;
}));