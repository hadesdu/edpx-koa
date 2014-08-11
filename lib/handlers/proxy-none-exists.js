/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lib/handlers/proxy-none-exists.js ~ 2014/02/15 21:36:32
 * @author leeight(liyubei@baidu.com)
 * @author hades(denghongqi@gmail.com)
 * @version $Revision$ 
 * @description 
 * @changelog:

    2014/6/30 参数传递空缺修复
 **/


/**
 * 对本地找不到响应的请求，试图从通过代理发起请求
 *
 * @return {Function}
 */
module.exports = exports = function() {
    var args = [].slice.call(arguments);

    return function *() {
    }
};
