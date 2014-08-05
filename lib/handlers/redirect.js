module.exports = exports = function(location, permanent) {
    return function *(next) {
        var ctx = this;
        ctx.status = permanent ? 301 : 302;
        ctx.set('location', location);
        
        yield next;
    }
};
