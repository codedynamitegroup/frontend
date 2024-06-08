"use strict";(self.webpackChunkfrontend_app=self.webpackChunkfrontend_app||[]).push([[7271],{52002:(e,t,n)=>{n.d(t,{Z:()=>_});n(47313);var o=n(9019),r=n(79536);const i={textLink:"styles_textLink__NotTr",footerListItem:"styles_footerListItem__SsH3t",footerBottom:"styles_footerBottom__d89dr",footerTop:"styles_footerTop__VtwDZ",logo:"styles_logo__ytDDd"};var s=n(2135),a=n(75590),l=n(80007),c=n(68464),d=n(90469),u=n(37400),m=n(46417);function _(){const{t:e}=(0,a.$G)();return(0,m.jsxs)(o.ZP,{container:!0,id:i.footerWrapper,children:[(0,m.jsxs)(o.ZP,{container:!0,id:i.footerTop,children:[(0,m.jsxs)(o.ZP,{item:!0,xs:12,md:5,className:i.footerListItem,children:[(0,m.jsx)(r.Z,{className:i.logo,children:(0,m.jsx)("img",{src:u.Z.logo.appLogo,alt:"logo"})}),(0,m.jsx)(l.Z,{paragraph:!0,"translation-key":"footer_description",colorname:"--gray-5",children:e("footer_description")})]}),(0,m.jsx)(o.ZP,{item:!0,xs:12,md:1}),(0,m.jsxs)(o.ZP,{item:!0,xs:6,md:3,className:i.footerListItem,children:[(0,m.jsx)(c.Z,{"translation-key":"footer_resource_link_title",colorname:"--gray-20",children:e("footer_resource_link_title")}),(0,m.jsx)(l.Z,{colorname:"--gray-20",children:(0,m.jsx)(s.rU,{to:d._.user.course_certificate.root,className:i.textLink,"translation-key":"header_explore_course",children:e("header_explore_course")})}),(0,m.jsx)(l.Z,{colorname:"--gray-20",children:(0,m.jsx)(s.rU,{to:d._.user.problem.root,className:i.textLink,"translation-key":"common_practice",children:e("common_practice")})}),(0,m.jsx)(l.Z,{colorname:"--gray-20",children:(0,m.jsx)(s.rU,{to:d._.user.contest.root,className:i.textLink,"translation-key":"footer_link_contest",children:e("footer_link_contest")})})]}),(0,m.jsxs)(o.ZP,{item:!0,xs:6,md:3,className:i.footerListItem,children:[(0,m.jsx)(c.Z,{colorname:"--gray-20","translation-key":"footer_about_title",children:e("footer_about_title")}),(0,m.jsx)(l.Z,{colorname:"--gray-20",children:(0,m.jsx)(s.rU,{to:"#!",className:i.textLink,"translation-key":"footer_link_about_us",children:e("footer_link_about_us")})}),(0,m.jsx)(l.Z,{colorname:"--gray-20",children:(0,m.jsx)(s.rU,{to:"#!",className:i.textLink,"translation-key":"footer_link_contact",children:e("footer_link_contact")})})]})]}),(0,m.jsx)(o.ZP,{container:!0,id:i.footerBottom,children:(0,m.jsxs)(c.Z,{"translation-key":"footer_copyright",children:["\xa9 2024 ",e("footer_copyright"),": CodeDynamite"]})})]})}},27013:(e,t,n)=>{n.d(t,{N:()=>a,Z:()=>l});n(47313);var o=n(42832),r=n(36373),i=n(99881),s=n(46417);let a=function(e){return e.Success="success",e.INFO="info",e.Warning="warning",e.Error="error",e}({});function l(e){let{open:t,setOpen:n,content:a,type:l,anchorOrigin:c}=e;const d=e=>{"clickaway"!==e&&n(!1)},u="right";return(0,s.jsx)(o.Z,{spacing:2,sx:{width:"100%"},children:(0,s.jsx)(r.Z,{open:t,autoHideDuration:3e3,onClose:d,anchorOrigin:c||{vertical:"top",horizontal:u},children:(0,s.jsx)(i.Z,{onClose:d,severity:l,children:a})},"top"+u)})}},91603:(e,t,n)=>{n.d(t,{Z:()=>c});var o=n(9019),r=n(49914),i=n(47313),s=n(82098),a=n(35659),l=n(46417);const c=(0,i.memo)((e=>{const{title:t,type:n,placeholder:i,name:c,defaultValue:d,value:u,inputRef:m,errorMessage:_,autoComplete:x,readOnly:h,disabled:g,onChange:p,backgroundColor:f,error:j,tooltipDescription:Z,titleRequired:y,fontFamily:q,fontSize:k,fontWeight:v}=e,{ref:b,...P}=m||{ref:null};return(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)(o.ZP,{container:!0,children:[(0,l.jsx)(o.ZP,{item:!0,xs:12,children:t&&(0,l.jsx)(a.Z,{title:t,titleRequired:y,tooltipDescription:Z})}),(0,l.jsx)(o.ZP,{item:!0,xs:12,children:(0,l.jsx)(r.Z,{placeholder:i,fullWidth:!0,size:"small",readOnly:h,disabled:g,name:c,type:n,error:j,style:{backgroundColor:f||"white"},defaultValue:d,value:u,autoComplete:x,onChange:p,...P,inputRef:m,sx:{borderRadius:"12px",fontFamily:q||"Roboto,sans-serif",fontSize:k||"14px",fontWeight:v||"400",boxShadow:"0px 1px 2px 0px rgba(21, 21, 21, 0.08)"}})}),(0,l.jsx)(o.ZP,{item:!0,xs:t?12:0,md:0,children:(0,l.jsx)(l.Fragment,{})}),(0,l.jsx)(o.ZP,{item:!0,xs:12,children:_&&(0,l.jsx)(s.Z,{children:_})})]})})}))},71087:(e,t,n)=>{n.d(t,{Z:()=>c});var o=n(63994),r=n(45148),i=n(61179),s=n(79536),a=n(46417);function l(e,t){const n=("abc"===t?"a":"A").charCodeAt(0);if(e<26)return String.fromCharCode(n+e);return String.fromCharCode(n+Math.floor(e/26)-1)+String.fromCharCode(n+e%26)}const c=e=>{const{values:t,size:n,variant:c,color:d,orientation:u,fontSize:m,fontWeight:_,fontFamily:x,onChange:h,value:g,numbering:p,overlay:f,disabled:j}=e;return(0,a.jsx)(o.Z,{orientation:u,size:n,variant:c,value:g,children:(0,a.jsx)(s.Z,{sx:{display:"flex",flexDirection:"column",gap:2,"& > div":{p:1,borderRadius:"12px",display:"flex"}},children:null===t||void 0===t?void 0:t.map(((e,t)=>f?(0,a.jsx)(r.Z,{variant:"outlined",children:(0,a.jsx)(i.Z,{disabled:j,overlay:!0,checkedIcon:p&&(0,a.jsx)(s.Z,{sx:{width:"inherit",height:"inherit",backgroundColor:"#e2ecf5"},borderRadius:"1000px",border:"2px solid #0b6bcb",display:"flex",justifyContent:"center",alignItems:"center",padding:"5px",fontWeight:"500",children:(0,a.jsx)(s.Z,{children:"n123"!==p?l(t,p):t+1})}),uncheckedIcon:p&&(0,a.jsx)("span",{children:"n123"!==p?l(t,p):t+1}),value:e.value,label:e.label,onChange:e=>h(e.target.value),color:d,sx:{"& .MuiRadio-label":{fontFamily:x||"Montserrat",fontSize:m||"14px",fontWeight:_||"400"}}})},t):(0,a.jsx)(i.Z,{disabled:j,checked:0===t,checkedIcon:p&&(0,a.jsx)(s.Z,{sx:{width:"inherit",height:"inherit",backgroundColor:"#e2ecf5"},borderRadius:"1000px",border:"2px solid #0b6bcb",display:"flex",justifyContent:"center",alignItems:"center",padding:"5px",fontWeight:"500",children:(0,a.jsx)(s.Z,{children:"n123"!==p?l(t,p):t+1})}),uncheckedIcon:p&&(0,a.jsx)("span",{children:"n123"!==p?l(t,p):t+1}),value:e.value,label:e.label,onChange:e=>h(e.target.value),color:d,sx:{"& .MuiRadio-label":{fontFamily:x||"Montserrat",fontSize:m||"14px",fontWeight:_||"400"}}},t)))})})}},68464:(e,t,n)=>{n.d(t,{Z:()=>a});var o,r=n(30168),i=n(17592),s=n(61113);const a=(0,i.ZP)(s.Z)(o||(o=(0,r.Z)(['\n  font-family: "Montserrat";\n  font-style: ',";\n  font-weight: ",";\n  font-size: 16px;\n  line-height: 24px;\n  text-wrap: ",";\n  color: ",";\n  @media only screen and (max-width: 767px) {\n    font-size: 14px;\n  }\n"])),(e=>e.fontStyle||"normal"),(e=>e.fontWeight||600),(e=>e.textWrap||"wrap"),(e=>"var(".concat(e.colorname||"--eerie-black-00",")")))},27271:(e,t,n)=>{n.r(t),n.d(t,{default:()=>U});var o=n(9019),r=n(47825),i=n(79536),s=n(61113),a=n(19536),l=n(42832),c=n(90200),d=n(92556),u=n(80007),m=n(47313),_=n(58467);const x="styles_root__y+EkD",h="styles_pageTitle__xub3-",g="styles_container__4pAzy",p="styles_tabWrapper__O5RJK",f="styles_formBody__0bOoj",j="styles_breadCump__0rx3C",Z="styles_stickyFooterItem__PuzrZ",y="styles_stickyFooterContainer__XzKCK",q="styles_textEditor__kg5BD";var k=n(90469),v=n(47477),b=n(75590),P=n(23885),C=n(65339),N=n(62563),w=n(75627),F=n(21933),I=n(82098),S=n(26581),D=n(3347),B=n(91603),z=n(52002),R=n(35659),L=n(27013),W=n(71087),M=n(8479),Q=n(90182),T=n(65537),O=n(49132),V=n(33117),E=n(46417);const U=e=>{var t,n,U,A,H,K,X;const{t:$,i18n:G}=(0,b.$G)(),[J,Y]=(0,m.useState)((()=>P.ZP.language)),[ee,te]=(0,m.useState)(!1),[ne,oe]=(0,m.useState)(!1),[re,ie]=(0,m.useState)(L.N.Error),[se,ae]=(0,m.useState)(""),[le,ce]=(0,m.useState)(0),de=(0,_.s0)(),ue=(0,m.useRef)(null);let{height:me}=(0,v.Z)({ref:ue});e.insideCrumb&&(me=0);const _e=(0,_.UO)(),xe=(0,m.useMemo)((()=>F.Ry().shape({questionName:F.Z_().required($("question_name_required")).trim(),questionDescription:F.Z_().required($("question_description_required")).trim("").test("isQuillEmpty",$("question_description_required"),(e=>!(0,S.Z)(e))),defaultScore:F.Z_().required($("question_default_score_required")).test("is-decimal","Invalid number, default score must be a number greater than or equal 0",(e=>(0,D.K)(e))).transform((e=>e.replace(",","."))),generalDescription:F.Z_().trim(""),correctFeedback:F.Z_(),incorrectFeedback:F.Z_(),showInstructions:F.Z_().required($("question_show_instructions_required")),showNumCorrect:F.Z_().required($("question_show_num_correct_required"))})),[$]),{control:he,handleSubmit:ge,formState:{errors:pe},trigger:fe}=(0,w.cI)({resolver:(0,N.X)(xe),defaultValues:{defaultScore:"0",generalDescription:"",questionDescription:"",questionName:"",correctFeedback:"",incorrectFeedback:"",showInstructions:"1",showNumCorrect:"1"}}),je=(0,_.TH)(),Ze=null===(t=je.state)||void 0===t?void 0:t.courseId,ye=null===(n=je.state)||void 0===n?void 0:n.isQuestionBank,qe=null===(U=je.state)||void 0===U?void 0:U.categoryName,ke=(0,_.UO)().categoryId,ve=(0,T.v9)(V.HF),be=(0,T.I0)(),Pe=async e=>{try{const t=await C.a.getQuestionsByQuestionId(e);be((0,O.HM)(t))}catch(t){console.log(t)}};(0,m.useEffect)((()=>{G.language!==J&&null!==pe&&void 0!==pe&&pe.questionName&&(console.log("triggered"),fe(),Y(G.language))}),[G.language]);const Ce=[{value:"1",label:$("common_true")},{value:"0",label:$("common_false")}],Ne=[{value:"1",label:$("question_management_show_instructions")},{value:"0",label:$("question_management_no_show_instructions")}];return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(L.Z,{anchorOrigin:{vertical:"bottom",horizontal:"left"},open:ne,setOpen:oe,type:re,content:se}),(0,E.jsx)(Q.q,{children:(0,E.jsx)("title",{children:"Create true false question"})}),(0,E.jsxs)(o.ZP,{className:x,children:[(0,E.jsx)(c.Z,{ref:ue}),(0,E.jsx)("form",{onSubmit:ge((async e=>{console.log(e),te(!0);const t={...e},n={organizationId:ve.organization.organizationId,createdBy:ve.userId,updatedBy:ve.userId,difficulty:"EASY",name:t.questionName,questionText:t.questionDescription,generalFeedback:null===t||void 0===t?void 0:t.generalDescription,defaultMark:Number(null===t||void 0===t?void 0:t.defaultScore),qType:"TRUE_FALSE",answers:void 0,questionBankCategoryId:ye?ke:void 0,single:!0,shuffleAnswers:!1,showStandardInstructions:t.showInstructions.toString(),correctFeedback:t.correctFeedback,incorrectFeedback:t.incorrectFeedback,answerNumbering:void 0,showNumCorrect:Number(t.showNumCorrect)};console.log(n),C.a.createMultichoiceQuestion(n).then((e=>{console.log(e),ye||Pe(e.questionId),ie(L.N.Success),ae($("question_management_create_question_success",{questionType:$("common_question_type_multi_choice")}))})).catch((e=>{console.log(e),ie(L.N.Error),ae($("question_management_create_question_failed",{questionType:$("common_question_type_multi_choice")}))})).finally((()=>{te(!1),oe(!0),de(ye?k._.lecturer.question_bank.detail.replace(":categoryId",null!==ke&&void 0!==ke?ke:""):k._.lecturer.exam.create.replace(":courseId",Ze))}))}),(()=>ce((e=>e+1)))),children:(0,E.jsxs)(r.Z,{style:{marginTop:"".concat(me,"px")},className:g,children:[(0,E.jsx)(i.Z,{className:p,children:ye?(0,E.jsxs)(u.Z,{className:j,colorname:"--gray-50",fontWeight:"600",children:[(0,E.jsx)("span",{onClick:()=>de(k._.lecturer.question_bank.path),"translation-key":"common_question_bank",children:P.ZP.format($("common_question_bank"),"firstUppercase")})," ","> ",(0,E.jsx)("span",{onClick:()=>de("/lecturer/question-bank-management/".concat(_e.categoryId)),children:qe})," ","> ",(0,E.jsx)("span",{children:"T\u1ea1o c\xe2u h\u1ecfi"})]}):(0,E.jsxs)(u.Z,{className:j,colorname:"--gray-50",fontWeight:"600",children:[(0,E.jsx)("span",{"translation-key":"common_course_management",onClick:()=>de(k._.lecturer.course.management),children:$("common_course_management")})," ","> ",(0,E.jsx)("span",{onClick:()=>de(k._.lecturer.course.information.replace(":courseId","1")),children:"CS202 - Nh\u1eadp m\xf4n l\u1eadp tr\xecnh"})," ","> ",(0,E.jsx)("span",{onClick:()=>de(k._.lecturer.course.assignment),children:"Xem b\xe0i t\u1eadp"})," ","> ",(0,E.jsx)("span",{onClick:()=>de(k._.lecturer.exam.create),"translation-key":"course_lecturer_assignment_create_exam",children:$("course_lecturer_assignment_create_exam")})," ","> ",(0,E.jsx)("span",{"translation-key":"question_management_create_question",children:$("question_management_create_question")})]})}),(0,E.jsxs)(i.Z,{className:f,children:[(0,E.jsxs)(s.Z,{className:h,"translation-key":["common_add","common_question_type_with_question_truefalse"],children:[$("common_add")," ",$("common_question_type_with_question_truefalse").toLocaleLowerCase()]}),(0,E.jsxs)(o.ZP,{container:!0,spacing:3,children:[(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:(0,E.jsxs)(o.ZP,{container:!0,spacing:3,children:[(0,E.jsx)(o.ZP,{item:!0,xs:12,md:6,children:(0,E.jsx)(w.Qr,{defaultValue:"",control:he,name:"questionName",render:e=>{var t;let{field:{ref:n,...o}}=e;return(0,E.jsx)(B.Z,{inputRef:n,error:Boolean(null===pe||void 0===pe?void 0:pe.questionName),errorMessage:null===(t=pe.questionName)||void 0===t?void 0:t.message,title:"".concat($("exam_management_create_question_name")),type:"text",placeholder:$("exam_management_create_question_name"),titleRequired:!0,"translation-key":"exam_management_create_question_name",...o})}})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:6,children:(0,E.jsx)(w.Qr,{defaultValue:"0",control:he,name:"defaultScore",render:e=>{var t;let{field:{ref:n,...o}}=e;return(0,E.jsx)(B.Z,{inputRef:n,titleRequired:!0,error:Boolean(null===pe||void 0===pe?void 0:pe.defaultScore),errorMessage:null===(t=pe.defaultScore)||void 0===t?void 0:t.message,title:"".concat($("question_management_default_score")),type:"text",placeholder:$("question_management_default_score"),required:!0,"translation-key":["question_management_default_score","question_default_score_description"],tooltipDescription:$("question_default_score_description"),...o})}})})]})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:(0,E.jsxs)(o.ZP,{container:!0,spacing:3,children:[(0,E.jsxs)(o.ZP,{item:!0,xs:12,md:6,children:[(0,E.jsx)(R.Z,{"translation-key":"exam_management_create_question_description",title:"".concat($("exam_management_create_question_description")," "),titleRequired:!0}),(0,E.jsxs)(o.ZP,{container:!0,spacing:1,children:[(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,className:q,children:(0,E.jsx)(w.Qr,{defaultValue:"",control:he,name:"questionDescription",render:e=>{let{field:t}=e;return(0,E.jsx)(d.Z,{submitCount:le,title:$("exam_management_create_question_description"),openDialog:!0,roundedBorder:!0,error:Boolean(null===pe||void 0===pe?void 0:pe.questionDescription),placeholder:"".concat($("question_management_enter_question_description"),"..."),required:!0,"translation-key":"question_management_enter_question_description",...t})}})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:(0,E.jsx)(E.Fragment,{})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:(0,E.jsx)(E.Fragment,{})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:Boolean(null===pe||void 0===pe?void 0:pe.questionDescription)&&(0,E.jsx)(I.Z,{children:null===(A=pe.questionDescription)||void 0===A?void 0:A.message})})]})]}),(0,E.jsxs)(o.ZP,{item:!0,xs:12,md:6,children:[(0,E.jsx)(R.Z,{"translation-key":"question_management_general_comment",title:"".concat($("question_management_general_comment")," "),optional:!0}),(0,E.jsxs)(o.ZP,{container:!0,spacing:1,children:[(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,className:q,children:(0,E.jsx)(w.Qr,{defaultValue:"",control:he,name:"generalDescription",render:e=>{let{field:t}=e;return(0,E.jsx)(d.Z,{title:$("question_management_general_comment"),openDialog:!0,error:Boolean(null===pe||void 0===pe?void 0:pe.generalDescription),roundedBorder:!0,placeholder:"".concat($("question_management_enter_general_comment"),"..."),"translation-key":"question_management_enter_general_comment",...t})}})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:(0,E.jsx)(E.Fragment,{})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:Boolean(null===pe||void 0===pe?void 0:pe.generalDescription)&&(0,E.jsx)(I.Z,{marginBottom:"10px",children:null===(H=pe.generalDescription)||void 0===H?void 0:H.message})})]})]})]})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:(0,E.jsxs)(o.ZP,{container:!0,spacing:3,children:[(0,E.jsxs)(o.ZP,{item:!0,xs:12,md:6,children:[(0,E.jsx)(R.Z,{"translation-key":"question_management_correct_answer",title:"".concat($("question_management_correct_answer")," "),tooltipDescription:$("question_management_correct_answer_description")}),(0,E.jsx)(w.Qr,{name:"showNumCorrect",control:he,defaultValue:"1",render:e=>{let{field:{onChange:t,value:n}}=e;return(0,E.jsx)(W.Z,{value:n,onChange:t,values:Ce,orientation:"horizontal",size:"md"})}})]}),(0,E.jsxs)(o.ZP,{item:!0,xs:12,md:6,children:[(0,E.jsx)(R.Z,{title:$("question_multiple_choice_show_instructions")}),(0,E.jsx)(w.Qr,{name:"showInstructions",control:he,defaultValue:"1",render:e=>{let{field:{onChange:t,value:n}}=e;return(0,E.jsx)(W.Z,{value:n,onChange:t,values:Ne,orientation:"horizontal",size:"md"})}})]})]})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:(0,E.jsxs)(o.ZP,{container:!0,spacing:3,children:[(0,E.jsxs)(o.ZP,{item:!0,xs:12,md:6,children:[(0,E.jsx)(R.Z,{optional:!0,"translation-key":"question_multiple_choice_correct_feedback",title:$("question_multiple_choice_correct_feedback")}),(0,E.jsxs)(o.ZP,{container:!0,spacing:1,children:[(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,className:q,children:(0,E.jsx)(w.Qr,{defaultValue:"",control:he,name:"correctFeedback",render:e=>{let{field:t}=e;return(0,E.jsx)(d.Z,{openDialog:!0,title:$("question_multiple_choice_correct_feedback"),roundedBorder:!0,error:Boolean(null===pe||void 0===pe?void 0:pe.correctFeedback),placeholder:"".concat($("question_multiple_choice_enter_correct_feedback"),"..."),"translation-key":"question_multiple_choice_enter_correct_feedback",...t})}})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:(0,E.jsx)(E.Fragment,{})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:(0,E.jsx)(E.Fragment,{})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:Boolean(null===pe||void 0===pe?void 0:pe.correctFeedback)&&(0,E.jsx)(I.Z,{children:null===(K=pe.correctFeedback)||void 0===K?void 0:K.message})})]})]}),(0,E.jsxs)(o.ZP,{item:!0,xs:12,md:6,children:[(0,E.jsx)(R.Z,{optional:!0,"translation-key":"question_multiple_choice_incorrect_feedback",title:$("question_multiple_choice_incorrect_feedback")}),(0,E.jsxs)(o.ZP,{container:!0,spacing:1,children:[(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,className:q,children:(0,E.jsx)(w.Qr,{defaultValue:"",control:he,name:"incorrectFeedback",render:e=>{let{field:t}=e;return(0,E.jsx)(d.Z,{openDialog:!0,title:$("question_multiple_choice_incorrect_feedback"),roundedBorder:!0,error:Boolean(null===pe||void 0===pe?void 0:pe.correctFeedback),placeholder:"".concat($("question_multiple_choice_enter_incorrect_feedback"),"..."),"translation-key":"question_multiple_choice_enter_incorrect_feedback",...t})}})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:(0,E.jsx)(E.Fragment,{})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:(0,E.jsx)(E.Fragment,{})}),(0,E.jsx)(o.ZP,{item:!0,xs:12,md:12,children:Boolean(null===pe||void 0===pe?void 0:pe.incorrectFeedback)&&(0,E.jsx)(I.Z,{children:null===(X=pe.incorrectFeedback)||void 0===X?void 0:X.message})})]})]})]})})]}),(0,E.jsx)(a.Z,{}),(0,E.jsxs)(l.Z,{spacing:{xs:2},direction:"row",justifyContent:"center",children:[(0,E.jsx)(M.Z,{loading:ee,variant:"solid",type:"submit","translation-key":"question_management_create_question",children:$("question_management_create_question")}),(0,E.jsx)(M.Z,{variant:"outlined","translation-key":"common_cancel",children:$("common_cancel")})]})]})]})}),(0,E.jsx)(z.Z,{})]}),(0,E.jsx)(i.Z,{className:y,children:(0,E.jsx)(i.Z,{className:Z})})]})}},3347:(e,t,n)=>{n.d(t,{K:()=>r});const o=/^(?:0|[1-9]\d*)(?:\.\d+)?$/;function r(e){return!!o.test(e)}},26581:(e,t,n)=>{n.d(t,{Z:()=>o});const o=function(e){return 0===e.replace(/<(.|\n)*?>/g,"").trim().length&&!e.includes("<img")}}}]);