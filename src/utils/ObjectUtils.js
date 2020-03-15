class ObjectUtils {
    prefixAllProperties(object, prefix) {
        let obj = {};
        Object.entries(object).map(([k, v]) => [`${prefix}${k}`, v])
            .forEach(([k, v]) => obj[k] = v);
        return obj;
    }
}

module.exports = ObjectUtils;