/**
 * @file 内建资源处理方法集合
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com],
 *         ostream[ostream.song@gmail.com],
 *         firede[firede@firede.us],
 *         junmer[junmer@foxmail.com],
 *         leeight[leeight@gmail.com],
 *		   hades[denghongqi@gmail.com]
 */

exports.listDirectory = require( './handlers/list-directory' );

exports.file = require( './handlers/file' );

exports.home = require( './handlers/home' );

exports.php = require( './handlers/php' );

exports.less = require( './handlers/less' );

exports.coffee = require( './handlers/coffee' );

exports.autocoffee = require( './handlers/autocoffee' );

exports.proxyNoneExists = require( './handlers/proxy-none-exists' );

exports.proxy = require( './handlers/proxy' );

exports.autocss = require( './handlers/autocss' );

exports.stylus = require( './handlers/stylus' );

exports.livereload = require( './handlers/livereload' );

exports.markdown = require( './handlers/markdown' );

exports.redirect = require( './handlers/redirect' );

exports.content = require( './handlers/content' );

exports.empty = require( './handlers/empty' );
