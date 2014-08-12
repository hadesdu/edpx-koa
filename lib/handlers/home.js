/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lib/handlers/home.js ~ 2014/02/15 22:17:02
 * @author leeight(liyubei@baidu.com)
 * @author hades(denghongqi@gmail.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var fs = require('fs');
var path = require('path');
var mimeType = require('../mime-types');

/**
 * 主索引页
 * 
 * @param {string|Array} file 索引页文件名
 * @return {Function}
 */
module.exports = exports = function(file) {
    return function *() {
        var ctx = this;

        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;

        var files;
        if (file instanceof Array) {
            files = file;
        }
        else if (typeof file == 'string') {
            files = [file];
        }

        var isExist = false;
        var dir = docRoot + pathname;
        if (file) {
            for (var i = 0; i < files.length; i++) {
                var filePath = dir + files[i];
                if (fs.existsSync(filePath)) {
                    var content = fs.readFileSync(filePath);
                    var extname = path.extname(filePath).slice(1);
                    ctx.body = content;
                    ctx.set('content-type', mimeType[extname] || mimeType.html);
                    isExist = true;
                    break;
                }
            }
        }

        if (!isExist) {
            if (ctx.conf.directoryIndexes
                && fs.existsSync(dir)
            ) {
                var listDirectory = require('./list-directory');
                yield listDirectory(dir);
            }
            else {
                ctx.status = 404;
            }
        }
    }
};
