const toRegexp = require('path-to-regexp')

/**
 * Turn params array into a map for quick lookup.
 *
 * @param {Array} params
 * @return {Object}
 * @api private
 */
const toMap = params => {
  const map = {}

  params.forEach((param, i) => {
    param.index = i
    map[param.name] = param
  })

  return map
}

/**
 * Rwrite `src` to `dst`.
 *
 * @param {String|RegExp} src
 * @param {String} dst
 * @return {Function}
 * @api public
 */
const rewrite = (src, dst) => {
  const keys = []
  const re = toRegexp(src, keys)
  const map = toMap(keys)

  return (ctx, next) => {
    const m = re.exec(ctx.url)

    if (m) {
      ctx.url = dst.replace(/\$(\d+)|(?::(\w+))/g, (_, n, name) => {
        if (name) return m[map[name].index + 1] || ''
        return m[n] || ''
      })

      return next()
    }

    return next()
  }
}

module.exports = rewrite
