var compose = require('koa-compose');
var co = require('co');

module.exports = exports = function(compileOptions, encoding) {
    var encoding = encoding || 'utf8';
    return function *(next) {
        var ctx = this;
        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;

        var compileAndWriteLess = require( './compile-and-write-less' );

        var content = ctx.body.toString(encoding) || '';
        var gen = compose([compileAndWriteLess(content, compileOptions)]);
        var fn = co(gen);
        fn.call(ctx);

        yield next;
    }
};
