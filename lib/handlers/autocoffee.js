var fs = require( 'fs' );
var mimeType = require( '../mime-types' );

module.exports = exports = function(encoding) {
    encoding = encoding || 'utf8';

    return function *() {
        var ctx = this;
        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;
        var file = docRoot + pathname;

        if ( fs.existsSync( file ) ) {
            ctx.set('content-type', mimeType.js);
            ctx.body = fs.readFileSync(file, encoding);
        }
        else {
            file = file.replace(/\.js$/, '.coffee');
            if (fs.existsSync(file)) {
                var compileAndWriteCoffee = require( '../util/compile-and-write-coffee' );
                var content = fs.readFileSync(file, encoding);
                yield compileAndWriteCoffee(content, encoding);
            }
            else {
                ctx.status = 404;
            }
        }
    }
};
