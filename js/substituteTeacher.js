!function(a){"use strict";function b(a,b){return a.action.cost-b.action.cost}function c(a){if(!a||"string"!=typeof a)throw"rawSentence must be a string.";var b,c,d,e=[];for(b=0,c=0;c<a.length;c++)d=a.charAt(c),d.match(/[\.,"\/!\?\*\+;:{}=()\[\]\s]/g)&&(c>b&&(d.match(/\s/g)?e.push(a.slice(b,c)+"&nbsp;"):e.push(a.slice(b,c))),d.match(/\s/g)||(c+1<a.length&&a.charAt(c+1).match(/\s/g)?e.push(d+"&nbsp;"):e.push(d)),b=c+1);return c>b&&e.push(a.slice(b,c)),e}function d(){var a,b=document.createElement("fakeelement"),c={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",MSTransition:"msTransitionEnd",OTransition:"otransitionend",transition:"transitionend"};for(a in c)if(c.hasOwnProperty(a)&&void 0!==b.style[a])return c[a]}function e(a,b){return'<div class="'+a+"-to-idx-"+b+" "+a+'-word"><span class="'+a+'-visible" style="opacity: 0"></span><span class="'+a+'-invisible" style="width: 0px"></span></div>'}function f(a,b,c){var d="."+a+"-invisible { visibility: hidden; }\n."+a+"-animating {\n  -webkit-transition: "+b+"s all linear;\n  -moz-transition: "+b+"s all linear;\n  -o-transition: "+b+"s all linear;\n  transition: "+b+"s all linear; }\n."+a+"-text-width-calculation {\n  position: absolute;\n  visibility: hidden;\n  height: auto;\n  width: auto;\n  display: inline-block;\n  white-space: nowrap; }."+a+" {\n  margin: 0;}\n  ."+a+" ."+a+"-punctuation { margin-left: -0.3rem; }\n  ."+a+" ."+a+"-word {\n    display: inline;\n    position: relative;\n    text-align: center;\n    height: "+c+"px;\n    white-space: nowrap;\n    overflow: hidden;}\n    ."+a+" ."+a+"-word span {\n      top: 0;\n      position: relative;\n      overflow: hidden;\n      height: 1px;\n      display: inline-block;}\n      ."+a+" ."+a+"-word ."+a+"-visible {\n        position: absolute;\n        display: inline;\n        height: "+c+"px;\n        top: 0;\n        bottom: 0;\n        right:0;\n        left: 0;}",e=document.head||document.getElementsByTagName("head")[0],f=document.createElement("style");f.type="text/css",f.styleSheet?f.styleSheet.cssText=d:f.appendChild(document.createTextNode(d)),e.appendChild(f)}function g(a,b){var c=this,d=b||{};return c.settings={containerId:d.containerId||"sub",namespace:d.namespace||"sub",interval:d.interval||5e3,speed:d.speed||200,verbose:void 0!==d.verbose?d.verbose:!1,random:void 0!==d.random?d.random:!1,best:void 0!==d.best?d.best:!0,_testing:void 0!==d._testing?d._testing:!1},c.wrapper=document.getElementById(c.settings.containerId),f(c.settings.namespace,c.settings.speed/1e3,c.wrapper.offsetHeight),c.highestTimeoutId=0,c.currentState=null,c.actions=[],c.invisibleClass=" ."+c.settings.namespace+"-invisible",c.visibleClass=" ."+c.settings.namespace+"-visible",c.fromClass=c.settings.namespace+"-from-idx-",c.toClass=c.settings.namespace+"-to-idx-",c.wrapperSelector="#"+c.settings.namespace,c._setupContainer(),c.settings._testing||c._setSentences(c._parseSentences(a)),this}function h(a,b,c){var e=this;e.sub=b,e.ctx=c,e.transitionEnd=d(),e.animatingClass=" "+e.sub.settings.namespace+"-animating","remove"===a?e.steps=[function(){e._fadeOut()},function(){e._setWidth()},function(){e._removeElement()}]:"sub"===a?e.steps=[function(){e._reIndex()},function(){e._fadeOut()},function(){e._setWidth()},function(){e._setTextAndFadeIn()},function(){e._cleanUp()}]:"insert"===a?e.steps=[function(){e._setWidth()},function(){e._setTextAndFadeIn()},function(){e._cleanUp()}]:"keep"===a?e.steps=[function(){e._reIndex()}]:console.log("Unknown animation: ",a),e.steps[0]()}g.prototype._parseSentences=function(a){if(!a||"object"!=typeof a)throw"rawSentences must be an array of strings.";return a.map(c)},g.prototype._setupContainer=function(){var a=this,b=document.getElementById(a.settings.containerId);if(!b)throw"Cannot find element with id:"+a.settings.containerId;b.innerHTML="",b.className=a.settings.namespace},g.prototype.run=function(){var a=this;a.actions||setTimeout(function(){a.run()},20);var b=a._computeActionsToChange([],a.actions[0].from);if(!b)throw console.log(b),"returned null action";a._applyAction(b),a.highestTimeoutId=setTimeout(function(){a._sentenceLoop()},a.settings.interval)},g.prototype._computeActionsToChange=function(a,b){var c=this;c.settings.verbose&&console.log("_computeActionsToChange: ",a,b);var d={from:a,to:b,sub:[],remove:[],insert:[],keep:[],cost:0},e=function(c,f,g){var h;if(g=g||!1,c>=a.length){if(!g)for(h=f;h<b.length;h++)d.insert.push({toWord:b[h],toIndex:h});return b.length-f}if(f>=b.length){if(!g)for(h=c;h<a.length;h++)d.remove.push({fromWord:a[h],fromIndex:h});return a.length-f}if(a[c]===b[f])return g?0:(d.keep.push({fromWord:a[c],toWord:b[f],fromIndex:c,toIndex:f}),e(c+1,f+1));var i=a.indexOf(b[f],c);if(g)return i;if(c+1==a.length&&-1===i)return d.sub.push({fromWord:a[c],toWord:b[f],fromIndex:c,toIndex:f}),e(c+1,f+1)+1;var j=e(c,f+1,!0);if(-1===i)return 0===j?(d.insert.push({toWord:b[f],toIndex:f}),e(c,f+1)+1):(d.sub.push({fromWord:a[c],toWord:b[f],fromIndex:c,toIndex:f}),e(c+1,f+1)+1);if(i===c+1&&j===c||i===j){var k=a.length-c,l=b.length-f;return k>l?(d.insert.push({toWord:b[f],toIndex:f}),e(c+1,f)+1):(d.remove.push({fromWord:a[c],fromIndex:c}),e(c,f+1)+1)}if(i>j&&-1!==j)return d.sub.push({fromWord:a[c],toWord:b[f],fromIndex:c,toIndex:f}),e(c+1,f+1)+1;for(h=c;i>h;h++)d.remove.push({fromWord:a[h],fromIndex:h});return d.keep.push({fromWord:a[i],toWord:b[f],fromIndex:i,toIndex:f}),e(i+1,f+1)+(i-c)};return d.cost=e(0,0),d},g.prototype._setSentences=function(a){var c,d,e,f=this;if(0===a.length&&(f.actions=[]),f.settings.best){var g=a.map(function(b,c){return a.map(function(b,d){if(c===d)return{action:{cost:Number.MAX_VALUE},fromIndex:c,toIndex:d};var e=f._computeActionsToChange(a[c],a[d]);return{action:e,fromIndex:c,toIndex:d}})}),h=[],i=0;g.sort(function(a,c){return a.sort(b),c.sort(b),a[0].cost-c[0].cost});var j=g[0][0].fromIndex;for(c=0;c<a.length;c++)for(d=0;d<a.length;d++)if(c===a.length-1&&g[i][d].toIndex===j||c!==a.length-1&&-1===h.indexOf(g[i][d].toIndex)){f.actions.push(g[i][d].action),h.push(i),i=g[i][d].toIndex;break}if(f.settings.random){var k=Math.floor(Math.random()*a.length);for(c=0;k>c;c++)f.actions.push(f.actions.shift())}}else for(f.settings.random&&a.sort(function(){return.5-Math.random()}),c=0;c<a.length;c++)e=0===c?a.length-1:c-1,f.actions.push(f._computeActionsToChange(a[e],a[c]))},g.prototype._sentenceLoop=function(){var a=this,b=a.actions.shift();if(!b)throw console.log(b,a.actions),"returned null action";a._applyAction(b),a.actions.push(b),clearTimeout(a.highestTimeoutId),a.highestTimeoutId=setTimeout(function(){a._sentenceLoop()},a.settings.interval)},g.prototype._applyAction=function(a){var b=this,c=document.getElementsByClassName(b.settings.namespace+"-word");[].forEach.call(c,function(a){b.settings.verbose&&console.log("replacing to- with from- for:",a),a.className=a.className.replace(b.toClass,b.fromClass)}),a.sub.map(function(a){b._subAction(a)}),a.remove.map(function(a){b._removeAction(a)}),a.keep.map(function(a){b._keepAction(a)}),b._performInsertions(a.insert)},g.prototype._removeAction=function(a){var b=this,c=b.fromClass+a.fromIndex,d={fromIndexClass:c,word:document.querySelector(b.wrapperSelector+" ."+c),visible:document.querySelector(b.wrapperSelector+" ."+c+b.visibleClass),invisible:document.querySelector(b.wrapperSelector+" ."+c+b.invisibleClass),newText:""};b.settings.verbose&&console.log("remove",d),new h("remove",b,d)},g.prototype._performInsertions=function(a){var b=this;setTimeout(function(){a.forEach(function(a){var c=e(b.settings.namespace,a.toIndex);if(0===a.toIndex)b.wrapper.insertAdjacentHTML("afterbegin",c);else{var d=b.wrapperSelector+" ."+b.toClass+(a.toIndex-1),f=document.querySelector(d);f.insertAdjacentHTML("afterend",c)}var g=b.toClass+a.toIndex,i={toIndexClass:g,word:document.querySelector(b.wrapperSelector+" ."+g),visible:document.querySelector(b.wrapperSelector+" ."+g+b.visibleClass),invisible:document.querySelector(b.wrapperSelector+" ."+g+b.invisibleClass),newText:a.toWord};b.settings.verbose&&console.log("insert",i),new h("insert",b,i)})},b.settings.speed)},g.prototype._subAction=function(a){var b=this,c=b.fromClass+a.fromIndex,d={fromIndexClass:c,toIndexClass:b.toClass+a.toIndex,word:document.querySelector(b.wrapperSelector+" ."+c),visible:document.querySelector(b.wrapperSelector+" ."+c+b.visibleClass),invisible:document.querySelector(b.wrapperSelector+" ."+c+b.invisibleClass),newText:a.toWord};b.settings.verbose&&console.log("sub",d),new h("sub",b,d)},g.prototype._keepAction=function(a){var b=this,c=b.fromClass+a.fromIndex,d={fromIndexClass:c,toIndexClass:b.toClass+a.toIndex,word:document.querySelector(b.wrapperSelector+" ."+c)};b.settings.verbose&&console.log("keep",d),new h("keep",b,d)},h.prototype._reIndex=function(){var a=this,b=a.ctx;a.sub.settings.verbose&&console.log("_reIndex ",b.word.innerText," from ",b.fromIndexClass," to ",b.toIndexClass),b.word.className=b.word.className.replace(b.fromIndexClass,b.toIndexClass),a.steps.shift(),a.steps.length>0&&a.steps[0]()},h.prototype._fadeOut=function(){var a=this,b=a.ctx;a.sub.settings.verbose&&console.log("_fadeOut"),b.visible.className+=a.animatingClass,a.steps.shift(),b.visible.addEventListener(a.transitionEnd,a.steps[0],!1),b.invisible.style.width=b.invisible.offsetWidth+"px",b.visible.style.opacity=0},h.prototype._setWidth=function(){var a=this,b=a.ctx;a.sub.settings.verbose&&console.log("_setWidth"),b.visible.className=b.visible.className.replace(a.animatingClass,""),b.invisible.className+=a.animatingClass,b.visible.removeEventListener(a.transitionEnd,a.steps[0],!1),a.steps.shift(),b.invisible.addEventListener(a.transitionEnd,a.steps[0],!1);var c=a._calculateWordWidth(b.newText,a.sub.wrapper.tagName,a.sub.wrapper.className.split(" "));setTimeout(function(){b.invisible.style.width=c+"px"},5)},h.prototype._removeElement=function(){var a=this,b=a.ctx;a.sub.settings.verbose&&console.log("_removeElement"),b.invisible.removeEventListener(a.transitionEnd,a.steps[0],!1),a.sub.wrapper.removeChild(b.word)},h.prototype._setTextAndFadeIn=function(){var a=this,b=a.ctx;a.sub.settings.verbose&&console.log("_setTextAndFadeIn"),b.invisible.className=b.invisible.className.replace(a.animatingClass,""),b.visible.className+=a.animatingClass,b.invisible.removeEventListener(a.transitionEnd,a.steps[0],!1),a.steps.shift(),b.visible.addEventListener(a.transitionEnd,a.steps[0],!1),b.visible.innerHTML=b.newText,b.invisible.innerHTML=b.newText,b.visible.style.opacity=1},h.prototype._cleanUp=function(){var a=this,b=a.ctx;a.sub.settings.verbose&&console.log("_cleanUp"),b.invisible.className=b.invisible.className.replace(a.animatingClass,""),b.visible.className=b.visible.className.replace(a.animatingClass,""),b.visible.removeEventListener(a.transitionEnd,a.steps[0],!1),b.invisible.style.width="auto"},h.prototype._calculateWordWidth=function(b,c,d){var e=this,f=document.createElement(c);d=d||[],d.push(e.sub.settings.namespace+"-text-width-calculation"),f.setAttribute("class",d.join(" ")),f.innerHTML=b,document.body.appendChild(f);var g=parseFloat(a.getComputedStyle(f,null).width);return f.parentNode.removeChild(f),g},a.Sub=g}(window);