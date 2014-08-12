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
 * 输出内容
 * 
 * @param {string} content 要输出的内容
 * @return {Function}
 */
module.exports = exports = function(content) {
    return function *() {
        var ctx = this;
        ctx.body = content || '';
    }
};
