
const randomID = () => `_${Math.random().toString(36).substr(2, 9)}`;

function getStyle (ele, prop) {
    return window.getComputedStyle(ele, null).getPropertyValue(prop);
}

const SVG = {
    svgns: 'http://www.w3.org/2000/svg',
    xlink: 'http://www.w3.org/1999/xlink',
    // 创建svg元素
    createElement (name, attrs) {
        // 创建一个具有指定的命名空间URI和限定名称的元素
        const element = document.createElementNS(SVG.svgns, name);
  
        if (attrs) {
            SVG.setAttr(element, attrs);
        }
        return element;
    },
  
    // 添加属性
    setAttr (element, attrs) {
        const _attrs = Object.keys(attrs);
        _attrs.forEach(i => {
            if (i === 'href') { 
                // 给 image 设置 xlink:href 
                element.setAttributeNS(SVG.xlink, i, attrs[i]);
            } else { 
                element.setAttribute(i, attrs[i]);
            }
        });
        return element;
    }
};

/**
   * 
   * @param {*} element 
   * @param {*} options 
   *  url: '', // 图片的url
      blurAmount: 10, //模糊度
      imageClass: '', // 该样式将应用在image和svg元素上
      overlayClass: '', // 将覆盖模糊图像的元素的CSS类
      duration: false, 
      opacity: 1 
   */
class Blur {
    constructor(element, options) {
        this.internalID = randomID();
        this.element = element;
        this.width = element.offsetWidth;
        this.height = element.offsetHeight;
        this.parent = this.element.parentNode;
        this.options = Object.assign({}, Blur.DEFAULTS, options);
        this.overlayEl = this.createOverlay();
        this.blurredImage = null;
        this.generateBlurredImage(this.options.url);
    }

    setBlurAmount(blurAmount) {
        // 设置 blur 值
        this.options.blurAmount = blurAmount;
    }

    generateBlurredImage(url) {
        // 生成  blur 图片
        const previousImage = this.blurredImage;
        this.internalID = randomID();
      
        if (previousImage) {
            previousImage.parentNode.removeChild(previousImage);
        }
      
        this.blurredImage = this.createSVG(url, this.width, this.height);
    }

    createOverlay() {
        // 是否在外面添加一层 div
        if (this.options.overlayClass && this.options.overlayClass !== '') {
            const div = document.createElement('div');
            div.classList.add(this.options.overlayClass);
            this.parent.insertBefore(div, this.element);
            return div;
        }
        return false;
    }

    createSVG(url, width, height) {
        // 创建 SVG
        const that = this;
        const svg = SVG.createElement('svg', { 
            xmlns: SVG.svgns,
            version: '1.1',
            width,
            height,
            id: `blurred${this.internalID}`,
            class: this.options.imageClass,
            viewBox: `0 0 ${width} ${height}`,
            preserveAspectRatio: 'none', // 强制统一缩放比来保持图形的宽高比
        });
      
        const filterId = `blur${this.internalID}`; 
        const filter = SVG.createElement('filter', { // filter
            id: filterId
        });
      
        const gaussianBlur = SVG.createElement('feGaussianBlur', { 
            in: 'SourceGraphic', 
            stdDeviation: this.options.blurAmount,
        });
      
        const image = SVG.createElement('image', {
            x: 0,
            y: 0,
            width,
            height,
            externalResourcesRequired: 'true',
            href: url,
            style: `filter:url(#${filterId})`, // filter link
            preserveAspectRatio: 'none'
        });
      
        filter.appendChild(gaussianBlur); 
        svg.appendChild(filter); 
        svg.appendChild(image); 
      
        // 确保图像在持续时间100毫秒后显示，以防SVG加载事件没有触发或占用太长时间，可以自定义配置这个时间
        if (that.options.duration && that.options.duration > 0) {
            svg.style.opacity = 0;
            setTimeout(() => {
                if (getStyle(svg, 'opacity') === '0') {
                    svg.style.opacity = 1;
                }
            }, this.options.duration + 100);
        }
        this.element.insertBefore(svg, this.element.firstChild);
        return svg;
    }
}

Blur.DEFAULTS = {
    url: '', 
    blurAmount: 10, 
    imageClass: '', 
    overlayClass: '', 
    duration: false, 
    opacity: 1 
};

export default Blur;
