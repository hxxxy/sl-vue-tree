!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.SlVueTree=t():e.SlVueTree=t()}(window,function(){return function(e){var t={};function s(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,s),i.l=!0,i.exports}return s.m=e,s.c=t,s.d=function(e,t,o){s.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},s.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=0)}([function(e,t,s){"use strict";s.r(t);var o={name:"sl-vue-tree",props:{value:{type:Array,default:()=>[]},edgeSize:{type:Number,default:3},showBranches:{type:Boolean,default:!1},level:{type:Number,default:0},parentInd:{type:Number},allowMultiselect:{type:Boolean,default:!0},scrollAreaHeight:{type:Number,default:70},maxScrollSpeed:{type:Number,default:20}},data:()=>({rootCursorPosition:null,scrollIntervalId:0,scrollSpeed:0,lastSelectedNode:null,mouseIsDown:!1,isDragging:!1,lastMousePos:{x:0,y:0}}),mounted(){this.isRoot&&document.addEventListener("mouseup",this.onDocumentMouseupHandler)},beforeDestroy(){document.removeEventListener("mouseup",this.onDocumentMouseupHandler)},computed:{cursorPosition(){return this.isRoot?this.rootCursorPosition:this.getParent().cursorPosition},nodes(){if(this.isRoot){const e=this.copy(this.value);return this.getNodes(e)}return this.getParent().nodes[this.parentInd].children},gaps(){const e=[];let t=this.level-1;for(this.showBranches||t++;t-- >0;)e.push(t);return e},isRoot(){return!this.level},selectionSize(){return this.getSelected().length}},methods:{setCursorPosition(e){this.isRoot?this.rootCursorPosition=e:this.getParent().setCursorPosition(e)},getNodes(e,t=[]){return e.map((s,o)=>{const i=t.concat(o);return this.getNode(i,s,e)})},getNode(e,t=null,s=null){const o=e.slice(-1)[0];return s=s||this.getNodeSiblings(this.value,e),{title:(t=t||s[o]).title,isLeaf:!!t.isLeaf,children:t.children?this.getNodes(t.children,e):[],isExpanded:void 0==t.isExpanded||!!t.isExpanded,isSelected:!!t.isSelected,data:void 0!==t.data?t.data:{},path:e,pathStr:JSON.stringify(e),level:e.length,ind:o,isFirstChild:0==o,isLastChild:o===s.length-1}},emitInput(e){this.getRoot().$emit("input",e)},emitSelect(e,t){this.getRoot().$emit("select",e,t)},emitDrop(e,t,s){this.getRoot().$emit("drop",e,t,s)},emitToggle(e,t){this.getRoot().$emit("toggle",e,t)},emitNodeDblclick(e,t){this.getRoot().$emit("nodedblclick",e,t)},emitNodeContextmenu(e,t){this.getRoot().$emit("nodecontextmenu",e,t)},select(e,t=null,s=!1){s=(t&&t.ctrlKey||s)&&this.allowMultiselect;const o=this.copy(this.value),i=this.allowMultiselect&&t.shiftKey&&this.lastSelectedNode,n=[];let r=!1;this.traverse((t,o)=>{i?(t.pathStr!==e.pathStr&&t.pathStr!==this.lastSelectedNode.pathStr||(o.isSelected=!0,r=!r),r&&(o.isSelected=!0)):t.pathStr===e.pathStr?o.isSelected=!0:s||o.isSelected&&(o.isSelected=!1),o.isSelected&&n.push(t)},o),this.lastSelectedNode=e,this.emitInput(o),this.emitSelect(n,t)},onNodeMousemoveHandler(e){if(!this.isRoot)return void this.getRoot().onNodeMousemoveHandler(e);const t=this.isDragging;this.isDragging=this.isDragging||this.mouseIsDown&&(this.lastMousePos.x!==e.clientX||this.lastMousePos.y!==e.clientY);const s=!1===t&&!0===this.isDragging;if(this.lastMousePos={x:e.clientX,y:e.clientY},!this.isDragging)return;const o=this.getRoot().$el,i=o.getBoundingClientRect(),n=this.$refs.dragInfo,r=e.clientY-i.top+o.scrollTop-(0|n.style.marginBottom),l=e.clientX-i.left;n.style.top=r+"px",n.style.left=l+"px";const a=document.elementFromPoint(e.clientX,e.clientY),u=a.getAttribute("path")?a:a.closest("[path]");if(!u)return;const d=this.getNode(JSON.parse(u.getAttribute("path")));s&&!d.isSelected&&this.select(d,e);const c=u.offsetHeight,h=this.edgeSize,p=e.offsetY;let g;g=d.isLeaf?p>=c/2?"after":"before":p<=h?"before":p>=c-h?"after":"inside",this.setCursorPosition({node:d,placement:g});const f=i.bottom-this.scrollAreaHeight,v=(e.clientY-f)/(i.bottom-f),m=i.top+this.scrollAreaHeight,S=(m-e.clientY)/(m-i.top);v>0?this.startScroll(v):S>0?this.startScroll(-S):this.stopScroll()},onMouseleaveHandler(e){if(!this.isRoot||!this.isDragging)return;const t=this.getRoot().$el.getBoundingClientRect();e.clientY>=t.bottom?this.setCursorPosition({node:this.getLastNode(),placement:"after"}):e.clientY<t.top&&this.setCursorPosition({node:this.getFirstNode(),placement:"before"})},getNodeEl(e){this.getRoot().$el.querySelector(`[path="${JSON.stringify(e)}"]`)},getLastNode(){let e=null;return this.traverse(t=>{e=t}),e},getFirstNode(){return this.getNode([0])},onNodeMousedownHandler(e,t){0===e.button&&(this.isRoot?this.mouseIsDown=!0:this.getRoot().onNodeMousedownHandler(e,t))},startScroll(e){const t=this.getRoot().$el;this.scrollSpeed!==e&&(this.scrollIntervalId&&this.stopScroll(),this.scrollSpeed=e,this.scrollIntervalId=setInterval(()=>{t.scrollTop+=this.maxScrollSpeed*e},20))},stopScroll(){clearInterval(this.scrollIntervalId),this.scrollIntervalId=0,this.scrollSpeed=0},onDocumentMouseupHandler(e){this.isDragging&&this.onNodeMouseupHandler(e)},onNodeMouseupHandler(e,t=null){if(0!==e.button)return;if(!this.isRoot)return void this.getRoot().onNodeMouseupHandler(e,t);if(this.mouseIsDown=!1,!this.isDragging&&t)return void this.select(t,e);if(!this.cursorPosition)return void this.stopDrag();const s=this.getSelected();for(let e of s){if(e.pathStr==this.cursorPosition.node.pathStr)return void this.stopDrag();if(this.checkNodeIsParent(e,this.cursorPosition.node))return void this.stopDrag()}const o=this.copy(this.value),i=[];for(let e of s){const t=this.getNodeSiblings(o,e.path)[e.ind];i.push(this.copy(t)),t._markToDelete=!0}const n=this.cursorPosition.node,r=this.getNodeSiblings(o,n.path),l=r[n.ind];if("inside"===this.cursorPosition.placement)l.children=l.children||[],l.children.unshift(...i);else{const e="before"===this.cursorPosition.placement?n.ind:n.ind+1;r.splice(e,0,...i)}this.traverse((e,t,s)=>{let o=s.length;for(;o--;)s[o]._markToDelete&&s.splice(o,1)},o),this.lastSelectedNode=null,this.emitInput(o),this.emitDrop(s,this.cursorPosition,e),this.stopDrag()},onToggleHandler(e,t){this.updateNode(t.path,{isExpanded:!t.isExpanded}),this.emitToggle(t,e),e.stopPropagation()},stopDrag(){this.isDragging=!1,this.mouseIsDown=!1,this.setCursorPosition(null),this.stopScroll()},getParent(){return this.$parent},getRoot(){return this.isRoot?this:this.getParent().getRoot()},getNodeSiblings(e,t){return 1===t.length?e:this.getNodeSiblings(e[t[0]].children,t.slice(1))},updateNode(e,t){if(!this.isRoot)return void this.getParent().updateNode(e,t);const s=JSON.stringify(e),o=this.copy(this.value);this.traverse((e,o)=>{e.pathStr===s&&Object.assign(o,t)},o),this.emitInput(o)},getSelected(){const e=[];return this.traverse(t=>{t.isSelected&&e.push(t)}),e},traverse(e,t=null,s=[]){t||(t=this.value);let o=!1;const i=[];return t.forEach((n,r)=>{const l=s.concat(r),a=this.getNode(l,n,t);if(o=!1===e(a,n,t),i.push(a),o)return!1;n.children&&(o=!1===this.traverse(e,n.children,l))}),!o&&i},remove(e){const t=e.map(e=>JSON.stringify(e)),s=this.copy(this.value);this.traverse((e,s,o)=>{for(const o of t)e.pathStr===o&&(s._markToDelete=!0)},s),this.traverse((e,t,s)=>{let o=s.length;for(;o--;)s[o]._markToDelete&&s.splice(o,1)},s),this.emitInput(s)},checkNodeIsParent(e,t){const s=t.path;return JSON.stringify(s.slice(0,e.path.length))==e.pathStr},copy:e=>JSON.parse(JSON.stringify(e))}},i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"sl-vue-tree",class:{"sl-vue-tree-root":e.isRoot},on:{mousemove:function(t){return e.onNodeMousemoveHandler(t)},mouseleave:function(t){return e.onMouseleaveHandler(t)}}},[s("div",{ref:"nodes",staticClass:"sl-vue-tree-nodes-list"},[e._l(e.nodes,function(t,o){return s("div",{staticClass:"sl-vue-tree-node",class:{"sl-vue-tree-selected":t.isSelected}},[s("div",{staticClass:"sl-vue-tree-cursor sl-vue-tree-cursor_before",style:{visibility:e.cursorPosition&&e.cursorPosition.node.pathStr===t.pathStr&&"before"===e.cursorPosition.placement?"visible":"hidden"},on:{dragover:function(e){return e.preventDefault()}}}),e._v(" "),s("div",{staticClass:"sl-vue-tree-node-item",class:{"sl-vue-tree-cursor-inside":e.cursorPosition&&"inside"===e.cursorPosition.placement&&e.cursorPosition.node.pathStr===t.pathStr,"sl-vue-tree-node-is-leaf":t.isLeaf,"sl-vue-tree-node-is-folder":!t.isLeaf},attrs:{path:t.pathStr},on:{drop:function(s){return e.onNodeDropHandler(s,t)},mousedown:function(s){return e.onNodeMousedownHandler(s,t)},mouseup:function(s){return e.onNodeMouseupHandler(s,t)},contextmenu:function(s){return e.emitNodeContextmenu(t,s)},dblclick:function(s){return e.emitNodeDblclick(t,s)}}},[e._l(e.gaps,function(e){return s("div",{staticClass:"sl-vue-tree-gap"})}),e._v(" "),e.level&&e.showBranches?s("div",{staticClass:"sl-vue-tree-branch"},[e._t("branch",[t.isLastChild?e._e():s("span",[e._v("\n            "+e._s(String.fromCharCode(9500))+e._s(String.fromCharCode(9472))+" \n          ")]),e._v(" "),t.isLastChild?s("span",[e._v("\n            "+e._s(String.fromCharCode(9492))+e._s(String.fromCharCode(9472))+" \n          ")]):e._e()],{node:t})],2):e._e(),e._v(" "),s("div",{staticClass:"sl-vue-tree-title"},[t.isLeaf?e._e():s("span",{staticClass:"sl-vue-tree-toggle",on:{click:function(s){return e.onToggleHandler(s,t)}}},[e._t("toggle",[s("span",[e._v("\n             "+e._s(t.isLeaf?"":t.isExpanded?"-":"+")+"\n            ")])],{node:t})],2),e._v(" "),e._t("title",[e._v(e._s(t.title))],{node:t})],2),e._v(" "),s("div",{staticClass:"sl-vue-tree-sidebar"},[e._t("sidebar",null,{node:t})],2)],2),e._v(" "),s("div",{staticClass:"sl-vue-tree-cursor sl-vue-tree-cursor_after",style:{visibility:e.cursorPosition&&e.cursorPosition.node.pathStr===t.pathStr&&"after"===e.cursorPosition.placement?"visible":"hidden"},on:{dragover:function(e){return e.preventDefault()}}}),e._v(" "),t.children&&t.children.length&&t.isExpanded?s("sl-vue-tree",{attrs:{value:t.children,level:t.level,parentInd:o,allowMultiselect:e.allowMultiselect,edgeSize:e.edgeSize,showBranches:e.showBranches},on:{dragover:function(e){return e.preventDefault()}},scopedSlots:e._u([{key:"title",fn:function(t){var s=t.node;return[e._t("title",[e._v(e._s(s.title))],{node:s})]}},{key:"toggle",fn:function(t){var o=t.node;return[e._t("toggle",[s("span",[e._v("\n             "+e._s(o.isLeaf?"":o.isExpanded?"-":"+")+"\n          ")])],{node:o})]}},{key:"sidebar",fn:function(t){var s=t.node;return[e._t("sidebar",null,{node:s})]}}])}):e._e()],1)}),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.isDragging,expression:"isDragging"}],ref:"dragInfo",staticClass:"sl-vue-tree-drag-info"},[e._t("draginfo",[e._v("\n        Items: "+e._s(e.selectionSize)+"\n      ")])],2)],2)])};i._withStripped=!0;var n=function(e,t,s,o,i,n,r,l){var a=typeof(e=e||{}).default;"object"!==a&&"function"!==a||(e=e.default);var u,d="function"==typeof e?e.options:e;if(t&&(d.render=t,d.staticRenderFns=s,d._compiled=!0),o&&(d.functional=!0),n&&(d._scopeId=n),r?(u=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),i&&i.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(r)},d._ssrRegister=u):i&&(u=l?function(){i.call(this,this.$root.$options.shadowRoot)}:i),u)if(d.functional){d._injectStyles=u;var c=d.render;d.render=function(e,t){return u.call(t),c(e,t)}}else{var h=d.beforeCreate;d.beforeCreate=h?[].concat(h,u):[u]}return{exports:e,options:d}}(o,i,[],!1,null,null,null);n.options.__file="src\\sl-vue-tree.vue";t.default=n.exports}]).default});
//# sourceMappingURL=sl-vue-tree.js.map