var mimeType = require( '../mime-types' );
var compose = require('koa-compose');
var co = require('co');

module.exports = exports = function(encoding) {
    var encoding = encoding || 'utf8';

    return function *(next) {
        var ctx = this;
        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;
        var file = docRoot + pathname;

        if ( 'source' in ctx.request.query ) {
            ctx.set('content-type', mimeType.js);
            ctx.body = fs.readFileSync( file, encoding );
        }
        else {
            var content = ctx.body.toString(encoding) || '';
            var compileAndWriteCoffee = require( './compile-and-write-coffee' );
            var gen = compose([compileAndWriteCoffee(content)]);
            var fn = co(gen);
            fn.call(ctx);
        }
        yield next;
    }
};
