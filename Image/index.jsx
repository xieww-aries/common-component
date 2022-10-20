import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { getDataAttrs, setImagePrefix, setImageSize, setImageQuality, setImageWebp } from './utils';
import loadingImg from './img/loading.png';
import errorImg from './img/error.png';
import './index.scss';
require('intersection-observer');

// 静态对象
let Observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((item) => {
            if (item.intersectionRatio > 0 && item.target) {
                // 执行绑定在dom上的回调
                if (typeof item.target._ibCallback === 'function') {
                    item.target._ibCallback(item);
                }
                Observer.unobserve(item.target);
            }
        });
    },
    {
        rootMargin: '300px 50px'
    }
);

/**
 * @description 图片组件
 * @class Image
 * @extends {Component}
 */
class Image extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            url: null,
            status: 'loading',
            aspectFillMode: 'width'
        };
    }

    componentDidMount() {
        if (this.props.allowLazy) {
            Object.defineProperty(this.imgRef, '_ibCallback', {
                value: (...args) => {
                    this.loadImage();
                    this.props.onExpose && this.props.onExpose(args);
                },
                writable: false
            });
            Observer && Observer.observe(this.imgRef);
        }
    }

    // 获取图片路径
    getSrc = (url) => {
        if (!url) return null;
        let { size, quality } = this.props;
        if (/jfs\//.test(url)) {
            // 检验替换jsf开头的图片
            url = setImagePrefix(url);
            // 修改图片尺寸
            size && (url = setImageSize(url, size));
            // 修改图片质量
            if (quality) {
                url = quality === 'auto' ? setImageQuality(url) : setImageQuality(url, quality);
            }
            // 修改webp支持
            url = setImageWebp(url);
        }
        return url;
    };

    // 加载图片
    loadImage = () => {
        let { src } = this.props;
        const img = new window.Image();
        img.onload = this.handleLoad;
        img.onerror = this.handleError;
        img.src = this.getSrc(src);
    };

    // 图片的加载成功处理
    handleLoad = (evt) => {
        let img = evt.currentTarget;
        this.setState({
            status: 'success',
            url: evt.currentTarget.src,
            aspectFillMode: img.width < img.height ? 'height' : 'width'
        });
        // 图片加载成功的钩子
        this.props.onLoad && this.props.onLoad(evt);
    };

    // 图片的加载失败处理
    handleError = (evt) => {
        this.setState({
            status: 'error',
            url: this.props.errorPlaceholder
        });
        // 图片加载失败的钩子
        this.props.onError && this.props.onError(evt);
    };

    render() {
        const { className, style, src, placeholder, errorPlaceholder, mode, allowLazy, onClickItem } = this.props;
        const { url, status, aspectFillMode } = this.state;
        // 获取数据属性
        const dataAttrs = getDataAttrs(this.props);

        // const cls = classNames(
        //     'ihub-try-img',
        //     {
        //         'ihub-try-img--widthfix': mode === 'widthFix',
        //         'ihub-try-img--heightfix': mode === 'heightFix',
        //         'ihub-try-img--rect': mode === 'rect'
        //     },
        //     className
        // );
        // const imgCls = classNames('ihub-try-img__mode-' + `${mode}`.toLowerCase().replace(/\s/g, ''), {
        //     [`ihub-try-img__mode-aspectfill--${aspectFillMode}`]: mode === 'aspectFill'
        // });

        return (
            <div
                className={`ihub-try-img ${mode === 'widthFix' ? 'ihub-try-img--widthfix' : ''} ${
                    mode === 'heightFix' ? 'ihub-try-img--heightfix' : ''
                } ${mode === 'rect' ? 'ihub-try-img--rect' : ''} ${className || ''}`}
                style={style}
                ref={(img) => {
                    this.imgRef = img;
                }}
                {...dataAttrs}
                onClick={onClickItem}
            >
                {allowLazy ? (
                    <img
                        className={`ihub-try-img__mode-${`${mode}`.toLowerCase().replace(/\s/g, '')} ${
                            mode === 'aspectFill' ? `ihub-try-img__mode-aspectfill--${aspectFillMode}` : ''
                        }`}
                        src={url || placeholder}
                        data-status={status}
                    />
                ) : (
                    <img
                        className={`ihub-try-img__mode-${`${mode}`.toLowerCase().replace(/\s/g, '')} ${
                            mode === 'aspectFill' ? `ihub-try-img__mode-aspectfill--${aspectFillMode}` : ''
                        }`}
                        src={url || this.getSrc(src) || errorPlaceholder}
                        onLoad={this.handleLoad}
                        onError={this.handleError}
                        data-status={status}
                    />
                )}
            </div>
        );
    }
}

Image.propTypes = {
    /**
     * @text 路径
     * @category data
     */
    src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    /**
     * @text 加载兜底图
     * @category data
     */
    placeholder: PropTypes.string,
    /**
     * @text 错误兜底图
     * @category data
     */
    errorPlaceholder: PropTypes.string,
    /**
     * @text 是否懒加载
     * @category function
     */
    allowLazy: PropTypes.bool,
    /**
     * @text 缩放/裁剪模式，具体查看下方mode说明
     * @category layout
     */
    mode: PropTypes.oneOf([
        'rect',
        'widthFix',
        'heightFix',
        'scaletoFill',
        'aspectFit',
        'aspectFill',
        'top',
        'bottom',
        'left',
        'right',
        'top left',
        'top right',
        'bottom left',
        'bottom right'
    ]),
    /**
     * @text 图片尺寸
     * @category other
     */
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * @text 图片质量
     * @category other
     */
    quality: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * @text 加载成功回调
     * @category event
     */
    onLoad: PropTypes.func,
    /**
     * @text 加载错误回调
     * @category event
     */
    onError: PropTypes.func,
    /**
     * @text 曝光回调
     * @category event
     */
    onExpose: PropTypes.func,
    /**
     * @text 点击回调
     * @category event
     */
    onClickItem: PropTypes.func
};

Image.defaultProps = {
    allowLazy: false,
    placeholder: loadingImg,
    errorPlaceholder: errorImg,
    mode: 'widthFix'
};

export default Image;
