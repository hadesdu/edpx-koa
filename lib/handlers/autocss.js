var fs = require( 'fs' );
var mimeType = require( '../mime-types' );

/**
 * css预处理器列表
 *
 * @type {Array}
 */
var preprocessors = [
    {
        'name': 'less',
        'suffix': '.less',
        'compileAndWrite': require( './compile-and-write-less' )
    },
    {
        'name': 'stylus',
        'suffix': '.styl',
        'compileAndWrite': require( './compile-and-write-stylus' )
    }
];

/**
 * 遇见不存在的css时，查找同名的css预处理器，找到则自动变异输出
 *
 * 配置示例：
 * {
 *   'less': Object, // less的编译参数对象
 *   'stylus': Function // stylus设置编译参数的函数
 * }
 *
 * @param {Object=} compileOptionsMap 编译参数
 * @param {string=} encoding 源编码方式
 * @return {Function}
 */
module.exports = exports = function(compileOptionsMap, encoding) {
    var encoding = encoding || 'utf8'

    return function *(next) {
        var ctx = this;

        var docRoot  = ctx.conf.documentRoot;
        var pathname = ctx.request.pathname;
        var file = docRoot + pathname;

        if ( fs.existsSync( file ) ) {
            ctx.set('content-type', mimeType.css);
            ctx.body = fs.readFileSync( file, encoding );
        }
        else {
            var sourceFile;
            var compileAndWriteFn;
            var compileOptions;

            compileOptionsMap = compileOptionsMap || {};

            preprocessors.every(function( preprocessor ) {
                sourceFile = file.replace( /\.css$/, preprocessor.suffix );

                if ( fs.existsSync( sourceFile ) ) {
                    compileAndWriteFn = preprocessor.compileAndWrite;
                    compileOptions = compileOptionsMap[ preprocessor.name ];

                    return false;
                }

                return true;
            });

            if ( typeof compileAndWriteFn === 'function' ) {
                var content = fs.readFileSync(sourceFile, encoding);
                yield compileAndWriteFn(content, compileOptions);
            }
            else {
                ctx.status = 404;
            }
        }
    }
};
