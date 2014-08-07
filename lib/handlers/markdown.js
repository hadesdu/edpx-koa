var fs = require('fs');
var markdown = require('markdown').markdown;

module.exports = exports = function(encoding) {
    return function *() {
        var ctx = this;
        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;
        var file = docRoot + pathname;

        if ( fs.existsSync( file ) ) {
            var content = fs.readFileSync(file, encoding);
            var title = file.split(/\/|\\/).pop();

            ctx.body = [
                '<html>',
                    '<head>',
                        '<meta charset="'+ encoding +'">',
                        '<title>'+ title +'</title>',
                        '<link rel="stylesheet" href="https://raw.githubusercontent.com/jasonm23/markdown-css-themes/gh-pages/avenir-white.css">',
                    '</head>',
                '<body>',
                    markdown.toHTML(content.toString(encoding)),
                '</body>',
            '</html>'
            ].join('');

            ctx.status = 200;
        }
        else {
            ctx.status = 404;

        }

    }
};
