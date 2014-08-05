module.exports = exports = function() {
    return function *(next) {
        yield next;
    }
};
