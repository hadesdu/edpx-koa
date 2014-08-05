var fs = require( 'fs' );
var mimeType = require( '../mime-types' );
var compose = require('koa-compose');
var co = require('co');

module.exports = exports = function(encoding) {
    encoding = encoding || 'utf8';

    return function *(next) {
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
                var compileAndWriteCoffee = require( './compile-and-write-coffee' );
                var content = fs.readFileSync(file, encoding);
                var gen = compose([compileAndWriteCoffee(content, encoding)]);
                var fn = co(gen);
                fn.call(ctx);
            }
            else {
                ctx.status = 404;
            }
        }

        yield next;
    }
};
