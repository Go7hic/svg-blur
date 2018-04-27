# svg-blur

使用svg生成夸浏览器的高斯模糊图片

## 使用

```
npm i svg-blur -S
```
```
import Blur from 'svg-blur'

new Blur('#element', {options})

```

eg:

```
const BlurFn = new Blur(document.querySelector('.blur'), {
    url: imgurl || '',
    blurAmount: 25,
    duration: 100, 
    opacity: 1,
    overlayClass: ''
});
```


react 项目的话在 componentDidMount 里面调用。

```
componentDidMount() {
    const BlurFn = new Blur(document.querySelector('.blur'), {
        url: imgurl || '',
        blurAmount: 25,
        duration: 100, 
        opacity: 1,
        overlayClass: ''
    });
}
```

```
<div style={{ height: 354 }} className="blur" />
```
