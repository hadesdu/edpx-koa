module.exports = exports = function(content) {
    return function *() {
        var ctx = this;
        ctx.body = content || '';
    }
};
