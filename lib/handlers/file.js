var fs = require( 'fs' );
var path = require( 'path' );
var mimeType = require( '../mime-types' );
var thunkify = require('thunkify');

module.exports = exports = function(file) {
    return function *() {
        var ctx = this;

        var conf = ctx.conf;
        var docRoot  = conf.documentRoot;
        var pathname = ctx.request.pathname;
        var filePath = file || docRoot + pathname;
        var fsStat = thunkify(fs.stat);

        try {
            var stats = yield fsStat(filePath);

            if (stats.isDirectory()) {
                if (!filePath.match(/\/$/)) {
                    ctx.status = 302;
                    var loc = path.relative(docRoot, filePath);
                    ctx.set('location', '/' + loc + '/');
                }
                else if ( conf.directoryIndexes ) {
                    var listDirectory = require( './list-directory' );
                    yield listDirectory(filePath);
                }
            }
            else {
                var content = fs.readFileSync(filePath);
                var extname = path.extname(pathname).slice(1).toLowerCase();
                var contentType = mimeType[extname] || mimeType.html;
                ctx.set('content-type', contentType);
                ctx.body = content;
            }

        } catch(e) {
            ctx.status = 404;
        }
    }
};
