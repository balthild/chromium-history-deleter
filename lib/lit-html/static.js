import{html as t,svg as r}from"./lit-html.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o=Symbol.for(""),e=t=>{var r,e;if((null===(r=t)||void 0===r?void 0:r.r)===o)return null===(e=t)||void 0===e?void 0:e._$litStatic$},i=t=>({_$litStatic$:t,r:o}),l=(t,...r)=>({_$litStatic$:r.reduce(((r,o,e)=>r+(t=>{if(void 0!==t._$litStatic$)return t._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`)})(o)+t[e+1]),t[0]),r:o}),a=new Map,s=t=>(r,...o)=>{const i=o.length;let l,s;const n=[],u=[];let c,v=0,$=!1;for(;v<i;){for(c=r[v];v<i&&void 0!==(s=o[v],l=e(s));)c+=l+r[++v],$=!0;u.push(s),n.push(c),v++}if(v===i&&n.push(r[i]),$){const t=n.join("$$lit$$");void 0===(r=a.get(t))&&(n.raw=n,a.set(t,r=n)),o=u}return t(r,...o)},n=s(t),u=s(r);export{n as html,l as literal,u as svg,i as unsafeStatic,s as withStatic};
//# sourceMappingURL=static.js.map
