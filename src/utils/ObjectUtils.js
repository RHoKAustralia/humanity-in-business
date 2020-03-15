class ObjectUtils {
    prefixAllProperties(object, prefix) {
        return Object.fromEntries(
            Object.entries(object).map(([k, v]) => [`${prefix}${k}`, v])
        )
    }
}

module.exports = ObjectUtils;