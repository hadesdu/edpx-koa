/**************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * php.handler.js ~ 2014/02/28 12:07:51
 * @author leeight(liyubei@baidu.com)
 * @author lupengyu(lupengyu@baidu.com)
 * @version $Revision$
 * @description
 *
 **/
var edp = require('edp-core' );

/* jshint camelcase: false */

/**
 * edp-webserver处理php
 *
 * 在`edp-webserver-config.js`中配置：
 * ```javascript
 * {
 *     location: /^.*$/,
 *     handler: [
 *         // 或者直接将php-cgi添加到环境变量中
 *         php('/usr/local/php/bin/php-cgi')
 *     ]
 * }
 * ```
 * 调试状态下请打开`php.ini`的`error_reporting`。
 *
 * @param {string=} opt_handler php-cgi可执行文件路径
 * @param {string=} opt_suffix 后缀名.
 * @param {function(Object):object=} opt_rewrite 通过返回值来重写请求的pathname和search
 */
module.exports = exports = function(opt_handler, opt_suffix, opt_rewrite) {

    var handler = opt_handler || 'php-cgi';
    // var suffix = opt_suffix || 'php';

    return function *(next) {

        var request = this.request;
        var targetURL = request.url;
        var targetPathName = request.path;
        var targetSearch = request.search;

        // url改换
        if (opt_rewrite ) {

            var changed = opt_rewrite(this);

            if (changed) {
                targetPathName = changed.pathname || targetPathName;
                targetSearch = changed.search || targetSearch;

                targetURL = this.header.host + targetPathName + targetSearch;

                edp.log.info(
                    'PHP try forwarding request' + (request.url) + ' to ' + (targetURL)
                );
            }
        }

        if (!/\.php($|\?)/.test(targetURL)) {
            return;
        }

        edp.log.info(
            'PHP request:' + (targetURL) + ' | ' + (targetPathName)
        );

        var path = require('path');
        var docRoot = this.conf.documentRoot;
        var request = this.request;
        var scriptName = targetPathName;
        var scriptFileName = path.normalize(docRoot + targetPathName);
        var query = null;

        if (targetSearch) {
            query = require('url').parse(targetSearch).query;
        }

        // @see: http://www.cgi101.com/book/ch3/text.html
        var host = (this.header.host || '').split(':');
        var env = {
            PATH: process.env.PATH,
            GATEWAY_INTERFACE: 'CGI/1.1',
            SERVER_PROTOCOL: 'HTTP/1.1',
            SERVER_ROOT: docRoot,
            DOCUMENT_ROOT: docRoot,
            SERVER_NAME: host[0],
            SERVER_PORT: host[1] || 80,
            REDIRECT_STATUS: 200,
            SCRIPT_NAME: scriptName, //docroot上的文件
            REQUEST_URI: targetURL,
            SCRIPT_FILENAME: scriptFileName, //物理文件
            REQUEST_METHOD: request.method,
            QUERY_STRING: query || ''
        };

        // expose request headers
        for (var header in this.header) {
            var name = 'HTTP_' + header.toUpperCase().replace(/-/g, '_');
            env[name] = this.header[header];
        }

        if ('content-length' in this.header // 如果头部中有`content-length`
            || request.method === 'POST'    // 或者是post请求
            || request.method === 'PUT'     // 或者是put请求
        ) {
            // 添加CONTENT_LENGTH环境变量
            env.CONTENT_LENGTH = this.header['content-length'] || request.bodyBuffer.length;
        }

        if ('content-type' in this.header) {
            env.CONTENT_TYPE = this.header['content-type'];
        }

        // 调用`php-cgi`处理请求
        var response = yield execute(handler, env, request.bodyBuffer);

        // 返回码不为0，返回500
        if (response.code) {
            this.status = 500;
            edp.log.error('php error:\n' + response.body + '\n');
        }
        else {
            this.status = 200;
        }

        this.set(response.header);
        this.body = response.body;

    };
};

/**
 * 启动子进程 调用`php-cgi`处理请求
 * 
 * @param {string} handler 本地环境可用的`php-cgi`命令
 * @param {Object} env `php-cgi`执行环境
 * @param {string} requestBodyBuffer 请求体内容
 * @return {Function} thunk
 */
function execute(handler, env, requestBodyBuffer) {

    return function (callback) {

        var child = require('child_process').spawn(
            handler,
            [],
            {
                env: env
            }
        );

        var bodyBuffer = [];
        var isBodyData = false;
        var headers = {};
        var line = [];

        var failed = false;

        // 如果触发了`error`事件，那么`exit`事件是否触发是随机的
        // 而如果`error`事件已经处理过了，`exit`就要跳过处理
        // 因此通过变量`failed`来标识
        child.on('exit', function (code) {

            if (failed) {
                return;
            }

            callback(null, {
                code: code,
                header: headers, 
                body: bodyBuffer.join('')
            });

        });

        // 无法创建子进程 or 子进程被杀死 or 子进程无法接收`message`时触发        
        child.on('error', function () {
            failed = true;
            var error = [].slice.call(arguments);
            edp.log.error('php error [' + error + ']');
            callback(error);
        });

        // 子进程的错误输出流事件处理
        // 我们会把错误输出流直接输出console里
        // 不过，php貌似也不太会输出到这个流，一般都会直接输出到stdout中
        child.stderr
            .on('end', function (chunk) {
                chunk && edp.log.error('php error:\n' + chunk.toString('utf8') + '\n');
            })
            .on('data', function (chunk) {
                chunk && edp.log.error('php error:\n' + chunk.toString('utf8') + '\n');
            });

        // 子进程的正常输出流
        // 这里输出的内容会被返回到浏览器
        // 但是这里的内容不仅仅有正常的数据，也会包含`error`信息
        // 因为php会把错误流也输出到这里
        child.stdout
            .on('data', function(buf) {

                for (var i = 0; i < buf.length; i++) {
                    // 如果是主体数据内容
                    if (isBodyData) {
                        return bodyBuffer.push(buf);
                    }

                    // 取出header
                    var c = buf[i];
                    if (c == 0xA) { // 如果是\n，则一行读取完毕
                        if (!line.length) { // 如果读取到一个空行
                            isBodyData = true;
                            bodyBuffer.push(buf.slice(i + 1) );
                            return;
                        }

                        var s = line.join('');
                        line = [];
                        var idx = s.indexOf(':');

                        headers[s.slice(0, idx)] = s.slice(idx + 1).trim();
                    } else if (c != 0xD) { //如果不是\n，也不是\r，说明一行还未读取结束
                        line.push(String.fromCharCode(c));
                    }
                }
            }
        );

        // 把request body内容传给child
        if (requestBodyBuffer) {
            child.stdin.write(requestBodyBuffer);
        }

    };

}




/* vim: set ts=4 sw=4 sts=4 tw=100: */