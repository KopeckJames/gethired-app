import{j as e,r as h}from"./components-BTXmr68H.js";import{u as v,a as w}from"./ApplicationContext-DY6RkFxv.js";import{B as d}from"./Button-BZG3s6SU.js";import{C as N}from"./Card-Cg6ocORJ.js";import{M as D}from"./Modal-Cd9pgKqa.js";import{I as r}from"./Input-8y3g3GgE.js";import{S as f}from"./Select-RG5OTrzS.js";import{T as j}from"./Textarea-Bh5RDoem.js";import{E as C}from"./EmptyState-XxnvsSZc.js";import"./Alert-DdMCfCTw.js";const I={info:"bg-blue-100 text-blue-700",success:"bg-green-100 text-green-700",warning:"bg-yellow-100 text-yellow-700",error:"bg-red-100 text-red-700",default:"bg-slate-100 text-slate-700"},O={info:"bg-blue-500",success:"bg-green-500",warning:"bg-yellow-500",error:"bg-red-500",default:"bg-slate-500"},k={sm:"px-2 py-0.5 text-xs",md:"px-2.5 py-1 text-sm",lg:"px-3 py-1.5 text-base"},E={sm:"w-1.5 h-1.5",md:"w-2 h-2",lg:"w-2.5 h-2.5"};function T({variant:l="default",size:n="md",className:o="",withDot:p=!1,isAnimated:a=!1,children:u,...m}){const x="inline-flex items-center justify-center font-medium rounded-full transition-colors duration-200",g=a?"animate-pulse":"",c=`${x} ${I[l]} ${k[n]} ${g} ${o}`;return e.jsxs("span",{className:c,...m,children:[p&&e.jsx("span",{className:`${E[n]} rounded-full ${O[l]} mr-1.5 transition-colors duration-200`,"aria-hidden":"true"}),u]})}const i={Applied:"Applied",Interview:"Interview",Offer:"Offer",Rejected:"Rejected"};function L(l,n="short"){const o=new Date(l);return n==="short"?o.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):o.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}function J(){const{dispatch:l,getFilteredAndSortedApplications:n}=v(),{addNotification:o}=w(),[p,a]=h.useState(!1),[u,m]=h.useState(""),[x,g]=h.useState([]),c=n(),b=t=>{t.preventDefault();const s=new FormData(t.currentTarget),A={id:crypto.randomUUID(),company:s.get("company"),position:s.get("position"),status:s.get("status"),dateApplied:s.get("dateApplied"),location:s.get("location"),salary:s.get("salary"),description:s.get("description"),notes:s.get("notes"),url:s.get("url"),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};l({type:"ADD_APPLICATION",payload:A}),o("success","Success!","Application added successfully"),a(!1)},y=t=>{g(t)},S=t=>{switch(t){case i.Applied:return"default";case i.Interview:return"warning";case i.Offer:return"success";case i.Rejected:return"error";default:return"default"}};return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-8 flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold",children:"Applications"}),e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-400",children:"Track and manage your job applications"})]}),e.jsx(d,{onClick:()=>a(!0),children:"Add Application"})]}),e.jsxs("div",{className:"mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",children:[e.jsx(r,{label:"Search",placeholder:"Search by company or position...",value:u,onChange:t=>m(t.target.value)}),e.jsx(f,{label:"Status",multiple:!0,value:x,onChange:y,options:Object.values(i).map(t=>({label:t,value:t}))})]}),c.length===0?e.jsx(C,{title:"No applications yet",description:"Start tracking your job applications by clicking the button below.",action:e.jsx(d,{onClick:()=>a(!0),children:"Add Application"})}):e.jsx("div",{className:"grid gap-4 sm:grid-cols-2 lg:grid-cols-3",children:c.map(t=>e.jsx(N,{children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold",children:t.company}),e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-400",children:t.position})]}),e.jsx(T,{variant:S(t.status),children:t.status})]}),e.jsxs("div",{className:"text-sm text-slate-600 dark:text-slate-400",children:[e.jsxs("p",{children:["Applied: ",L(t.dateApplied)]}),t.location&&e.jsxs("p",{children:["Location: ",t.location]}),t.salary&&e.jsxs("p",{children:["Salary: ",t.salary]})]}),t.description&&e.jsx("p",{className:"text-sm",children:t.description}),t.url&&e.jsx("a",{href:t.url,target:"_blank",rel:"noopener noreferrer",className:"text-sm text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400",children:"View Job Posting →"})]})},t.id))}),e.jsx(D,{isOpen:p,onClose:()=>a(!1),title:"Add Application",children:e.jsxs("form",{onSubmit:b,className:"space-y-4",children:[e.jsx(r,{label:"Company",name:"company",required:!0,placeholder:"Enter company name"}),e.jsx(r,{label:"Position",name:"position",required:!0,placeholder:"Enter job position"}),e.jsx(f,{label:"Status",name:"status",required:!0,options:Object.values(i).map(t=>({label:t,value:t}))}),e.jsx(r,{label:"Date Applied",name:"dateApplied",type:"date",required:!0,defaultValue:new Date().toISOString().split("T")[0]}),e.jsx(r,{label:"Location",name:"location",placeholder:"Enter job location"}),e.jsx(r,{label:"Salary",name:"salary",placeholder:"Enter salary range"}),e.jsx(r,{label:"Job URL",name:"url",type:"url",placeholder:"Enter job posting URL"}),e.jsx(j,{label:"Description",name:"description",placeholder:"Enter job description"}),e.jsx(j,{label:"Notes",name:"notes",placeholder:"Enter any additional notes"}),e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx(d,{variant:"secondary",onClick:()=>a(!1),type:"button",children:"Cancel"}),e.jsx(d,{type:"submit",children:"Add Application"})]})]})})]})}export{J as default};