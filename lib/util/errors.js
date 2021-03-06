// eslint-disable-next-line
const handler = (err, req, res, next) => {
    
    let code = 500;
    let error = 'Internal Server Error';

    if(err instanceof HttpError) {
        code = err.code;
        error = err.message;
        console.log('\n*** Custom error handler:', err.name + ': ' + err.message + ' ***\n');
    }
    else if(err.name === 'CastError' || err.name === 'ValidationError') {
        code = 400;
        error = err.message;
    }
    else if(process.env.NODE_ENV !== 'production') {
        error = err.message;
        console.log(err);
    }
    else {
        console.log(err);
    }
    
    res.status(code).send({ error });
};

const api404 = (req, res, next) => {
    next(new HttpError({
        code: 404,
        message: 'API path does not exist'
    }));
};

const resource404 = () => new HttpError({
    code: 404,
    message: 'Resource ID not found'
});

class HttpError extends Error {
    constructor({ code, message }) {
        super(message);
        this.code = code;
        this.name = 'HttpError';
    }
}

module.exports = {
    handler,
    HttpError,
    api404,
    resource404
};