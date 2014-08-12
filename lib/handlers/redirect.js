/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/handlers/redirect.js
 * @author hades(denghongqi@gmail.com)
 * @description
 *
 **/
/**
 * 输出重定向
 * 
 * @param {string} location 重定向地址
 * @param {boolean} permanent 是否永久重定向
 * @return {Function}
 */
module.exports = exports = function(location, permanent) {
    return function *() {
        var ctx = this;
        ctx.status = permanent ? 301 : 302;
        ctx.set('location', location);
    }
};
