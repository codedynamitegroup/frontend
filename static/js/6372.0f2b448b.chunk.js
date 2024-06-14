"use strict";(self.webpackChunkfrontend_app=self.webpackChunkfrontend_app||[]).push([[6372],{59500:(t,a,e)=>{e.d(a,{eu:()=>f,FR:()=>C});var o=e(63366),n=e(87462),r=e(47313),l=e(31179),c=e(89674),i=e(39028),p=e(8007),v=e(48114),d=e(8362),s=e(60985),g=e(19422);function m(t){return(0,g.d6)("MuiTypography",t)}(0,g.sI)("MuiTypography",["root","h1","h2","h3","h4","title-lg","title-md","title-sm","body-lg","body-md","body-sm","body-xs","noWrap","gutterBottom","startDecorator","endDecorator","colorPrimary","colorNeutral","colorDanger","colorSuccess","colorWarning","colorContext","variantPlain","variantOutlined","variantSoft","variantSolid"]);var h=e(46417);const b=["color","textColor"],u=["component","gutterBottom","noWrap","level","levelMapping","children","endDecorator","startDecorator","variant","slots","slotProps"],C=r.createContext(!1),f=r.createContext(!1),B=(0,v.Z)("span",{name:"JoyTypography",slot:"StartDecorator",overridesResolver:(t,a)=>a.startDecorator})({display:"inline-flex",marginInlineEnd:"clamp(4px, var(--Typography-gap, 0.375em), 0.75rem)"}),y=(0,v.Z)("span",{name:"JoyTypography",slot:"endDecorator",overridesResolver:(t,a)=>a.endDecorator})({display:"inline-flex",marginInlineStart:"clamp(4px, var(--Typography-gap, 0.375em), 0.75rem)"}),k=(0,v.Z)("span",{name:"JoyTypography",slot:"Root",overridesResolver:(t,a)=>a.root})((t=>{let{theme:a,ownerState:e}=t;var o,r,l,c,i;const p="inherit"!==e.level?null==(o=a.typography[e.level])?void 0:o.lineHeight:"1";return(0,n.Z)({"--Icon-fontSize":"calc(1em * ".concat(p,")")},e.color&&{"--Icon-color":"currentColor"},{margin:"var(--Typography-margin, 0px)"},e.nesting?{display:"inline"}:(0,n.Z)({display:"block"},e.unstable_hasSkeleton&&{position:"relative"}),(e.startDecorator||e.endDecorator)&&(0,n.Z)({display:"flex",alignItems:"center"},e.nesting&&(0,n.Z)({display:"inline-flex"},e.startDecorator&&{verticalAlign:"bottom"})),e.level&&"inherit"!==e.level&&a.typography[e.level],{fontSize:"var(--Typography-fontSize, ".concat(e.level&&"inherit"!==e.level&&null!=(r=null==(l=a.typography[e.level])?void 0:l.fontSize)?r:"inherit",")")},e.noWrap&&{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},e.gutterBottom&&{marginBottom:"0.35em"},e.color&&{color:"var(--variant-plainColor, rgba(".concat(null==(c=a.vars.palette[e.color])?void 0:c.mainChannel," / 1))")},e.variant&&(0,n.Z)({borderRadius:a.vars.radius.xs,paddingBlock:"min(0.1em, 4px)",paddingInline:"0.25em"},!e.nesting&&{marginInline:"-0.25em"},null==(i=a.variants[e.variant])?void 0:i[e.color]))})),D={h1:"h1",h2:"h2",h3:"h3",h4:"h4","title-lg":"p","title-md":"p","title-sm":"p","body-lg":"p","body-md":"p","body-sm":"p","body-xs":"span",inherit:"p"},x=r.forwardRef((function(t,a){var e;const v=(0,d.Z)({props:t,name:"JoyTypography"}),{color:g,textColor:x}=v,S=(0,o.Z)(v,b),H=r.useContext(C),Z=r.useContext(f),A=(0,i.Z)((0,n.Z)({},S,{color:x})),{component:w,gutterBottom:P=!1,noWrap:T=!1,level:V="body-md",levelMapping:I=D,children:W,endDecorator:R,startDecorator:N,variant:j,slots:z={},slotProps:F={}}=A,J=(0,o.Z)(A,u),M=null!=(e=t.color)?e:j?null!=g?g:"neutral":g,_=H||Z?t.level||"inherit":V,E=(0,c.Z)(W,["Skeleton"]),O=w||(H?"span":I[_]||D[_]||"span"),Q=(0,n.Z)({},A,{level:_,component:O,color:M,gutterBottom:P,noWrap:T,nesting:H,variant:j,unstable_hasSkeleton:E}),q=(t=>{const{gutterBottom:a,noWrap:e,level:o,color:n,variant:r}=t,c={root:["root",o,a&&"gutterBottom",e&&"noWrap",n&&"color".concat((0,l.Z)(n)),r&&"variant".concat((0,l.Z)(r))],startDecorator:["startDecorator"],endDecorator:["endDecorator"]};return(0,p.Z)(c,m,{})})(Q),G=(0,n.Z)({},J,{component:O,slots:z,slotProps:F}),[K,L]=(0,s.Z)("root",{ref:a,className:q.root,elementType:k,externalForwardedProps:G,ownerState:Q}),[U,X]=(0,s.Z)("startDecorator",{className:q.startDecorator,elementType:B,externalForwardedProps:G,ownerState:Q}),[Y,$]=(0,s.Z)("endDecorator",{className:q.endDecorator,elementType:y,externalForwardedProps:G,ownerState:Q});return(0,h.jsx)(C.Provider,{value:!0,children:(0,h.jsxs)(K,(0,n.Z)({},L,{children:[N&&(0,h.jsx)(U,(0,n.Z)({},X,{children:N})),E?r.cloneElement(W,{variant:W.props.variant||"inline"}):W,R&&(0,h.jsx)(Y,(0,n.Z)({},$,{children:R}))]}))})}));x.muiName="Typography"},52603:(t,a,e)=>{e.d(a,{Ev:()=>p,Qr:()=>i});var o=e(23009);const n=t=>a=>"--".concat(t?"".concat(t,"-"):"").concat(a.replace(/^--/,"")),r="data-skip-inverted-colors",l="& :not([".concat(r,"], [").concat(r,"] *)"),c=t=>{var a,e,o,r,l,c,i,p,v,d,s,g,m,h,b,u,C,f,B,y,k,D;const x=n(t.cssVarPrefix);return{"--variant-plainColor":"var(--variant-plainColor) !important","--variant-plainHoverColor":"var(--variant-plainHoverColor) !important","--variant-plainHoverBg":"var(--variant-plainHoverBg) !important","--variant-plainActiveBg":"var(--variant-plainActiveBg) !important","--variant-plainDisabledColor":"var(--variant-plainDisabledColor) !important","--variant-outlinedColor":"var(--variant-outlinedColor) !important","--variant-outlinedBorder":"var(--variant-outlinedBorder) !important","--variant-outlinedHoverColor":"var(--variant-outlinedHoverColor) !important","--variant-outlinedHoverBorder":"var(--variant-outlinedHoverBorder) !important","--variant-outlinedHoverBg":"var(--variant-outlinedHoverBg) !important","--variant-outlinedActiveBg":"var(--variant-outlinedActiveBg) !important","--variant-outlinedDisabledColor":"var(--variant-outlinedDisabledColor) !important","--variant-outlinedDisabledBorder":"var(--variant-outlinedDisabledBorder) !important","--variant-softColor":"var(--variant-softColor) !important","--variant-softHoverColor":"var(--variant-softHoverColor) !important","--variant-softBg":"var(--variant-softBg) !important","--variant-softHoverBg":"var(--variant-softHoverBg) !important","--variant-softActiveBg":"var(--variant-softActiveBg) !important","--variant-softActiveColor":"var(--variant-softActiveColor) !important","--variant-softDisabledColor":"var(--variant-softDisabledColor) !important","--variant-softDisabledBg":"var(--variant-softDisabledBg) !important","--variant-solidColor":"var(--variant-solidColor) !important","--variant-solidBg":"var(--variant-solidBg) !important","--variant-solidHoverBg":"var(--variant-solidHoverBg) !important","--variant-solidActiveBg":"var(--variant-solidActiveBg) !important","--variant-solidDisabledColor":"var(--variant-solidDisabledColor) !important","--variant-solidDisabledBg":"var(--variant-solidDisabledBg) !important","--Badge-ringColor":"var(--Badge-ringColor) !important",colorScheme:"unset",[t.getColorSchemeSelector("light")]:{[x("--palette-focusVisible")]:"".concat(null==(a=t.colorSchemes.light)?void 0:a.palette.focusVisible," !important"),[x("--palette-background-body")]:"".concat(null==(e=t.colorSchemes.light)?void 0:e.palette.background.body," !important"),[x("--palette-background-surface")]:"".concat(null==(o=t.colorSchemes.light)?void 0:o.palette.background.surface," !important"),[x("--palette-background-popup")]:"".concat(null==(r=t.colorSchemes.light)?void 0:r.palette.background.popup," !important"),[x("--palette-background-level1")]:"".concat(null==(l=t.colorSchemes.light)?void 0:l.palette.background.level1," !important"),[x("--palette-background-level2")]:"".concat(null==(c=t.colorSchemes.light)?void 0:c.palette.background.level2," !important"),[x("--palette-background-level3")]:"".concat(null==(i=t.colorSchemes.light)?void 0:i.palette.background.level3," !important"),[x("--palette-text-primary")]:"".concat(null==(p=t.colorSchemes.light)?void 0:p.palette.text.primary," !important"),[x("--palette-text-secondary")]:"".concat(null==(v=t.colorSchemes.light)?void 0:v.palette.text.secondary," !important"),[x("--palette-text-tertiary")]:"".concat(null==(d=t.colorSchemes.light)?void 0:d.palette.text.tertiary," !important"),[x("--palette-divider")]:"".concat(null==(s=t.colorSchemes.light)?void 0:s.palette.divider," !important")},[t.getColorSchemeSelector("dark")]:{[x("--palette-focusVisible")]:"".concat(null==(g=t.colorSchemes.dark)?void 0:g.palette.focusVisible," !important"),[x("--palette-background-body")]:"".concat(null==(m=t.colorSchemes.dark)?void 0:m.palette.background.body," !important"),[x("--palette-background-surface")]:"".concat(null==(h=t.colorSchemes.dark)?void 0:h.palette.background.surface," !important"),[x("--palette-background-popup")]:"".concat(null==(b=t.colorSchemes.dark)?void 0:b.palette.background.popup," !important"),[x("--palette-background-level1")]:"".concat(null==(u=t.colorSchemes.dark)?void 0:u.palette.background.level1," !important"),[x("--palette-background-level2")]:"".concat(null==(C=t.colorSchemes.dark)?void 0:C.palette.background.level2," !important"),[x("--palette-background-level3")]:"".concat(null==(f=t.colorSchemes.dark)?void 0:f.palette.background.level3," !important"),[x("--palette-text-primary")]:"".concat(null==(B=t.colorSchemes.dark)?void 0:B.palette.text.primary," !important"),[x("--palette-text-secondary")]:"".concat(null==(y=t.colorSchemes.dark)?void 0:y.palette.text.secondary," !important"),[x("--palette-text-tertiary")]:"".concat(null==(k=t.colorSchemes.dark)?void 0:k.palette.text.tertiary," !important"),[x("--palette-divider")]:"".concat(null==(D=t.colorSchemes.dark)?void 0:D.palette.divider," !important")}}};const i=t=>a=>{const e=void 0!==a.theme?a.theme:a;const i=(0,o.Z)(e.cssVarPrefix),p=n(e.cssVarPrefix),v=t=>{const a=t.split("-");return i(t,e.palette[a[1]][a[2]])};return{[l]:{"--Badge-ringColor":v("palette-".concat(t,"-solidBg")),"--Icon-color":"currentColor",["".concat(e.getColorSchemeSelector("light"),", ").concat(e.getColorSchemeSelector("dark"))]:{colorScheme:"dark",[p("--palette-focusVisible")]:v("palette-".concat(t,"-200")),[p("--palette-background-body")]:"rgba(0 0 0 / 0.1)",[p("--palette-background-surface")]:"rgba(0 0 0 / 0.06)",[p("--palette-background-popup")]:v("palette-".concat(t,"-700")),[p("--palette-background-level1")]:"rgba(".concat(v("palette-".concat(t,"-darkChannel"))," / 0.2)"),[p("--palette-background-level2")]:"rgba(".concat(v("palette-".concat(t,"-darkChannel"))," / 0.36)"),[p("--palette-background-level3")]:"rgba(".concat(v("palette-".concat(t,"-darkChannel"))," / 0.6)"),[p("--palette-text-primary")]:v("palette-common-white"),[p("--palette-text-secondary")]:v("palette-".concat(t,"-200")),[p("--palette-text-tertiary")]:v("palette-".concat(t,"-300")),[p("--palette-text-icon")]:v("palette-".concat(t,"-200")),[p("--palette-divider")]:"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.32)"),"--variant-plainColor":v("palette-".concat(t,"-50")),"--variant-plainHoverColor":"#fff","--variant-plainHoverBg":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.12)"),"--variant-plainActiveBg":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.32)"),"--variant-plainDisabledColor":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.72)"),"--variant-outlinedColor":v("palette-".concat(t,"-50")),"--variant-outlinedBorder":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.5)"),"--variant-outlinedHoverColor":"#fff","--variant-outlinedHoverBorder":v("palette-".concat(t,"-300")),"--variant-outlinedHoverBg":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.12)"),"--variant-outlinedActiveBg":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.32)"),"--variant-outlinedDisabledColor":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.72)"),"--variant-outlinedDisabledBorder":"rgba(255 255 255 / 0.2)","--variant-softColor":v("palette-common-white"),"--variant-softHoverColor":v("palette-common-white"),"--variant-softBg":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.24)"),"--variant-softHoverBg":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.36)"),"--variant-softActiveBg":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.16)"),"--variant-softActiveColor":"#fff","--variant-softDisabledColor":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.72)"),"--variant-softDisabledBg":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.1)"),"--variant-solidColor":v("palette-".concat(t,"-").concat("neutral"===t?"600":"500")),"--variant-solidBg":v("palette-common-white"),"--variant-solidHoverBg":v("palette-common-white"),"--variant-solidActiveBg":v("palette-".concat(t,"-100")),"--variant-solidDisabledColor":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.72)"),"--variant-solidDisabledBg":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.1)")}},["&, & [".concat(r,"]")]:c(e)}},p=t=>a=>{const{theme:e=a}=a,i=(0,o.Z)(e.cssVarPrefix),p=n(e.cssVarPrefix),v=t=>{const a=t.split("-");return i(t,e.palette[a[1]][a[2]])};return{[l]:{"--Badge-ringColor":v("palette-".concat(t,"-softBg")),"--Icon-color":"currentColor",[e.getColorSchemeSelector("dark")]:{[p("--palette-focusVisible")]:v("palette-".concat(t,"-300")),[p("--palette-background-body")]:"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.1)"),[p("--palette-background-surface")]:"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.08)"),[p("--palette-background-level1")]:"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.2)"),[p("--palette-background-level2")]:"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.4)"),[p("--palette-background-level3")]:"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.6)"),[p("--palette-text-primary")]:v("palette-".concat(t,"-100")),[p("--palette-text-secondary")]:"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.72)"),[p("--palette-text-tertiary")]:"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.6)"),[p("--palette-text-icon")]:"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.6)"),[p("--palette-divider")]:"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.2)"),"--variant-plainColor":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 1)"),"--variant-plainHoverColor":v("palette-".concat(t,"-50")),"--variant-plainHoverBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.16)"),"--variant-plainActiveBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.32)"),"--variant-plainDisabledColor":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.72)"),"--variant-outlinedColor":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 1)"),"--variant-outlinedHoverColor":v("palette-".concat(t,"-50")),"--variant-outlinedBg":"initial","--variant-outlinedBorder":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.4)"),"--variant-outlinedHoverBorder":v("palette-".concat(t,"-600")),"--variant-outlinedHoverBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.16)"),"--variant-outlinedActiveBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.32)"),"--variant-outlinedDisabledColor":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.72)"),"--variant-outlinedDisabledBorder":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.2)"),"--variant-softColor":v("palette-".concat(t,"-200")),"--variant-softBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.24)"),"--variant-softHoverColor":"#fff","--variant-softHoverBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.32)"),"--variant-softActiveBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.48)"),"--variant-softDisabledColor":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.72)"),"--variant-softDisabledBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.12)"),"--variant-solidColor":"#fff","--variant-solidBg":v("palette-".concat(t,"-500")),"--variant-solidHoverColor":"#fff","--variant-solidHoverBg":v("palette-".concat(t,"-600")),"--variant-solidActiveBg":v("palette-".concat(t,"-600")),"--variant-solidDisabledColor":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.72)"),"--variant-solidDisabledBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.12)")},[e.getColorSchemeSelector("light")]:{[p("--palette-focusVisible")]:v("palette-".concat(t,"-500")),[p("--palette-background-body")]:"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.1)"),[p("--palette-background-surface")]:"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.08)"),[p("--palette-background-level1")]:"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.2)"),[p("--palette-background-level2")]:"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.32)"),[p("--palette-background-level3")]:"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.48)"),[p("--palette-text-primary")]:v("palette-".concat(t,"-700")),[p("--palette-text-secondary")]:"rgba(".concat(v("palette-".concat(t,"-darkChannel"))," / 0.8)"),[p("--palette-text-tertiary")]:"rgba(".concat(v("palette-".concat(t,"-darkChannel"))," / 0.68)"),[p("--palette-text-icon")]:v("palette-".concat(t,"-500")),[p("--palette-divider")]:"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.32)"),"--variant-plainColor":"rgba(".concat(v("palette-".concat(t,"-darkChannel"))," / 0.8)"),"--variant-plainHoverColor":"rgba(".concat(v("palette-".concat(t,"-darkChannel"))," / 1)"),"--variant-plainHoverBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.12)"),"--variant-plainActiveBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.24)"),"--variant-plainDisabledColor":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.6)"),"--variant-outlinedColor":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 1)"),"--variant-outlinedBorder":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.4)"),"--variant-outlinedHoverColor":v("palette-".concat(t,"-600")),"--variant-outlinedHoverBorder":v("palette-".concat(t,"-300")),"--variant-outlinedHoverBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.12)"),"--variant-outlinedActiveBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.24)"),"--variant-outlinedDisabledColor":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.6)"),"--variant-outlinedDisabledBorder":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.12)"),"--variant-softColor":v("palette-".concat(t,"-600")),"--variant-softBg":"rgba(".concat(v("palette-".concat(t,"-lightChannel"))," / 0.8)"),"--variant-softHoverColor":v("palette-".concat(t,"-700")),"--variant-softHoverBg":v("palette-".concat(t,"-200")),"--variant-softActiveBg":v("palette-".concat(t,"-300")),"--variant-softDisabledColor":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.6)"),"--variant-softDisabledBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.08)"),"--variant-solidColor":v("palette-common-white"),"--variant-solidBg":v("palette-".concat(t,"-").concat("neutral"===t?"700":"500")),"--variant-solidHoverColor":v("palette-common-white"),"--variant-solidHoverBg":v("palette-".concat(t,"-").concat("600")),"--variant-solidActiveBg":v("palette-".concat(t,"-").concat("600")),"--variant-solidDisabledColor":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.6)"),"--variant-solidDisabledBg":"rgba(".concat(v("palette-".concat(t,"-mainChannel"))," / 0.08)")}},["&, & [".concat(r,"]")]:c(e)}}}}]);