/**************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * handlers/proxy.js ~ 2014/02/15 15:05:38
 * @author leeight(liyubei@baidu.com)
 * @author lupengyu(lupengyu@baidu.com)
 * @version $Revision$ 
 * @description 
 * 
 **/
var edp = require('edp-core');
var chalk = require('chalk');
var http = require('http');

/**
 * http代理
 * 
 * @param {string} hostname 主机名，可为域名或ip
 * @param {number=} port 端口，默认80
 * @param {Object=} requestHeaders 额外的request header参数
 * @return {Function}
 */
module.exports = exports = function proxy( hostname, port, requestHeaders ) {

    return function *() {

        var context = this;
        var request = context.request;
        var proxyMap  = context.conf.proxyMap;

        if (!hostname && !proxyMap) {
            // 没有响应不友好，根本看不出来啥问题
            this.body = ''
                + '<h1>Not Found</h1>'
                + '<p>The requested URL '+ request.pathname +' was not found on this server.</p>';
            return;
        }

        if (!hostname) {
            var host = request.headers['host'];
            if (proxyMap[host]) {
                var matched = proxyMap[host].split(':');
                hostname = matched[0];
                port = matched[1] || port;
            }
            else {
                edp.log.warn('Can not find matched host for %s', chalk.red(host));
            }
        }

        // build request options
        var targetHost = hostname + ( port ? ':' + port : '' );
        var reqHeaders = request.headers;

        if (typeof context.conf.overrideProxyRequestHeader === 'function') {
            // modify the request host to target host
            context.conf.overrideProxyRequestHeader(reqHeaders);
        }
        else if (typeof requestHeaders === 'object') {
            reqHeaders = edp.util.extend(reqHeaders, requestHeaders);
        }

        var reqOptions = {
            hostname   : hostname,
            port       : port || 80,
            method     : request.method,
            path       : request.url,
            headers    : reqHeaders || {}
        };

        console.log(JSON.stringify(reqOptions, 0, 4));

        // create request object
        
        var start = Date.now();

        try {
            var response = yield doRequest(reqOptions, request.bodyBuffer);
            this.status = response.status;
            this.set(response.headers);
            this.body = response.body;

            edp.log.info(
                chalk.yellow( 'PROXY' ) + ' %s to %s - - %s ms', 
                chalk.green(request.url),
                chalk.green(targetHost + request.url), Date.now() - start
            );

        } catch (err) {
            edp.log.error(
                chalk.yellow('PROXY') + ' %s to %s - - %s ms', 
                chalk.green(request.url),
                chalk.green(targetHost + request.url), Date.now() - start,
                err
            );

            this.status = 500;
            this.body = err.code;
        }

    };
};

function doRequest(options, bodyBuffer) {

    return function (callback) {

        var req = http.request(options, function (res) {

            var content = [];

            res.on( 'data', function (chunk) {
                content.push( chunk );
            });

            res.on( 'end', function () {

                var headers = res.headers;

                if ( !res.headers.connection ) {
                    headers.connection = 'close';
                }

                callback(null, {
                    status: res.statusCode,
                    headers: res.headers,
                    body: Buffer.concat( content )
                });

            });

        });

        req.on('error', function (err) {
            callback(err);
        });

        // send request data
        bodyBuffer && req.write(bodyBuffer);
        req.end();
    };

}





















/* vim: set ts=4 sw=4 sts=4 tw=100: */