(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3bd988d6"],{"9bef":function(A,e,t){},a805:function(A,e){A.exports="data:image/gif;base64,R0lGODlhCgAKAOZPAP7//1qt4afV7S+b2WCy4Vms4CqY0/L3/Z/Q8NPr92Gz4jOb2mWz49Lr8tLq9uvy+tPp9+Xy+mK14ejy+1ux4Fus4evx//7+/mm35fv//qfU69fp9Vis26HP8DGb1dTq+PH5+zOc1v38/yma1P79/zSc2e3x+lKs4Gez5Fiu4SmX1imW1zKa2V2w4jOe1C2Z2i+c1Vyu4Fiu3zOd1//+/1ir3Wiy36HS8PH7/M7o9V6w3+j1/Vmv4PL2/1Ot35/Q8S2W2DCb02O33OP1+e75+yaZ0lus4y6d1V6w4ub09+/6/qfV79jq+PX4/1it4////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAE8ALAAAAAAKAAoAAAdigE9PSgISCgIggk9MAy46SAswG08HLzw7AAAPFSMHN0FDHy0FCRFHHQUoND5AKycANk4yQiQ1KkUcFxgBCCVJDjFGDRYePz0GKRMZIiYBBkRPOSwhBBQzAxCKOEsMBBpNgoEAOw=="},a8a4:function(A,e,t){"use strict";t.r(e);var n=function(){var A=this,e=A.$createElement,t=A._self._c||e;return t("div",{staticClass:"customShapeContainer"},[t("div",{ref:"container",staticClass:"graphContainer"})])},i=[],r=t("d06c"),a={name:"customShape",data:function(){return{graph:null,rubberBand:null}},methods:{createGraph:function(){this.graph=new r["mxGraph"](this.$refs.container),this.$refs.container.style.background='url("./mxgraph/images/grid.gif")'},initGraph:function(){if(!this.R.isNil(this.graph)){this.graph.setConnectable(!0),this.rubberBand=new r["mxRubberband"](this.graph);var A=t("a805");this.graph.connectionHandler.constraintHandler.pointImage=new r["mxImage"](A,10,10),this.graph.connectionHandler.constraintHandler.createHighlightShape=function(){return new r["mxEllipse"](null,this.highlightColor,this.highlightColor,2)},this.graph.getAllConnectionConstraints=function(A){if(null!==A&&null!==A.shape){var e=A["cell"],t=e["constraints"];if(t instanceof Array&&t.length>0)return t.map(function(A){return new r["mxConnectionConstraint"](new r["mxPoint"](A["x"],A["y"]),A["perimeter"])});if(A.shape.stencil)return A.shape.stencil.constraints;if(A.shape.constraints)return A.shape.constraints}return null},this.graph.connectionHandler.isConnectableCell=function(){return!1}}},addCell:function(){var A=this.graph.getDefaultParent();this.graph.getModel().beginUpdate();try{var e=this.graph.insertVertex(A,null,null,500,10,200,200,"shape=rect");e["constraints"]=[{x:-.5,y:.25,perimeter:!0},{x:-.5,y:.25,perimeter:!1},{x:-.5,y:.75,perimeter:!0},{x:-.5,y:.75,perimeter:!1},{x:1,y:.25,perimeter:!1},{x:1,y:.75,perimeter:!1}]}finally{this.graph.getModel().endUpdate()}}},mounted:function(){this.createGraph(),this.initGraph(),this.addCell()}},s=a,l=(t("eeeb"),t("2877")),h=Object(l["a"])(s,n,i,!1,null,null,null);e["default"]=h.exports},eeeb:function(A,e,t){"use strict";var n=t("9bef"),i=t.n(n);i.a}}]);
//# sourceMappingURL=chunk-3bd988d6.2d88d305.js.map