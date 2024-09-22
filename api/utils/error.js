export const errorHandler = (statusCode,message)=> {
    
    //custom error handler - error created by us : a manual error
    const error = new Error()
    error.statusCode = statusCode;
    error.message = message;
    return error;
};  