/**
 * 获取数据属性/原生事件
 * @param {*} props
 */
export function getDataAttrs(props) {
    let attrs = {};
    Object.keys(props).forEach((key) => {
        if (/data-/g.test(key)) {
            attrs[key] = props[key];
        }
    });
    return attrs;
}

/**
 * 获取网络状态
 * 微信环境：NetType/4G、NetType/WIFI
 * JD环境：network/4g、network/wifi
 *
 * @export
 * @param {*} ua window.navigator.userAgent
 * @returns {string}
 */
export function getNetwork(ua = navigator.userAgent) {
    try {
        let re = /nettype\/([\S]*)/i;
        if (window.jmfe.isApp('jd')) {
            re = /network\/([^;]*)/i;
        }
        const res = re.test(ua) ? RegExp.$1.toLowerCase() : '';
        return res;
    } catch (e) {
        return '';
    }
}

export const network = getNetwork();

/**
 * 处理图片前缀
 *
 * @export
 * @param {string} src 图片链接
 * @param {number} [size] 图片大小
 * @returns {string}
 */
export function setImagePrefix(src, size) {
    if (/^jfs\//.test(src)) {
    // 处理jfs开头的图片
        if (size) return `//m.360buyimg.com/mobile/s${size}_${src}`;
        return `//m.360buyimg.com/mobile/${src}`;
    } else if (/^g[0-9]+\//.test(src)) {
    // 处理g开头的图片 如：g15/M04/00/15/rBEhWVHsmL4IAAAAAAM4J8MH744AABQvANwuCQAAzg_681.jpg
        return `//m.360buyimg.com/babel/${src}`;
    }
    return src;
}

/**
 * 处理图片大小
 *
 * @export
 * @param {string} src 图片链接
 * @param {(number|string)} [size] 图片大小 60 / 60x30
 * @returns {string}
 */
export function setImageSize(src, size) {
    if (!src || !size) return src;
    // gif图会导致400，直接返回原图
    if (src.match(/\.gif/)) return src;
    let s = '';
    if (!/x/.test(`${size}`)) s = `${size}x${size}`;
    return src.replace(/\/[^/]*?jfs\//, `/s${s || size}_jfs/`);
}

/**
 * 处理图片质量
 *
 * @export
 * @param {string} src 图片链接
 * @param {number} quality 质量0～100
 * @returns {string}
 */
export function setImageQuality(src, quality) {
    // 只替换360buyimg
    if (!/360buyimg\.com/g.test(src)) return src;
    const i = src.indexOf('!q');
    if (i !== -1) {
        src = src.substring(0, i);
    }
    if (!src) return src;
    if (!quality) {
    // 默认根据网络状态处理图片质量
        switch (network) {
            case 'wifi':
            case '4g':
                quality = 70;
                break;
            case '3g':
                quality = 50;
                break;
            case '2g':
                quality = 20;
                break;
            default:
                quality = 60;
                break;
        }
    }
    return `${src.replace(/!.+/, '')}!q${quality}.${src.substr(src.lastIndexOf('.') + 1)}`;
}

/**
 * 是否支持webp图片格式
 *
 * @returns {boolean}
 */
export function webpSupport() {
    if (!window.localStorage) return false;
    switch (window.localStorage.getItem('supportWebp')) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            try {
                if (
                    document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
                ) {
                    window.localStorage.setItem('supportWebp', 'true');
                    return true;
                }
                window.localStorage.setItem('supportWebp', 'false');
                return false;
            } catch (e) {
                return false;
            }
    }
}

/**
 * 处理webp
 *
 * @export
 * @param {string} src 图片链接
 * @returns {string}
 */
export function setImageWebp(src) {
    // 如果支持webp就用webp，否则用jpg
    const extension = webpSupport() ? 'webp' : '';
    // 如果原图是png,扩展名就用png
    const originalPNG = /(\w+\.(png|gif))/;
    if (src.match(originalPNG)) return src;
    if (extension) {
        return `${src}.${extension}`;
    }
    return src;
}
