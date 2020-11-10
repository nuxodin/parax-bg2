# parax-bg
Highly fantastic Parallax backgrounds

## Features
- fast!
- easy API
- works for dynamic added elements
- very lightweight
- optional element [bg-parax-visible], with only the reachable area.

## Demo 
https://rawcdn.githack.com/nuxodin/parax-bg/67f879d647467e6a65b08f0e7f8552aa17b740db/tests/demo.html


## Ussage

Add the attribute "parax-bg" to the element that should be the background of its parent. It will be absolute positionized and its parent relative.

```js
import 'https://cdn.jsdelivr.net/gh/nuxodin/parax-bg2@1.0.0/parax-bg.min.js';
```

```html
<link rel=stylesheet href="https://cdn.jsdelivr.net/gh/nuxodin/parax-bg2@1.0.0/parax-bg.min.css">

<div class="parax-bg-vp">

    <h1> Content </h1>

    <div parax-bg style="background-image:url(bg.jpg)" style="--parax-bg-speed:.7">
        <div parax-bg-visible>
            I am reachable
        </div>
    </div>
    
</div>
```

The stylesheet and the class "parax-bg-vp" on the parent element (the viewport) are optional, but are highly recommended to add the styles before the script is loaded or when Javascript is disabled or the browser is not supported (IE11).
