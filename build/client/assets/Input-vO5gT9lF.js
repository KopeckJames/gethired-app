import{r as k,j as s}from"./components-BgVkQzWd.js";const B={default:"bg-white border border-slate-300 focus:border-blue-500",filled:"bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500"},F={sm:"px-3 py-1.5 text-sm",md:"px-4 py-2",lg:"px-4 py-3 text-lg"},I={valid:"border-green-500 focus:border-green-500",invalid:"border-red-500 focus:border-red-500",none:""},p={sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6"},L=k.forwardRef(({label:d,helperText:t,errorText:a,variant:u="default",size:l="md",fullWidth:i=!1,validation:c="none",leftIcon:n,rightIcon:r,containerClassName:x="",inputClassName:b="",labelClassName:f="",helperTextClassName:h="",errorTextClassName:$="",id:y,disabled:j,required:m,...v},g)=>{const e=y||`input-${Math.random().toString(36).substr(2,9)}`,o=c==="invalid"||!!a,N=`
    block rounded-md 
    text-slate-900
    placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  `,w=i?"w-full":"",S=n?"pl-10":"",E=r?"pr-10":"",P=`
    ${N}
    ${B[u]}
    ${F[l]}
    ${I[c]}
    ${w}
    ${S}
    ${E}
    ${b}
  `,R={"aria-invalid":o,"aria-describedby":o?`${e}-error`:t?`${e}-helper`:void 0};return s.jsxs("div",{className:`${i?"w-full":""} ${x}`,children:[d&&s.jsxs("label",{htmlFor:e,className:`block text-sm font-medium text-slate-700 mb-1 ${f}`,children:[d,m&&s.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),s.jsxs("div",{className:"relative",children:[n&&s.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500",children:s.jsx("span",{className:p[l],children:n})}),s.jsx("input",{...v,...R,ref:g,id:e,disabled:j,required:m,className:P}),r&&s.jsx("div",{className:"absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500",children:s.jsx("span",{className:p[l],children:r})})]}),(t||a)&&s.jsxs("div",{className:"mt-1",children:[t&&!o&&s.jsx("p",{id:`${e}-helper`,className:`text-sm text-slate-600 ${h}`,children:t}),a&&s.jsx("p",{id:`${e}-error`,className:`text-sm text-red-500 ${$}`,role:"alert",children:a})]})]})});L.displayName="Input";export{L as I};
