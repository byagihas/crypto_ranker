// centralized error object that derives from Node’s Error
class ErrorHandler extends Error {
    constructor(name, httpCode, description, isOperational){
        super(Error, name, httpCode, description, isOperational);
        Error.call(this);
        Error.captureStackTrace(this);
        this.name = name;
        this.httpCode = httpCode;
        this.description = description;
        this.isOperational = isOperational;
    }
};

ErrorHandler.prototype = Object.create(Error.prototype);
ErrorHandler.prototype.constructor = ErrorHandler;

module.exports = ErrorHandler;