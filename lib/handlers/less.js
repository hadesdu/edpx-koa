/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/handlers/less.js ~ 2014/02/15 22:08:31
 * @author leeight(liyubei@baidu.com)
 * @author hades(denghongqi@gmail.com)
 * @version $Revision$
 * @description
 *
 **/

/**
 * 处理less输出
 *
 * @param {Object=} compileOptions less编译参数
 * @param {string=} encoding 源编码方式
 * @return {Function}
 */
module.exports = exports = function(compileOptions, encoding) {
    var encoding = encoding || 'utf8';
    return function *() {
        var ctx = this;
        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;

        var compileAndWriteLess = require( '../util/compile-and-write-less' );

        var content = ctx.body.toString(encoding) || '';
        
        yield compileAndWriteLess(content, compileOptions);
    }
};
