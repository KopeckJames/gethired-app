import{r as R,j as e}from"./components-9TVjVNdt.js";const B={default:"bg-white border border-slate-300 focus:border-blue-500",filled:"bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500"},F={sm:"px-3 py-1.5 text-sm",md:"px-4 py-2",lg:"px-4 py-3 text-lg"},I={valid:"border-green-500 focus:border-green-500",invalid:"border-red-500 focus:border-red-500",none:""},P=R.forwardRef(({label:d,helperText:s,errorText:a,variant:m="default",size:x="md",fullWidth:i=!1,validation:n="none",containerClassName:b="",textareaClassName:f="",labelClassName:u="",helperTextClassName:p="",errorTextClassName:h="",id:$,disabled:g,required:c,autoResize:y=!1,maxRows:j=10,rows:v=3,onChange:o,...w},N)=>{const t=$||`textarea-${Math.random().toString(36).substr(2,9)}`,l=n==="invalid"||!!a,S=`
    block rounded-md 
    text-slate-900
    placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
    resize-none
  `,E=i?"w-full":"",k=`
    ${S}
    ${B[m]}
    ${F[x]}
    ${I[n]}
    ${E}
    ${f}
  `,z={"aria-invalid":l,"aria-describedby":l?`${t}-error`:s?`${t}-helper`:void 0},H=r=>{if(y){r.target.style.height="auto";const M=Math.min(r.target.scrollHeight,j*24);r.target.style.height=`${M}px`}o==null||o(r)};return e.jsxs("div",{className:`${i?"w-full":""} ${b}`,children:[d&&e.jsxs("label",{htmlFor:t,className:`block text-sm font-medium text-slate-700 mb-1 ${u}`,children:[d,c&&e.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),e.jsx("textarea",{...w,...z,ref:N,id:t,disabled:g,required:c,rows:v,onChange:H,className:k}),(s||a)&&e.jsxs("div",{className:"mt-1",children:[s&&!l&&e.jsx("p",{id:`${t}-helper`,className:`text-sm text-slate-600 ${p}`,children:s}),a&&e.jsx("p",{id:`${t}-error`,className:`text-sm text-red-500 ${h}`,role:"alert",children:a})]})]})});P.displayName="Textarea";export{P as T};
