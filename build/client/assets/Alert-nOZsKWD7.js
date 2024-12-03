import{r as c,j as e}from"./components-BgVkQzWd.js";const f={success:{bg:"bg-green-500/10",border:"border-green-500",text:"text-green-400",icon:e.jsx("svg",{className:"h-5 w-5",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})})},error:{bg:"bg-red-500/10",border:"border-red-500",text:"text-red-400",icon:e.jsx("svg",{className:"h-5 w-5",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})})},warning:{bg:"bg-yellow-500/10",border:"border-yellow-500",text:"text-yellow-400",icon:e.jsx("svg",{className:"h-5 w-5",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})})},info:{bg:"bg-blue-500/10",border:"border-blue-500",text:"text-blue-400",icon:e.jsx("svg",{className:"h-5 w-5",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",clipRule:"evenodd"})})}};function b({variant:n="info",title:r,children:o,dismissible:x=!1,autoClose:i=!1,autoCloseDelay:t=5e3,onClose:s,className:u="",icon:m}){const[a,d]=c.useState(!0);if(c.useEffect(()=>{if(i&&a){const v=setTimeout(()=>{d(!1),s==null||s()},t);return()=>clearTimeout(v)}},[i,t,a,s]),!a)return null;const l=f[n];return e.jsx("div",{role:"alert",className:`relative rounded-lg border ${l.border} ${l.bg} p-4 ${u}`,children:e.jsxs("div",{className:"flex",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("span",{className:l.text,children:m||l.icon})}),e.jsxs("div",{className:"ml-3 flex-1",children:[r&&e.jsx("h3",{className:`text-sm font-medium ${l.text}`,children:r}),e.jsx("div",{className:`text-sm ${r?"mt-2":""} ${l.text}`,children:o})]}),x&&e.jsx("div",{className:"ml-auto pl-3",children:e.jsx("div",{className:"-mx-1.5 -my-1.5",children:e.jsxs("button",{type:"button",onClick:()=>{d(!1),s==null||s()},className:`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${l.text} hover:${l.bg}`,"aria-label":"Dismiss",children:[e.jsx("span",{className:"sr-only",children:"Dismiss"}),e.jsx("svg",{className:"h-5 w-5",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",clipRule:"evenodd"})})]})})})]})})}export{b as A};
