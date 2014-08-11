/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/


/**
 * lib/handlers/markdown.js ~ 2014/6/29 22:03:35
 * @author leeight(liyubei@baidu.com)
 * @author hades(denghongqi@gmail.com)
 * @version $Revision$
 * @description
 *
 **/
var fs = require('fs');
var markdown = require('markdown').markdown;

/**
 * markdown
 * 转markdown并输出
 *
 * @param {string=} encoding 源编码方式
 * @todo 多样式支持
 * @return {Function}
 */
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
