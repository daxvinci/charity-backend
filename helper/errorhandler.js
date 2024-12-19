function handleErrors(err, req, res, next) {
    if (err) {
        const statusCode = err.status || 400; // Default to 400 if no status is set
        const message = err.message || "Something went wrong"; // Default message
        console.log(err.stack)
        res.status(statusCode).json({ 
            message: message 
        });
    }
}

export default handleErrors;
