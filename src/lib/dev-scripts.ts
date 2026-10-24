// Inline <head> script for development only: some browser extensions (form
// fillers, password managers) add an "fdprocessedid" attribute to every
// button and input before React starts. React then reports a hydration
// mismatch for each of them, although nothing is wrong with the page.
// This removes the attribute again as soon as it is added, during the first
// seconds of the page. In production React does not report these at all.
export const stripExtensionAttributesScript = `(function(){try{var a="fdprocessedid",o=new MutationObserver(function(l){for(var i=0;i<l.length;i++){var t=l[i].target;if(t.hasAttribute&&t.hasAttribute(a))t.removeAttribute(a)}});o.observe(document.documentElement,{attributes:true,attributeFilter:[a],subtree:true});setTimeout(function(){o.disconnect()},10000)}catch(e){}})()`;
