/**
 * @file 开发时web调试服务器启动功能
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com],
 *         ostream[ostream.song@gmail.com],
 *         firede[firede@firede.us]
 *         sekiyika[px.pengxing@gmail.com]
 *         hades[denghongqi@gmail.com]
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
    var injectResource = config.injectResource || config.injectRes;
    injectResource && injectResource(require('./resource'));

    var koa = require('koa');
    var raw = require('raw-body');
    var logger = require('koa-logger');
    var co = require('co');

    var app = koa();

    app.use(logger(config));

    app.use(require('./route')(config));

    app.use(function *(next) {
        var ctx = this;

        ctx.request.bodyBuffer = yield raw(this.req, {
            length: this.length,
            encoding: this.charset
        });

        ctx.conf = config;

        yield next;

        var handlers = ctx._handlers || [];

        for (var i = 0; i < handlers.length; i++) {
            yield co(handlers[i]);
        }
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
