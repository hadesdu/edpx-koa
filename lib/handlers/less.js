module.exports = exports = function(compileOptions, encoding) {
    var encoding = encoding || 'utf8';
    return function *() {
        var ctx = this;
        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;

        var compileAndWriteLess = require( '../util/compile-and-write-less' );

        var content = ctx.body.toString(encoding) || '';
        
        yield compileAndWriteLess(content, compileOptions);
    }
};
