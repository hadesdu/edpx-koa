/**
 * @file 编译并输出Stylus
 * @author leeight[liyubei@baidu.com],
 *         firede[firede@firede.us],
 *         leon[leonlu@outlook.com],
 *         hades(denghongqi@gmail.com)
 */

var path = require('path');
var edp = require('edp-core');
var mimeType = require('../mime-types');
var thunkify = require('thunkify');

/**
 * 编译并输出stylus
 *
 * @inner
 * @param {string} content stylus内容
 * @param {Object} compileOptions stylus编译参数
 */
module.exports = exports = function compileAndWriteStylus(content, compileOptions) {
    var compileOptions = compileOptions || {};
    
    return function *() {
        var ctx = this;

        var stylus = ctx.conf.stylus || require('stylus');
        var style = stylus(content);
        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;
        var includePaths = ctx.conf.stylusIncludePaths || [];
        var importPath = docRoot + path.dirname(pathname).replace(/\/$/, '');
        var paths = compileOptions.paths = compileOptions.paths || [];

        // 全局引入的styl
        includePaths.forEach(function( p ) {
            paths.push( path.resolve( docRoot, p ) );
        });

        // 把当前解析脚本所在的路径加入paths
        paths.push(importPath);

        // 这里必须使用path.join，因为pathname是/src/xxx/xxx.styl这样的
        compileOptions.filename = path.join(docRoot, pathname);

        Object.keys(compileOptions).forEach(function (key, i) {

            var value = compileOptions[key];

            switch (key) {
                case 'urlfunc':
                    // Custom name of function for embedding images as Data URI
                    if (typeof value === 'string') {
                        style.define(value, stylus.url());
                    }
                    else {
                        style.define(value.name, stylus.url({
                            limit: value.limit != null ? value.limit : 30000,
                            paths: value.paths ? value.paths : []
                        }));
                    }
                    break;
                case 'use':
                    if ( !Array.isArray(value) ) {
                        value = [ value ];
                    }

                    value.forEach(function (func) {
                        if (typeof func === 'function') {
                            style.use(func);
                        }
                    });
                    break;

                case 'define':
                    for (var defineName in value) {
                        style.define(
                            defineName,
                            value[defineName],
                            shouldUseRawDefine(defineName)
                        );
                    }
                    break;
                case 'rawDefine':
                    // do nothing.
                    break;
                case 'import':
                    value.forEach(function(stylusModule) {
                        style.import(stylusModule);
                    });
                    break;
                case 'paths':

                    // 添加自定义的paths
                    // 不能通过set直接来搞，否则会覆盖掉use中添加的path
                    value.forEach(function (path) {
                        style.include(path);
                    });
                    break;
                case 'resolve url':
                    style.define('url', stylus.resolver());
                    break;
                default:
                    style.set(key, value);
            }

        });

        var render = thunkify(style.render);

        try {
            var css = yield render.call(style);
            ctx.body = css;
            ctx.set('content-type', mimeType.css);
        } catch(error) {
            ctx.status = 500;
            ctx.body = error.toString();
            edp.log.error(error);
        }

        function shouldUseRawDefine(key) {

            if( compileOptions.rawDefine === true ) {
                return true;
            }

            if ( Array.isArray( compileOptions.rawDefine ) ) {
                return compileOptions.rawDefine.indexOf(key) !== -1;
            } 

            return false;

        }
    };
};
