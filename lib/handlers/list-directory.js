var fs = require( 'fs' );
var path = require( 'path' );
var mimeType = require( '../mime-types' );

module.exports = exports = function(dir) {
    return function *(next) {
        var ctx = this;

        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;
        var dirPath = dir || docRoot + pathname;

        fs.readdir(dirPath, function(err, files) {
            var list = [];
            files.forEach(function(file) {
                var stat = fs.statSync(path.join(dirPath, file));
                list.push({
                    'name': stat.isDirectory() ? file + '/' :  file,
                    'url': encodeURIComponent(file)
                            + (stat.isDirectory() ? '/' : ''),
                    'size': stat.size,
                    'mtime': stat.mtime
                });
            });

            var tplStr = fs.readFileSync(
                path.join(__dirname, '..', 'dirlist.tpl'),
                'utf8'
            );
            var tpl = require('handlebars').compile(tplStr);
            var html = tpl({
                'files' : list
            });
            ctx.status = 200;
            ctx.set('content-type', mimeType.html);
            ctx.body = html;
        });

        yield next;
    }
};
