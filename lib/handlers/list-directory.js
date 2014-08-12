/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/handlers/list-directory.js ~ 2014/02/15 22:22:16
 * @author leeight(liyubei@baidu.com)
 * @author hades(denghongqi@gmail.com)
 * @version $Revision$
 * @description
 *
 **/
var fs = require('fs');
var path = require('path');
var mimeType = require('../mime-types');
var thunkify = require('thunkify');

/**
 * 列出文件夹内文件
 *
 * @param {string=} dir 文件夹路径
 * @return {Function}
 */
module.exports = exports = function(dir) {
    return function *() {
        var ctx = this;

        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;
        var dirPath = dir || docRoot + pathname;

        var readdir = thunkify(fs.readdir);

        try {
            var files = yield readdir(dirPath);
            var list = [];

            files.forEach(function(file) {
                var stat = fs.statSync(path.join(dirPath, file));
                list.push({
                    'name': stat.isDirectory() ? file + '/' :  file,
                    'url': encodeURIComponent(file)
                            + (stat.isDirectory() ? '/' : ''),
                    'size': stat.size,
                    'mtime': stat.mtime
                });
            });

            var tplStr = fs.readFileSync(
                path.join(__dirname, '..', 'dirlist.tpl'),
                'utf8'
            );
            var tpl = require('handlebars').compile(tplStr);
            var html = tpl({
                'files' : list
            });
            ctx.status = 200;
            ctx.set('content-type', mimeType.html);
            ctx.body = html;
        } catch(err) {
            ctx.status = 500;
        }
    }
};
