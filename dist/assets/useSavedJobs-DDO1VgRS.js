import{c as n,h as i,w as l}from"./index-sNzRW9nC.js";/**
 * @license lucide-vue-next v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=n("BookmarkCheckIcon",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z",key:"169p4p"}],["path",{d:"m9 10 2 2 4-4",key:"1gnqz4"}]]);/**
 * @license lucide-vue-next v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=n("BookmarkIcon",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]]),s="camlife-saved-jobs";function v(){try{const o=localStorage.getItem(s);return o?JSON.parse(o):[]}catch{return[]}}const a=i(v());l(a,o=>{localStorage.setItem(s,JSON.stringify(o))},{deep:!0});function h(){function o(e){return a.value.includes(e)}function c(e){const t=a.value.indexOf(e);t>-1?a.value.splice(t,1):a.value.push(e)}function u(e){o(e)||a.value.push(e)}function r(e){const t=a.value.indexOf(e);t>-1&&a.value.splice(t,1)}return{savedJobIds:a,isJobSaved:o,toggleSaveJob:c,saveJob:u,unsaveJob:r}}export{f as B,k as a,h as u};
