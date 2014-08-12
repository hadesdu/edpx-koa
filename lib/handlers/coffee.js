/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/handlers/coffee.js ~ 2014/02/15 21:39:52
 * @author leeight(liyubei@baidu.com)
 * @author hades(denghongqi@gmail.com)
 * @version $Revision$
 * @description
 *
 **/
var mimeType = require( '../mime-types' );

/**
 * 处理 coffee-script 输出
 *
 * @param {string} encoding 源编码方式
 * @return {Function}
 */
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
