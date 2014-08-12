/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lib/handlers/autocoffee.js ~ 2014/02/15 22:06:47
 * @author leeight(liyubei@baidu.com)
 * @author hades(denghongqi@gmail.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var fs = require( 'fs' );
var mimeType = require( '../mime-types' );

/**
 * 遇见不存在的 js，但是存在同名 coffee-script 时
 * 自动编译 coffee-script 并输出
 * 
 * @param {string} encoding 源编码方式
 * @return {Function}
 */
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






/* vim: set ts=4 sw=4 sts=4 tw=100: */