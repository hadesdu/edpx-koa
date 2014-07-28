/**
 * @file cli/koa.js
 * @author hades(denghongqi@gmail.com)
 **/

/**
 * 命令行配置项
 *
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = 'EDP Koa Webserver';

/**
 * 模块命令行运行入口
 * @param {Array.<string>} args
 * @param {Object.<string, *>} opts
 */
cli.main = function( args, opts ) {
    console.log( 'See `edp koa --help`' );
};

exports.cli = cli;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
