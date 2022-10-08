module.exports = (err, req, res, next) => {
    if (err.constructor.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Unauthorized' });
    } else {
        return next();
    }
};
