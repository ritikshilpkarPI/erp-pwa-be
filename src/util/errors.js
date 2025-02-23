class GeneralError extends Error{
    constructor(message){
        super();
        this.message = message
    }
    getCode(){
        if(this instanceof BadRequest) return 400;
        if(this instanceof NotFound) return 404;
        if(this instanceof Unauthorized) return 401;
        if(this instanceof ServerError) return 500;
    }
}

class BadRequest extends GeneralError { }
class NotFound extends GeneralError { }
class Unauthorized extends GeneralError { }
class ServerError extends GeneralError { }


module.exports = {
    GeneralError,
    BadRequest,
    NotFound
  };