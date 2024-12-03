import{j as e,r as f}from"./components-9TVjVNdt.js";import{u as M,a as T}from"./ApplicationContext-DeSwkrAo.js";import{B as g}from"./Button-CDHjtM4L.js";import{C as B}from"./Card-Bc0Lcq-1.js";import{E as q,M as z}from"./EmptyState-kBjyyLjp.js";import{I as o}from"./Input-Dy9uozZT.js";import{S as $}from"./Select-B3oI0161.js";import"./Alert-BBZG7UN2.js";const F={info:"bg-blue-100 text-blue-700",success:"bg-green-100 text-green-700",warning:"bg-yellow-100 text-yellow-700",error:"bg-red-100 text-red-700",default:"bg-slate-100 text-slate-700"},V={info:"bg-blue-500",success:"bg-green-500",warning:"bg-yellow-500",error:"bg-red-500",default:"bg-slate-500"},_={sm:"px-2 py-0.5 text-xs",md:"px-2.5 py-1 text-sm",lg:"px-3 py-1.5 text-base"},H={sm:"w-1.5 h-1.5",md:"w-2 h-2",lg:"w-2.5 h-2.5"};function J({variant:l="default",size:a="md",className:r="",withDot:m=!1,isAnimated:n=!1,children:i,...d}){const x="inline-flex items-center justify-center font-medium rounded-full transition-colors duration-200",b=n?"animate-pulse":"",c=`${x} ${F[l]} ${_[a]} ${b} ${r}`;return e.jsxs("span",{className:c,...d,children:[m&&e.jsx("span",{className:`${H[a]} rounded-full ${V[l]} mr-1.5 transition-colors duration-200`,"aria-hidden":"true"}),i]})}const G={default:"bg-white border border-slate-300 focus:border-blue-500",filled:"bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500"},K={sm:"px-3 py-1.5 text-sm",md:"px-4 py-2",lg:"px-4 py-3 text-lg"},Q={valid:"border-green-500 focus:border-green-500",invalid:"border-red-500 focus:border-red-500",none:""},N=f.forwardRef(({label:l,helperText:a,errorText:r,variant:m="default",size:n="md",fullWidth:i=!1,validation:d="none",containerClassName:x="",textareaClassName:b="",labelClassName:c="",helperTextClassName:y="",errorTextClassName:j="",id:S,disabled:t,required:s,autoResize:A=!1,maxRows:k=10,rows:D=3,onChange:v,...I},O)=>{const u=S||`textarea-${Math.random().toString(36).substr(2,9)}`,w=d==="invalid"||!!r,C=`
    block rounded-md 
    text-slate-900
    placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
    resize-none
  `,E=i?"w-full":"",L=`
    ${C}
    ${G[m]}
    ${K[n]}
    ${Q[d]}
    ${E}
    ${b}
  `,P={"aria-invalid":w,"aria-describedby":w?`${u}-error`:a?`${u}-helper`:void 0},R=h=>{if(A){h.target.style.height="auto";const U=Math.min(h.target.scrollHeight,k*24);h.target.style.height=`${U}px`}v==null||v(h)};return e.jsxs("div",{className:`${i?"w-full":""} ${x}`,children:[l&&e.jsxs("label",{htmlFor:u,className:`block text-sm font-medium text-slate-700 mb-1 ${c}`,children:[l,s&&e.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),e.jsx("textarea",{...I,...P,ref:O,id:u,disabled:t,required:s,rows:D,onChange:R,className:L}),(a||r)&&e.jsxs("div",{className:"mt-1",children:[a&&!w&&e.jsx("p",{id:`${u}-helper`,className:`text-sm text-slate-600 ${y}`,children:a}),r&&e.jsx("p",{id:`${u}-error`,className:`text-sm text-red-500 ${j}`,role:"alert",children:r})]})]})});N.displayName="Textarea";const p={Applied:"Applied",Interview:"Interview",Offer:"Offer",Rejected:"Rejected"};function X(l,a="short"){const r=new Date(l);return a==="short"?r.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):r.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}function le(){const{dispatch:l,getFilteredAndSortedApplications:a}=M(),{addNotification:r}=T(),[m,n]=f.useState(!1),[i,d]=f.useState(""),[x,b]=f.useState([]),c=a(),y=t=>{t.preventDefault();const s=new FormData(t.currentTarget),A={id:crypto.randomUUID(),company:s.get("company"),position:s.get("position"),status:s.get("status"),dateApplied:s.get("dateApplied"),location:s.get("location"),salary:s.get("salary"),description:s.get("description"),notes:s.get("notes"),url:s.get("url"),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};l({type:"ADD_APPLICATION",payload:A}),r("success","Success!","Application added successfully"),n(!1)},j=t=>{b(t)},S=t=>{switch(t){case p.Applied:return"default";case p.Interview:return"warning";case p.Offer:return"success";case p.Rejected:return"error";default:return"default"}};return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-8 flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold",children:"Applications"}),e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-400",children:"Track and manage your job applications"})]}),e.jsx(g,{onClick:()=>n(!0),children:"Add Application"})]}),e.jsxs("div",{className:"mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",children:[e.jsx(o,{label:"Search",placeholder:"Search by company or position...",value:i,onChange:t=>d(t.target.value)}),e.jsx($,{label:"Status",multiple:!0,value:x,onChange:j,options:Object.values(p).map(t=>({label:t,value:t}))})]}),c.length===0?e.jsx(q,{title:"No applications yet",description:"Start tracking your job applications by clicking the button below.",action:e.jsx(g,{onClick:()=>n(!0),children:"Add Application"})}):e.jsx("div",{className:"grid gap-4 sm:grid-cols-2 lg:grid-cols-3",children:c.map(t=>e.jsx(B,{children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold",children:t.company}),e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-400",children:t.position})]}),e.jsx(J,{variant:S(t.status),children:t.status})]}),e.jsxs("div",{className:"text-sm text-slate-600 dark:text-slate-400",children:[e.jsxs("p",{children:["Applied: ",X(t.dateApplied)]}),t.location&&e.jsxs("p",{children:["Location: ",t.location]}),t.salary&&e.jsxs("p",{children:["Salary: ",t.salary]})]}),t.description&&e.jsx("p",{className:"text-sm",children:t.description}),t.url&&e.jsx("a",{href:t.url,target:"_blank",rel:"noopener noreferrer",className:"text-sm text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400",children:"View Job Posting →"})]})},t.id))}),e.jsx(z,{isOpen:m,onClose:()=>n(!1),title:"Add Application",children:e.jsxs("form",{onSubmit:y,className:"space-y-4",children:[e.jsx(o,{label:"Company",name:"company",required:!0,placeholder:"Enter company name"}),e.jsx(o,{label:"Position",name:"position",required:!0,placeholder:"Enter job position"}),e.jsx($,{label:"Status",name:"status",required:!0,options:Object.values(p).map(t=>({label:t,value:t}))}),e.jsx(o,{label:"Date Applied",name:"dateApplied",type:"date",required:!0,defaultValue:new Date().toISOString().split("T")[0]}),e.jsx(o,{label:"Location",name:"location",placeholder:"Enter job location"}),e.jsx(o,{label:"Salary",name:"salary",placeholder:"Enter salary range"}),e.jsx(o,{label:"Job URL",name:"url",type:"url",placeholder:"Enter job posting URL"}),e.jsx(N,{label:"Description",name:"description",placeholder:"Enter job description"}),e.jsx(N,{label:"Notes",name:"notes",placeholder:"Enter any additional notes"}),e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx(g,{variant:"secondary",onClick:()=>n(!1),type:"button",children:"Cancel"}),e.jsx(g,{type:"submit",children:"Add Application"})]})]})})]})}export{le as default};