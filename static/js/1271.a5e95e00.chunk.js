"use strict";(self.webpackChunkfrontend_app=self.webpackChunkfrontend_app||[]).push([[1271],{32952:(e,n,i)=>{i.d(n,{Z:()=>d});i(47313);var s=i(79536),t=i(6306),r=i(54045),o=i(99249),a=i(75975),l=i(78925),c=i(46417);function d(e){let{files:n=[],treeView:i=!0}=e;const d=async e=>{if(void 0===e)return;const i=n.find((n=>n.id===e));if(i)if(i.downloadUrl){const e=await fetch(i.downloadUrl),n=await e.blob();(0,l.saveAs)(n,i.name)}else console.error("File not found")};return(0,c.jsx)(s.Z,{sx:{flexGrow:1},children:i?(0,c.jsx)(o.L,{"aria-label":"file system navigator",defaultCollapseIcon:(0,c.jsx)(t.Z,{}),defaultExpandIcon:(0,c.jsx)(r.Z,{}),children:0!==n.length&&(0,c.jsx)(a.k,{nodeId:"root",label:"Files",children:n.map(((e,n)=>(0,c.jsx)("div",{className:"thumbnail",children:(0,c.jsx)("a",{href:e.downloadUrl,style:{display:"block",wordBreak:"break-word",whiteSpace:"normal"},onClick:n=>{n.preventDefault(),d(e.id)},children:e.name},e.id)},n)))})}):(0,c.jsx)("div",{className:"thumbnail",children:n.map(((e,n)=>(0,c.jsx)("a",{href:e.downloadUrl,style:{display:"block",wordBreak:"break-word",whiteSpace:"normal"},onClick:n=>{n.preventDefault(),d(e.id)},children:e.name},e.id)))})})}},71271:(e,n,i)=>{i.r(n),i.d(n,{default:()=>W});var s=i(61317),t=i(9019),r=i(79536),o=i(62481),a=i(9289),l=i(47131),c=i(73428),d=i(19536),m=i(75908),p=i(17592),x=i(74594),h=i(90200),u=i(3855),g=i(99140),_=i(95087),j=i(92556),Z=i(31845),f=i(80007),y=i(63408),w=i(99221),b=i(10658),v=i.n(b),P=i(47313),k=i(58467);const C={root:"styles_root__nIFcc",container:"styles_container__pw+sQ",mainContent:"styles_mainContent__H3vDq",formBody:"styles_formBody__GAcVN",drawerBody:"styles_drawerBody__XsgSK",drawerFieldContainer:"styles_drawerFieldContainer__49wmk",textEditor:"styles_textEditor__btWv8",breadcumpWrapper:"styles_breadcumpWrapper__EVLZt",icArrow:"styles_icArrow__njLd1",cursorPointer:"styles_cursorPointer__9SFvn"};var S=i(32952),N=i(47477),A=i(90469),F=i(96447),I=i(75590),B=i(46417);const D=(0,p.ZP)("main",{shouldForwardProp:e=>"open"!==e})((e=>{let{theme:n,open:i}=e;return{flexGrow:1,padding:n.spacing(3),transition:n.transitions.create("margin",{easing:n.transitions.easing.sharp,duration:n.transitions.duration.leavingScreen}),marginRight:-450,...i&&{transition:n.transitions.create("margin",{easing:n.transitions.easing.easeOut,duration:n.transitions.duration.enteringScreen}),marginRight:0},position:"relative"}})),U=(0,p.ZP)(m.Z,{shouldForwardProp:e=>"open"!==e})((e=>{let{theme:n,open:i}=e;return{transition:n.transitions.create(["margin","width"],{easing:n.transitions.easing.sharp,duration:n.transitions.duration.leavingScreen}),...i&&{width:"calc(100% - ".concat(450,"px)"),transition:n.transitions.create(["margin","width"],{easing:n.transitions.easing.easeOut,duration:n.transitions.duration.enteringScreen}),marginRight:450}}}));(0,p.ZP)("div")((e=>{let{theme:n}=e;return{display:"flex",alignItems:"center",padding:n.spacing(0,1),...n.mixins.toolbar,justifyContent:"flex-start"}}));function W(){const{t:e}=(0,I.$G)(),n=(0,k.s0)(),i=v()(),m=v()(),[p,b]=P.useState([]),W=P.useRef(null),{height:E}=(0,N.Z)({ref:W}),L=P.useRef(null),{height:T}=(0,N.Z)({ref:L});return(0,B.jsxs)(t.ZP,{className:C.root,children:[(0,B.jsx)(h.Z,{ref:W}),(0,B.jsxs)(r.Z,{className:C.container,sx:{marginTop:"".concat(E,"px")},children:[(0,B.jsx)(o.ZP,{}),(0,B.jsx)(U,{position:"fixed",sx:{top:"".concat(E+1,"px"),backgroundColor:"white",boxShadow:"0px 2px 4px #00000026"},ref:L,open:!1,children:(0,B.jsxs)(a.Z,{children:[(0,B.jsxs)(r.Z,{id:C.breadcumpWrapper,children:[(0,B.jsx)(y.Z,{colorname:"--blue-500",className:C.cursorPointer,onClick:()=>n(A._.lecturer.course.management),children:"Qu\u1ea3n l\xfd kho\xe1 h\u1ecdc"}),(0,B.jsx)(F.Z,{id:C.icArrow}),(0,B.jsx)(y.Z,{colorname:"--blue-500",className:C.cursorPointer,onClick:()=>n(A._.lecturer.course.information),children:"CS202 - Nh\u1eadp m\xf4n l\u1eadp tr\xecnh"}),(0,B.jsx)(F.Z,{id:C.icArrow}),(0,B.jsx)(y.Z,{colorname:"--blue-500",className:C.cursorPointer,onClick:()=>n(A._.lecturer.course.assignment),children:"Danh s\xe1ch b\xe0i t\u1eadp"}),(0,B.jsx)(F.Z,{id:C.icArrow}),(0,B.jsx)(y.Z,{colorname:"--blue-500",className:C.cursorPointer,onClick:()=>n(A._.lecturer.assignment.detail),children:"B\xe0i t\u1eadp 1"}),(0,B.jsx)(F.Z,{id:C.icArrow}),(0,B.jsx)(y.Z,{colorname:"--blue-500",children:"N\u1ed9p b\xe0i l\xe0m"})]}),(0,B.jsx)(l.Z,{color:"inherit","aria-label":"open drawer",edge:"end",sx:{display:"none"},children:(0,B.jsx)(s.Z,{color:"action"})})]})}),(0,B.jsx)(D,{open:!0,className:C.mainContent,sx:{height:"calc(100% - ".concat(T,"px)"),marginTop:"".concat(T,"px")},children:(0,B.jsx)(c.Z,{children:(0,B.jsxs)(r.Z,{component:"form",className:C.formBody,autoComplete:"off",children:[(0,B.jsxs)(t.ZP,{container:!0,direction:"row",alignItems:"center",gap:2,children:[(0,B.jsx)(t.ZP,{item:!0,children:(0,B.jsx)(c.Z,{sx:{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",padding:"5px",backgroundColor:"primary.main",width:"50px"},children:(0,B.jsx)(x.r,{height:"40px"})})}),(0,B.jsx)(t.ZP,{item:!0,children:(0,B.jsx)(Z.Z,{fontWeight:"500",children:"N\u1ed9p file b\xe1o c\xe1o. Deadline: 02/02/2024"})})]}),(0,B.jsxs)(c.Z,{className:C.pageActivityHeader,sx:{padding:"10px",backgroundColor:"#F8F9FA"},children:[(0,B.jsxs)(t.ZP,{container:!0,direction:"row",alignItems:"center",gap:1,children:[(0,B.jsx)(t.ZP,{item:!0,children:(0,B.jsxs)(y.Z,{fontWeight:"600","translation-key":"course_assignment_detail_open_time",children:[e("course_assignment_detail_open_time"),":"]})}),(0,B.jsx)(t.ZP,{item:!0,children:(0,B.jsx)(f.Z,{children:null===i||void 0===i?void 0:i.toDate().toLocaleString("en-US",{timeZone:"Asia/Ho_Chi_Minh"})})})]}),(0,B.jsxs)(t.ZP,{container:!0,direction:"row",alignItems:"center",gap:1,children:[(0,B.jsx)(t.ZP,{item:!0,children:(0,B.jsxs)(y.Z,{fontWeight:"600","translation-key":"course_assignment_detail_close_time",children:[e("course_assignment_detail_close_time"),":"]})}),(0,B.jsx)(t.ZP,{item:!0,children:(0,B.jsx)(f.Z,{children:null===m||void 0===m?void 0:m.toDate().toLocaleString("en-US",{timeZone:"Asia/Ho_Chi_Minh"})})})]}),(0,B.jsx)(d.Z,{style:{marginTop:"10px",marginBottom:"10px"}}),(0,B.jsxs)(r.Z,{className:C.assignmentDescription,children:[(0,B.jsx)("div",{dangerouslySetInnerHTML:{__html:"\n    <div>\n    <p>\u0110\xe2y l\xe0 m\xf4 t\u1ea3 b\xe0i t\u1eadp</p>\n    </div>\n    "}}),(0,B.jsx)("div",{style:{marginBottom:"10px"},dangerouslySetInnerHTML:{__html:"\n    <div>\n    <p>\u0110\xe2y l\xe0 h\u01b0\u1edbng d\u1eabn b\xe0i t\u1eadp</p>\n    </div>\n    "}}),(0,B.jsx)(S.Z,{files:[{id:"1",name:"test1.jpg",size:1024,type:"image/jpg",uploadStatus:"success",downloadUrl:"https://res.cloudinary.com/doofq4jvp/image/upload/v1707044303/ulvrbytveqv8injpzliy.jpg"},{id:"2",name:"dummy.pdf",size:1024,type:"application/pdf",uploadStatus:"success",downloadUrl:"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}]})]})]}),(0,B.jsx)(u.Z,{title:e("course_assignment_detail_submit"),"translation-key":"course_assignment_detail_submit",children:(0,B.jsxs)(r.Z,{className:C.formBody,children:[(0,B.jsxs)(t.ZP,{container:!0,spacing:1,columns:12,children:[(0,B.jsx)(t.ZP,{item:!0,xs:3,children:(0,B.jsx)(w.Z,{"translation-key":"common_essay",children:e("common_essay")})}),(0,B.jsx)(t.ZP,{item:!0,xs:9,className:C.textEditor,children:(0,B.jsx)(j.Z,{value:"",onChange:e=>console.log(e)})})]}),(0,B.jsxs)(t.ZP,{container:!0,spacing:1,columns:12,children:[(0,B.jsx)(t.ZP,{item:!0,xs:3,children:(0,B.jsx)(w.Z,{"translation-key":"course_lecturer_assignment_submit_file",children:e("course_lecturer_assignment_submit_file")})}),(0,B.jsx)(t.ZP,{item:!0,xs:9,children:(0,B.jsx)(_.Z,{extFiles:p,setExtFiles:b})})]})]})}),(0,B.jsx)(d.Z,{}),(0,B.jsxs)(t.ZP,{container:!0,direction:"row",justifyContent:"center",gap:1,children:[(0,B.jsx)(t.ZP,{item:!0,children:(0,B.jsx)(g.Z,{btnType:g.s.Primary,"translation-key":"common_save_changes",children:e("common_save_changes")})}),(0,B.jsx)(t.ZP,{item:!0,children:(0,B.jsx)(g.Z,{btnType:g.s.Outlined,"translation-key":"common_cancel",children:e("common_cancel")})})]})]})})})]})]})}}}]);