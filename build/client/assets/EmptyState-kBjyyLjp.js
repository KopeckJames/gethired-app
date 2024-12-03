import{r as d,b as v,j as e}from"./components-9TVjVNdt.js";const p={sm:"max-w-md",md:"max-w-lg",lg:"max-w-2xl",xl:"max-w-4xl"};function j({isOpen:a,onClose:t,title:s,children:x,footer:o,size:u="md",closeOnOverlayClick:f=!0,initialFocus:i=!0}){const c=d.useRef(null),n=d.useRef(null),m=d.useRef(null);d.useEffect(()=>{if(a){m.current=document.activeElement,document.body.style.overflow="hidden",i&&n.current&&n.current.focus();const l=r=>{r.key==="Escape"&&t()};return document.addEventListener("keydown",l),()=>{var r;document.removeEventListener("keydown",l),document.body.style.overflow="unset",(r=m.current)==null||r.focus()}}},[a,t,i]);const b=l=>{f&&l.target===c.current&&t()};if(!a)return null;const h=e.jsxs("div",{className:"fixed inset-0 z-50 overflow-y-auto",role:"dialog","aria-modal":"true","aria-labelledby":"modal-title",children:[e.jsx("div",{ref:c,className:"fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn",onClick:b,"aria-hidden":"true"}),e.jsx("div",{className:"flex min-h-screen items-center justify-center p-4",children:e.jsxs("div",{ref:n,className:`${p[u]} w-full relative bg-slate-800 rounded-lg shadow-xl animate-slideIn`,tabIndex:-1,role:"dialog","aria-labelledby":"modal-title",children:[e.jsxs("div",{className:"px-6 py-4 border-b border-slate-700",children:[e.jsx("h2",{id:"modal-title",className:"text-lg font-medium text-white",children:s}),e.jsx("button",{type:"button",className:"absolute top-4 right-4 text-slate-400 hover:text-slate-300 transition-colors",onClick:t,"aria-label":"Close modal",children:e.jsx("svg",{className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor","aria-hidden":"true",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsx("div",{className:"px-6 py-4",children:x}),o&&e.jsx("div",{className:"px-6 py-4 border-t border-slate-700 bg-slate-800/50",children:o})]})})]});return v.createPortal(h,document.body)}function g({title:a,description:t,action:s}){return e.jsx("div",{className:"flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900",children:e.jsxs("div",{className:"mx-auto max-w-md",children:[e.jsx("h3",{className:"text-xl font-semibold",children:a}),e.jsx("p",{className:"mt-2 text-sm text-slate-600 dark:text-slate-400",children:t}),s&&e.jsx("div",{className:"mt-6",children:s})]})})}export{g as E,j as M};