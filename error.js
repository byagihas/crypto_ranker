// centralized error object that derives from Node’s Error
class AppError extends Error {
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

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

module.exports = AppError;