module.exports = exports = function() {
    return function *(next) {
        var ctx = this;
        ctx.body = '';

        yield next;
    }
};
