var caches = []

function Cache(page, inputValue, data) {
    if (caches.length >= 5) {
        caches = caches.slice(-4).concat({ pageSize: page, pageData: data.items, pageQuery: inputValue })
    } else {
        caches.push({ pageSize: page, pageQuery: inputValue, pageData: data.items })
    }
    console.log("缓存的数组长度：" + caches.length)
    console.log(caches)
    return caches
}


export default Cache