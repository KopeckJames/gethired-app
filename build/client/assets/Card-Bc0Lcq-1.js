import{j as e}from"./components-9TVjVNdt.js";const u={default:"bg-white",elevated:"bg-white shadow-lg hover:shadow-xl transition-shadow",bordered:"bg-white border border-slate-200"};function j({variant:m="default",className:b="",cardTitle:s,description:t,footer:l,isInteractive:n=!1,isSelected:d=!1,onClick:a,children:o,...x}){const c="rounded-lg overflow-hidden",f=n?"cursor-pointer hover:bg-slate-50 transition-colors":"",g=d?"ring-2 ring-blue-500 ring-offset-2":"",i=`${c} ${u[m]} ${f} ${g} ${b}`,h=e.jsxs(e.Fragment,{children:[(s||t)&&e.jsxs("div",{className:"p-6",children:[s&&e.jsx("h3",{className:"text-lg font-medium text-slate-900",children:s}),t&&e.jsx("div",{className:"mt-2 text-sm text-slate-600",children:t})]}),o&&e.jsx("div",{className:`${s||t?"":"p-6"}`,children:o}),l&&e.jsx("div",{className:"px-6 py-4 bg-slate-50 border-t border-slate-200",children:l})]});return n?e.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyDown:r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),a==null||a())},className:i,"aria-pressed":d,...x,children:h}):e.jsx("div",{className:i,...x,children:h})}export{j as C};
