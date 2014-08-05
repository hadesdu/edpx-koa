var coffee = require( 'coffee-script' );
var mimeType = require( '../mime-types' );
var edp = require('edp-core');
var fs = require('fs');

module.exports = exports = function(content) {
    return function *(next) {
        var ctx = this;
        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;

        var file = docRoot + pathname;

        var hasSourceMap = !!ctx.conf.coffeeSourceMap;

        var options = {
            sourceMap: hasSourceMap
        };

        try {
            if ( hasSourceMap ) {
                options.generatedFile = pathname.replace(/^.+\/([^\/]+)$/g, '$1');
                options.sourceFiles = [
                    options.generatedFile
                        .replace( /\.(js|coffee)$/, '.coffee?source' )
                ];
            }

            var answer = coffee.compile(
                content,
                options
            );

            if ( hasSourceMap ) {
                var mapFile = file + '.map';
                fs.writeFile(mapFile, answer.v3SourceMap);
                answer.js += '\n\/\/@ sourceMappingURL='
                    + mapFile.replace(/^.+\/([^\/]+)$/g, '$1');
            }

            ctx.set('content-type', mimeType.js);
            ctx.body = hasSourceMap ? answer.js : answer;
        }
        catch ( ex ) {
            edp.log.error(ex.message);
            ctx.status = 500;
            ctx.body = ex.message;
        }

        yield next;
    }
};
