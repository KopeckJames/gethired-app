import{r as s,j as e}from"./components-9TVjVNdt.js";import{C as w}from"./Card-Bc0Lcq-1.js";import{B as j}from"./Button-CDHjtM4L.js";import{I as y}from"./Input-Dy9uozZT.js";function b({title:n,titleId:o,...i},c){return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:c,"aria-labelledby":o},i),n?s.createElement("title",{id:o},n):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"}))}const v=s.forwardRef(b);function N(){const[n,o]=s.useState([{role:"assistant",content:"Hello! I'm your career advisor. I can help you with resume writing, job search strategies, interview preparation, and career development. What would you like assistance with?"}]),[i,c]=s.useState(""),[d,u]=s.useState(!1),[m,p]=s.useState(null),x=s.useRef(null),g=()=>{var r;(r=x.current)==null||r.scrollIntoView({behavior:"smooth"})};s.useEffect(()=>{g()},[n]);const f=async r=>{if(r.preventDefault(),!i.trim()||d)return;const l={role:"user",content:i.trim()};o(a=>[...a,l]),c(""),u(!0),p(null);try{console.log("Sending chat request with messages:",[...n,l]);const a=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({messages:[...n,l]})}),t=await a.json();if(console.log("Chat response:",t),!a.ok)throw new Error(t.error||"Failed to send message");if(t.error)throw new Error(t.error);if(!t.response)throw new Error("No response received from assistant");o(h=>[...h,{role:"assistant",content:t.response}])}catch(a){console.error("Chat error:",a);const t=a instanceof Error?a.message:"An unexpected error occurred";p(t),o(h=>[...h,{role:"assistant",content:`Error: ${t}. Please try again or refresh the page if the problem persists.`}])}finally{u(!1)}};return e.jsx(w,{variant:"bordered",className:"h-[calc(100vh-12rem)]",children:e.jsxs("div",{className:"flex flex-col h-full",children:[e.jsxs("div",{className:"flex-grow overflow-y-auto p-4 space-y-4",children:[n.map((r,l)=>e.jsx("div",{className:`flex ${r.role==="user"?"justify-end":"justify-start"}`,children:e.jsx("div",{className:`max-w-[80%] rounded-lg p-4 ${r.role==="user"?"bg-blue-600 text-white":r.content.startsWith("Error:")?"bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100":"bg-gray-100 dark:bg-gray-800"}`,children:e.jsx("div",{className:"whitespace-pre-wrap",children:r.content})})},l)),e.jsx("div",{ref:x})]}),m&&e.jsx("div",{className:"px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100",children:m}),e.jsx("div",{className:"p-4 border-t dark:border-gray-700",children:e.jsxs("form",{onSubmit:f,className:"flex gap-2",children:[e.jsx(y,{value:i,onChange:r=>c(r.target.value),placeholder:d?"Please wait...":"Type your message...",inputClassName:"flex-grow",containerClassName:"flex-grow",fullWidth:!0,disabled:d,onKeyDown:r=>{r.key==="Enter"&&!r.shiftKey&&(r.preventDefault(),f(r))}}),e.jsx(j,{type:"submit",disabled:d,className:"min-w-[44px] h-[44px] p-2",children:e.jsx(v,{className:"h-5 w-5"})})]})})]})})}const A=()=>[{title:"AI Career Assistant - GetHired"},{name:"description",content:"Chat with our AI career assistant for resume and job search help"}];function S(){return e.jsx("div",{className:"container mx-auto px-4 py-8",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsx("h1",{className:"text-2xl font-bold mb-6",children:"AI Career Assistant"}),e.jsxs("p",{className:"text-gray-600 dark:text-gray-300 mb-6",children:["Chat with our AI assistant for help with:",e.jsxs("ul",{className:"list-disc list-inside mt-2 space-y-1",children:[e.jsx("li",{children:"Resume writing and optimization"}),e.jsx("li",{children:"Job search strategies"}),e.jsx("li",{children:"Interview preparation"}),e.jsx("li",{children:"Career development advice"}),e.jsx("li",{children:"Professional networking tips"})]})]}),e.jsx(N,{})]})})}export{S as default,A as meta};