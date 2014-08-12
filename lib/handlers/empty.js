/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/handlers/content.js
 * @author hades(denghongqi@gmail.com)
 * @description
 *
 **/

/**
 * 输出空内容
 * 
 * @return {Function}
 */
module.exports = exports = function() {
    return function *() {
        var ctx = this;
        ctx.body = '';
    }
};
