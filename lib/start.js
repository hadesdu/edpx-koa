/**
 * @file 开发时web调试服务器启动功能
 * @author hades[denghongqi@gmail.com], 
 */

var edp = require('edp-core');

/**
 * 启动webserver
 *
 * @param {Object} config 启动所需配置模块
 */
module.exports = function (config) {
    var config = config || require('./config');

    var port = config.port || 80;
    var documentRoot = config.documentRoot;

    var koa = require('koa');

    var app = koa();

    app.use(function *(next) {
        this.request.bodyBuffer = yield require('raw-body')(this.req, {
            length: this.length,
            encoding: this.charset
        });

    });

    app.listen(port);

    var accessUrl = 'http://'
        + require( './util/ip' )
        + ( port === 80 ? '' : ':' + port );

    edp.log.info(
        'EDP WebServer start, %s', accessUrl);
    edp.log.info(
        'root = [%s], listen = [%s] ', documentRoot, port);

    return app;
};
