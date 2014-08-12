/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/handlers/stylus.js ~ 2014/02/15 21:57:29
 * @author leeight(liyubei@baidu.com)
 * @author hades(denghongqi@gmail.com)
 * @version $Revision$
 * @description
 *
 **/


/**
 * 处理stylus输出
 *
 * @param {Object=} compileOptions stylus编译参数
 * @param {string=} encoding 源编码方式
 * @return {Function}
 */
module.exports = exports = function stylus (compileOptions, encoding) {
    encoding = encoding || 'utf8';

    return function *() {
        var ctx = this;

        var compileAndWriteStylus = require( '../util/compile-and-write-stylus' );

        yield compileAndWriteStylus(
            ctx.body.toString(encoding) || '',
            compileOptions
        );
    };
};





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
