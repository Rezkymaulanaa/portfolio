// Inline script for <head>: hides "reveal" elements before the first paint,
// unless the visitor prefers reduced motion. If RevealObserver never starts
// (JavaScript error), the content is shown again after 4 seconds.
export const revealScript = `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var d=document.documentElement;d.setAttribute("data-reveal","");setTimeout(function(){if(!window.__revealReady)d.removeAttribute("data-reveal")},4000)}catch(e){}})()`;
