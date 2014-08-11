/**
 * 延迟输出
 *
 * @param {number} 延迟输出的时间，单位ms
 * @return {Function}
 */
module.exports = exports = function(time) {
    var time = time || 0;

    return function *() {
        var ctx = this;

        yield delay();
    };

    function delay() {
        return function(callback) {
            setTimeout(function() {
                callback();
            }, time);
        };
    }
};
