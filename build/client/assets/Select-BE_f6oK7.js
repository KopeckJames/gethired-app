import{r as B,j as e}from"./components-BgVkQzWd.js";const M={default:"bg-white border border-slate-300 focus:border-blue-500",filled:"bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500"},C={sm:"px-3 py-1.5 text-sm",md:"px-4 py-2",lg:"px-4 py-3 text-lg"},F={valid:"border-green-500 focus:border-green-500",invalid:"border-red-500 focus:border-red-500",none:""},I=B.forwardRef(({label:d,helperText:t,errorText:a,variant:m="default",size:b="md",fullWidth:o=!1,validation:n="none",options:x,placeholder:i,containerClassName:u="",selectClassName:p="",labelClassName:f="",helperTextClassName:h="",errorTextClassName:v="",id:g,disabled:$,required:c,value:j,defaultValue:w,onChange:y,...N},S)=>{const s=g||`select-${Math.random().toString(36).substr(2,9)}`,r=n==="invalid"||!!a,R=`
    block rounded-md 
    text-slate-900
    appearance-none bg-no-repeat bg-right
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
    pr-10
  `,E=o?"w-full":"",k=`
    ${R}
    ${M[m]}
    ${C[b]}
    ${F[n]}
    ${E}
    ${p}
  `,z={"aria-invalid":r,"aria-describedby":r?`${s}-error`:t?`${s}-helper`:void 0};return e.jsxs("div",{className:`${o?"w-full":""} ${u}`,children:[d&&e.jsxs("label",{htmlFor:s,className:`block text-sm font-medium text-slate-700 mb-1 ${f}`,children:[d,c&&e.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),e.jsxs("div",{className:"relative",children:[e.jsxs("select",{...N,...z,ref:S,id:s,disabled:$,required:c,value:j,defaultValue:w,onChange:y,className:k,children:[i&&e.jsx("option",{value:"",disabled:!0,className:"text-slate-500",children:i}),x.map(l=>e.jsx("option",{value:l.value,disabled:l.disabled,className:l.disabled?"text-slate-400":"",children:l.label},l.value))]}),e.jsx("div",{className:"pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500",children:e.jsx("svg",{className:"h-5 w-5",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",children:e.jsx("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})})})]}),(t||a)&&e.jsxs("div",{className:"mt-1",children:[t&&!r&&e.jsx("p",{id:`${s}-helper`,className:`text-sm text-slate-600 ${h}`,children:t}),a&&e.jsx("p",{id:`${s}-error`,className:`text-sm text-red-500 ${v}`,role:"alert",children:a})]})]})});I.displayName="Select";export{I as S};
