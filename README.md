# svg-blur

使用svg生成夸浏览器的高斯模糊图片

## 使用

new Blur('#element', {options})

eg:
const BlurFn = new Blur(document.querySelector('.blur'), {
    url: imgurl || '',
    blurAmount: 25,
    duration: 100, 
    opacity: 1,
    overlayClass: ''
});
