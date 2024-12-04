import{u as S,r,a as E,j as e}from"./components-9TVjVNdt.js";import{C as U}from"./Card-Bc0Lcq-1.js";import{B as i}from"./Button-CDHjtM4L.js";import{I as F}from"./Input-Dy9uozZT.js";import{S as k}from"./Select-B3oI0161.js";import{M as g}from"./Modal-Bz2tyEF1.js";import{A as T}from"./Alert-BBZG7UN2.js";import{E as O}from"./EmptyState-CVykgcpg.js";function _(){const{documents:p,error:x}=S(),[s,h]=r.useState(null),[d,f]=r.useState(!1),[j,N]=r.useState("resume"),[w,c]=r.useState(!1),[v,n]=r.useState(null),[m,u]=r.useState(null),l=r.useRef(null),y=E();if(x)return e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h1",{className:"text-2xl font-bold text-red-600 mb-4",children:"Error"}),e.jsx("p",{className:"text-gray-600",children:x})]})});const b=t=>{var o;const a=(o=t.target.files)==null?void 0:o[0];a&&(u(a),n(null))},C=async()=>{if(!m){n("Please select a file");return}f(!0),n(null);const t=new FormData;t.append("file",m),t.append("type",j);try{const a=await fetch("/api/documents/upload",{method:"POST",body:t,credentials:"include"});if(!a.ok){const o=await a.json();throw new Error(o.error||"Failed to upload document")}l.current&&(l.current.value=""),u(null),c(!1),y.revalidate()}catch(a){n(a instanceof Error?a.message:"Failed to upload document")}finally{f(!1)}},D=async t=>{try{const a=await fetch(`/api/documents/${t}`,{method:"DELETE",credentials:"include"});if(!a.ok){const o=await a.json();throw new Error(o.error||"Failed to delete document")}y.revalidate()}catch(a){n(a instanceof Error?a.message:"Failed to delete document")}};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("h1",{className:"text-2xl font-bold",children:"Documents"}),e.jsx(i,{onClick:()=>c(!0),children:"Upload Document"})]}),v&&e.jsx(T,{variant:"error",onClose:()=>n(null),children:v}),p.length===0?e.jsx(O,{title:"No documents",description:"Upload your first document to get started",action:e.jsx(i,{onClick:()=>c(!0),children:"Upload Document"})}):e.jsx("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:p.map(t=>e.jsx(U,{variant:"bordered",className:"p-4",children:e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold",children:t.name}),e.jsx("p",{className:"text-sm text-gray-500 capitalize",children:t.type}),e.jsx("p",{className:"text-sm text-gray-500",children:new Date(t.uploadedAt).toLocaleDateString()})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(i,{variant:"secondary",onClick:()=>h(t),children:"View"}),e.jsx(i,{variant:"outline",onClick:()=>D(t.id),children:"Delete"})]})]})},t.id))}),e.jsx(g,{isOpen:w,onClose:()=>{c(!1),u(null),l.current&&(l.current.value="")},title:"Upload Document",children:e.jsxs("div",{className:"space-y-4",children:[e.jsx(k,{label:"Document Type",value:j,onChange:t=>N(t.target.value),options:[{value:"resume",label:"Resume"},{value:"job_description",label:"Job Description"},{value:"cover_letter",label:"Cover Letter"},{value:"other",label:"Other"}]}),e.jsx(F,{ref:l,type:"file",accept:".pdf,.doc,.docx,.txt",onChange:b,disabled:d}),e.jsx("p",{className:"text-sm text-gray-500",children:"Supported formats: PDF, DOC, DOCX, TXT"}),e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx(i,{variant:"outline",onClick:()=>{c(!1),u(null),l.current&&(l.current.value="")},disabled:d,children:"Cancel"}),e.jsx(i,{onClick:C,disabled:!m||d,children:d?"Uploading...":"Upload"})]})]})}),e.jsx(g,{isOpen:!!s,onClose:()=>h(null),title:(s==null?void 0:s.name)??"",children:e.jsx("div",{className:"max-h-[60vh] overflow-y-auto",children:e.jsx("pre",{className:"whitespace-pre-wrap",children:s==null?void 0:s.content})})})]})}export{_ as default};