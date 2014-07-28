/**
 * @file 开发时web调试服务器启动功能
 * @author hades[denghongqi@gmail.com], 
 */

exports.start = require( './lib/start' );

exports.getDefaultConfig = function () {
    return require( './lib/config' );
};
