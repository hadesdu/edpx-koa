var mimeType = require( '../mime-types' );
var edp = require('edp-core');
var fs = require('fs');
var thunkify = require('thunkify');
var co = require('co');
var path = require('path');

module.exports = exports = function(content, compileOptions) {
    var encoding = encoding || 'utf8';
    return function *(next) {
        var ctx = this;
        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;

        var includePaths = ctx.conf.lessIncludePaths || [];
        var importPath = docRoot + path.dirname(pathname).replace(/\/$/, '');
        var paths = [importPath];
        includePaths.forEach(
            function( p ) {
                paths.push( path.resolve( docRoot, p ) );
            }
        );

        var less = ctx.conf.less || require('less');
        var parser = new(less.Parser)(
            require('../util/extend')(
                {},
                {
                    paths: paths,
                    relativeUrls: true
                },
                compileOptions
            )
        );

        var parse = thunkify(parser.parse);

        co(function *() {
            try {
                var tree = yield parse.call(parser, content);
                ctx.set('content-type', mimeType.css);
                ctx.body = tree.toCSS();
            } catch(error) {
                ctx.status = 500;
                edp.log.error(''
                    + error.message
                    + ' Line: ' + error.line
                    + ' Column: ' + error.column
                    + ' Extract: ' + error.extract
                );
            }
        })();

        yield next;
    }
};
