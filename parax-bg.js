import 'https://unpkg.com/wicked-elements@3.1.1/min.js';

// todo resizeObserver

const pool = new Map();

const paraxBg = {
    add(element, item){
        pool.set(element, item)
        pool.size === 1 && addListeners();
        item.connect();
    },
    remove(element){
        pool.delete(element);
        //pool.size === 0 && removeListeners(); // todo
    },
    positionize(){
        requestAnimationFrame(function(){
            pool.forEach(function(item){
                item.positionize();
            })
        });
    },
    calcViewportRect(){
        pool.forEach(function(item){
            item.calcViewportRect();
        })
    }
}

let pageY = pageYOffset;

function addListeners(){
	addEventListener('resize',paraxBg.calcViewportRect);
	addEventListener('DOMContentLoaded',paraxBg.calcViewportRect);
	addEventListener('load',paraxBg.calcViewportRect);
	addEventListener('resize', paraxBg.positionize);
	addEventListener('load', paraxBg.positionize);
	document.addEventListener('scroll', function(e){
        pageY = pageYOffset;
        paraxBg.positionize();
    });
}

const style = document.createElement('style');
style.innerHTML =
'[parax-bg] { position:absolute; top:0; bottom:0; left:0; right:0; z-index:-1; will-change:transform; background-size:cover; } '+
'[parax-bg] > [parax-bg-visible] { position:absolute; top:0; bottom:0; left:0; right:0; } '+
'.parax-bg-vp { position:relative; overflow:hidden; z-index:0; transform:translate3d(0,0,0); } '+
document.head.prepend(style);

class Item {
    constructor(element){
        this.bg = element;
        let style = getComputedStyle(element);
        let speed = style.getPropertyValue('--parax-bg-speed');
        this.speed = speed === '' ? .5 : parseFloat(speed);
        this.factor = this.speed - 1;
    }
    connect(){
        this.viewport = this.bg.parentNode;
        this.viewport.classList.add('parax-bg-vp');
        this.calcViewportRect();
        this.positionize();
    }
    calcViewportRect(){
        let rect = this.viewport.getBoundingClientRect();
        this.cachedViewportRect = { // todo: add border-width
            top:    pageY + rect.top,
            bottom: pageY + rect.bottom,
            height: rect.height,
            yCenter: (rect.top + pageY) + rect.height/2,
        };

        // calculate offset if viewport is on top
        let relevantTop = this.cachedViewportRect.top;

        // if its faster then normal, calculate offset on bottom of viewport
        if (this.speed > 1) relevantTop += this.cachedViewportRect.height;

        let offset = this.offsetAtPageY(relevantTop);
        offset = Math.abs(offset);

        // if it moves the opposite, add the viewport height to the offset
        if (this.speed < 0) offset += (-this.speed * this.cachedViewportRect.height);

        this.bg.style.top    = -offset + 'px';
        this.bg.style.bottom = -offset + 'px';

        // the [parax-bg-visible] element
        if (this.speed < 0) {
            console.warn('parax-bg: parax-bg-visible attribute is not implemented for speed < 0')
            return;
        }
        const visibleEl = this.bg.querySelector('[parax-bg-visible]');
        if (visibleEl) {
            let maxTop = this.cachedViewportRect.top;
            if (this.speed > 1) maxTop = 0;
            let maxOffset = this.offsetAtPageY(maxTop);
            visibleEl.style.top =  offset - maxOffset  + 'px';

            let maxBottom = this.cachedViewportRect.bottom - winHeight;
            if (this.speed > 1) maxBottom = scrollHeight - winHeight;
            let maxOffsetBottom = this.offsetAtPageY(maxBottom);
            visibleEl.style.bottom =  offset + maxOffsetBottom + 'px';
        }
    }
    offsetAtPageY(pageY){
        var moved = this.cachedViewportRect.yCenter - (pageY + winHeight/2);
        return moved*(this.speed-1);
    }
    positionize(){
        this.bg.style.transform = 'translate3d(0, '+ this.offsetAtPageY(pageY) +'px, 0)';
    }
}

// cache innerHeight, Is it worth it?
var winHeight = innerHeight;
var scrollHeight = document.documentElement.scrollHeight;
addEventListener('resize',function(){
    winHeight = innerHeight;
    scrollHeight = document.documentElement.scrollHeight;
});


wickedElements.define(
    '[parax-bg]', {
        init() {
            this.paraxBg = new Item(this.element);
		},
        connected() {
            paraxBg.add(this.element, this.paraxBg);
        },
        disconnected() {
            paraxBg.remove(this.element);
        },
    }
);
