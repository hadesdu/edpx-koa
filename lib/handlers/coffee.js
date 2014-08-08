var mimeType = require( '../mime-types' );

module.exports = exports = function(encoding) {
    var encoding = encoding || 'utf8';

    return function *() {
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
            var compileAndWriteCoffee = require( '../util/compile-and-write-coffee' );
            yield compileAndWriteCoffee(content);
        }
    }
};
