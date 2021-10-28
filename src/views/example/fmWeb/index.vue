<template>
  <div class="customToolbarContainer">
    <div class="options">
      <button v-on:click="exportGraphXML()">Export</button>
      <button type="button" v-on:click="saveFile()">Save as File</button>
      <button
        type="button"
        id="show-modal"
        v-on:click="$refs.modalName.openModal()"
      >
        Import Model
      </button>
      <button type="button" v-on:click="saveImage()">Save as Image</button>
      <modal ref="modalName">
        <template v-slot:header>
          <h1>Select a Model File and Upload it</h1>
        </template>

        <template v-slot:body>
          <input
            type="file"
            round
            id="import-file-model"
            v-on:change="importModel"
          />
        </template>

        <template v-slot:footer>
          <div>
            <button @click="$refs.modalName.closeModal()">Cancel</button>
            <button @click="$refs.modalName.closeModal()">Save</button>
          </div>
        </template>
      </modal>
    </div>
    <div class="toolbarContainer" id="toolbarContainer">
      <ul>
        <li v-for="item in toolbarItems" :key="item['title']" ref="toolItem">
          <img :src="item['icon']" :alt="item['title']" />
          <span>{{ item["title"] }}</span>
        </li>
      </ul>
      <br />
      <p>Relationships</p>
      <p>Current: {{ relationType }}</p>
      <ul>
        <li
          v-for="item in relationshipTypes"
          :key="item['title']"
          ref="relItem"
        >
          <button v-on:click="relationType = item['title']">
            <img :src="item['icon']" :alt="item['title']" />
            <span>{{ item["title"] }}</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="graphContainer" ref="container" id="graphContainer"></div>
  </div>
</template>
<script>
//Imports the classes in the mxClient
import {
  mxCell as MxCell,
  mxCodec as MxCodec,
  mxConnectionConstraint as MxConnectionConstraint,
  mxConnectionHandler as MxConnectionHandler,
  mxEvent as MxEvent,
  mxGeometry as MxGeometry,
  mxGraph as MxGraph,
  mxImage as MxImage,
  mxPoint as MxPoint,
  mxShape as MxShape,
  mxUtils as MxUtils,
} from "mxgraph/javascript/mxClient";
//import a modal from the components
import Modal from "./../../../components/Modal.vue";
//Imports the sidebar toolbar items
import { relationshipTypes, toolbarItems } from "./toolbar";

export default {
  name: "index2",
  components: {
    Modal,
  },
  computed: {
    toolbarItems: () => toolbarItems,
    relationshipTypes: () => relationshipTypes,
  },
  data() {
    return {
      graph: null,
      relationType: "Optional",
    };
  },
  methods: {
    /**
     * Creates the graph asociating to the container
     * Also sets up the shape connection constraints and the connect image
     * Ands add a connection handler so that each connection gets the realtion type setted
     * Finally adds the connection listener that listen for the Definitions and Constraints
     */
    createGraph() {
      MxGraph.prototype.getAllConnectionConstraints = function (terminal) {
        if (terminal != null && terminal.shape != null) {
          if (terminal.shape.stencil != null) {
            if (terminal.shape.stencil.constraints != null) {
              return terminal.shape.stencil.constraints;
            }
          } else if (terminal.shape.constraints != null) {
            return terminal.shape.constraints;
          }
        }
        return null;
      };
      MxShape.prototype.constraints = [
        new MxConnectionConstraint(new MxPoint(0.25, 0), true),
        new MxConnectionConstraint(new MxPoint(0.5, 0), true),
        new MxConnectionConstraint(new MxPoint(0.75, 0), true),
        new MxConnectionConstraint(new MxPoint(0, 0.25), true),
        new MxConnectionConstraint(new MxPoint(0, 0.5), true),
        new MxConnectionConstraint(new MxPoint(0, 0.75), true),
        new MxConnectionConstraint(new MxPoint(1, 0.25), true),
        new MxConnectionConstraint(new MxPoint(1, 0.5), true),
        new MxConnectionConstraint(new MxPoint(1, 0.75), true),
        new MxConnectionConstraint(new MxPoint(0.25, 1), true),
        new MxConnectionConstraint(new MxPoint(0.5, 1), true),
        new MxConnectionConstraint(new MxPoint(0.75, 1), true),
      ];
      MxConnectionHandler.prototype.connectImage = new MxImage(
        require("../../../assets/connector.gif"),
        16,
        16
      );
      this.graph = new MxGraph(this.$refs.container);
      let that = this;
      this.graph.connectionHandler.factoryMethod = function (
        source,
        target,
        style
      ) {
        let newRelationship = document.createElement("Relationship");
        newRelationship.setAttribute("type", that.relationType);
        let relation = relationshipTypes.find((obj) => {
          return obj.title === that.relationType;
        });
        newRelationship.setAttribute("relationship", relation.relationship);
        const relStyle = Object.keys(relation.style)
          .map((attr) => `${attr}=${relation.style[attr]}`)
          .join(";");
        style = relStyle;
        let edge = new MxCell(newRelationship, new MxGeometry());
        edge.setEdge(true);
        edge.setStyle(style);
        edge.geometry.relative = true;
        return edge;
      };

      let self = this;
      this.graph.connectionHandler.addListener(
        MxEvent.CONNECT,
        function (sender, evt) {
          let edge = evt.getProperty("cell");
          let target = that.graph.getModel().getTerminal(edge, false);
          let source = that.graph.getModel().getTerminal(edge, true);

          //DEF01, DEF02, CST01
          if (
            that.relationType == "Mandatory" ||
            that.relationType == "Optional"
          ) {
            let minCardinality = MxUtils.prompt("Minimum Cardinality");
            let maxCardinality = MxUtils.prompt("Maximum Cardinality");
            edge.setAttribute("minCardinality", minCardinality);
            edge.setAttribute("maxCardinality", maxCardinality);

            //DEF01
            if (that.relationType == "Mandatory") {
              if (!(minCardinality > 0)) {
                that.graph.removeCells([edge]);
                MxUtils.alert(
                  "DEF01. Can't create Mandatory. Minimum cardinality must be greater than 0"
                );
              }
            }
            //DEF02
            else if (that.relationType == "Optional") {
              if (!(minCardinality == 0)) {
                that.graph.removeCells([edge]);
                MxUtils.alert(
                  "DEF02. Can't create Optional. Minimum cardinality must be equal to 0"
                );
              }
            }
            //CST01
            if (!(minCardinality >= 0 && minCardinality <= maxCardinality)) {
              that.graph.removeCells([edge]);
              MxUtils.alert(
                "CST01. Cant't create " +
                  that.relationType +
                  ". Minimum Cardinality < 0 or Minimum Cardinality > Maximum Cardinality"
              );
            }
          }

          //CST04, CST05
          if (that.relationType == "Or" || that.relationType == "Alternative") {
            //CST04
            let rel = self.fuseArrays(
              self.getRelationships("Mandatory"),
              self.getRelationships("Optional")
            );
            let a = self.filterTarget(target, rel);
            let b = self.filterTarget(source, rel);
            a = self.getSources(a);
            b = self.getSources(b);
            if (!self.compareVertex(a, b)) {
              that.graph.removeCells([edge]);
              MxUtils.alert(
                "CST04. Can't create " +
                  that.relationType +
                  ". Only between brothers"
              );
            }
            //CST05
            rel = self.getRelationships("Mandatory");
            a = self.filterTarget(target, rel);
            b = self.filterTarget(source, rel);
            a = self.getSources(a);
            b = self.getSources(b);
            if (!self.compareVertex(a, b)) {
              that.graph.removeCells([edge]);
              MxUtils.alert(
                "CST05. Can't create " +
                  that.relationType +
                  ". Only between Mandatory Features"
              );
            }
          }

          //CST07, CST08
          if (
            that.relationType == "Requires" ||
            that.relationType == "Excludes"
          ) {
            //CST07
            let rel = self.fuseArrays(
              self.getRelationships("Mandatory"),
              self.getRelationships("Optional")
            );
            let a = self.filterTarget(target, rel);
            let b = self.filterTarget(source, rel);
            a = self.getSources(a);
            b = self.getSources(b);
            if (self.compareVertex(a, b)) {
              that.graph.removeCells([edge]);
              MxUtils.alert(
                "CST07. Can't create " + that.relationType + " between brothers"
              );
            }

            // //CST08
            // if(relationType == "Excludes"){
            //     let descendantsArray = new Array();
            //     descendantsArray = self.getDescendants(source, descendantsArray);
            //     console.log(descendantsArray);
            //     if(!self.findInArray(descendantsArray, target)){
            //         MxUtils.alert("CST08 se cumple");
            //     }
            //     else{
            //         MxUtils.alert("CST08 NO se cumple");
            //     }
            // }
          }
        }
      );
    },
    /**
     * Initailizes the graph elemnts and adds an event for double click
     * on elements that shows the elements data in the console.
     */
    initGraph() {
      if (this.R.isNil(this.graph)) {
        return;
      }
      this.graph.setConnectable(true); // 允许连线
      this.graph.setCellsDisconnectable(true);
      this.graph.setPanning(true);
      this.graph.setAllowDanglingEdges(false);
      this.graph.setCellsEditable(true); // 不可修改
      this.graph.convertValueToString = (cell) => {
        // 从value中获取显示的内容
        return this.R.prop("title", cell);
      };
      this.graph.addListener(MxEvent.DOUBLE_CLICK, (graph, evt) => {
        // 监听双击事件
        const cell = this.R.pathOr([], ["properties", "cell"], evt);

        console.info(cell); // 在控制台输出双击的cell
      });

      this.graph.convertValueToString = function (cell) {
        if (MxUtils.isNode(cell.value)) {
          if (cell.value.nodeName.toLowerCase() == "feature") {
            let featureName = cell.getAttribute("name", "");
            return featureName;
          }
        }
        return "";
      };
    },
    /**
     * Add cell from the data in the toolbar array
     */
    addCell(toolItem, x, y) {
      const { width, height } = toolItem;
      const styleObj = toolItem["style"];
      const style = Object.keys(styleObj)
        .map((attr) => `${attr}=${styleObj[attr]}`)
        .join(";");
      const parent = this.graph.getDefaultParent();

      let newFeature = document.createElement("Feature");
      newFeature.setAttribute("name", "New Feature");
      this.graph.getModel().beginUpdate();
      try {
        var vertex = this.graph.insertVertex(
          parent,
          null,
          newFeature,
          x,
          y,
          width,
          height,
          style
        );

        vertex.title = toolItem["title"];
      } finally {
        this.graph.getModel().endUpdate();
      }
      this.graph.setSelectionCell(vertex);
    },
    /**
     * Initializes the toolbar elements, actually working for one elements
     * but its supposed to work in any number of them.
     * Sets up the draggable preview for them
     */
    initToolbar() {
      const domArray = this.$refs.toolItem;

      if (!(domArray instanceof Array) || domArray.length <= 0) {
        return;
      }
      domArray.forEach((dom, domIndex) => {
        const toolItem = this.toolbarItems[domIndex];
        const { width, height } = toolItem;

        const dropHandler = (graph, evt, cell, x, y) => {
          this.addCell(toolItem, x, y);
        };
        const createDragPreview = () => {
          const elt = document.createElement("div");

          elt.style.border = "2px dotted black";
          elt.style.width = `${width}px`;
          elt.style.height = `${height}px`;
          return elt;
        };

        MxUtils.makeDraggable(
          dom,
          this.graph,
          dropHandler,
          createDragPreview(),
          0,
          0,
          false,
          true
        );
      });
    },
    /**
     * Not used but planned in the beginig, is possible to delete at this moment
     */
    initRelationType() {
      const domArray = this.$refs.relItem;

      if (!(domArray instanceof Array) || domArray.length <= 0) {
        return;
      }
      /*
      domArray.forEach((dom, domIndex) => {
        const relItem = this.relationshipTypes[domIndex];
      });
      */
    },
    /**
     * Creates a text field for future modifiying, possible not in use
     * in case we add the modifiable true propertie of the graph
     */
    createTextField(graph, form, cell, attribute) {
      let input = form.addText(attribute.nodeName + ":", attribute.nodeValue);

      let applyHandler = function () {
        let newValue = input.value || "";
        let oldValue = cell.getAttribute(attribute.nodeName, "");

        if (newValue != oldValue) {
          graph.getModel().beginUpdate();
          try {
            cell.setAttribute(attribute.nodeName, newValue);
            graph.updateCellSize(cell);
          } finally {
            graph.getModel().endUpdate();
          }
        }
      };

      this.mxEvent.addListener(input, "keypress", function (evt) {
        if (evt.keyCode == /*enter*/ 13 && !this.mxEvent.isShiftDown(evt)) {
          input.blur();
        }
      });

      if (this.mxClient.IS_IE) {
        this.mxEvent.addListener(input, "focusout", applyHandler);
      } else {
        this.mxEvent.addListener(input, "blur", applyHandler);
      }
    },
    /**
     * Shows the current XML data of the full graph in the console
     * And dispatches the XML data transformed to JSON to a local file with the name GraphData.json
     * Uses the blob method to make the download so it has size constraints
     */
    exportGraphXML() {
      var encoder = new MxCodec();
      var node = encoder.encode(this.graph.getModel());
      MxUtils.getXml(node);

      var xmlString = MxUtils.getXml(node); // fetch xml (string or document/node)

      console.log(xmlString);
      var parseString = require("xml2js").parseString;
      parseString(xmlString, function (err, result) {
        var data = JSON.stringify(result, null, 4);
        const blob = new Blob([data], { type: "text/plain" });
        const e = document.createEvent("MouseEvents"),
          a = document.createElement("a");
        a.download = "GraphData.json";
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
        e.initEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        a.dispatchEvent(e);
      }); // parses to JSON object
    },
    /**
     * Saves the data model of the graph to a local file
     * Normal format of the file is XML
     * Uses the blob method to make the download so it has size constraints
     */
    saveFile() {
      var encoder = new MxCodec();
      var node = encoder.encode(this.graph.getModel());
      MxUtils.getXml(node);

      var data = MxUtils.getXml(node);
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = "GraphData.xml";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/xml", a.download, a.href].join(":");
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },
    /**
     * Imports a XML model from a local XML file
     */
    importModel(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      var file = files[0];
      var reader = new FileReader();
      var vm = this;
      reader.onload = (e) => {
        var xml = e.target.result;

        var doc = MxUtils.parseXml(xml.substring(14, xml.length - 15));
        vm.graph.model.clear();
        let codec = new MxCodec(doc);
        codec.decode(doc.documentElement, vm.graph.getModel());
        let elt = doc.documentElement.firstChild;
        let cells = [];
        while (elt != null) {
          let cell = codec.decode(elt);
          console.log(cell);
          if (
            cell != undefined &&
            (cell.nodeName == "feature" || cell.nodeName == "relationship")
          ) {
            if (cell.nodeName == "feature") {
              this.addFeature(cell);
            }
            if (cell.nodeName == "relationship") {
              this.addRelation(cell);
            }
            cells.push(cell);
          }
          elt = elt.nextSibling;
        }
        console.log(cells);      };
      reader.readAsText(file);
    },
    /**
     * Saves the graph model as an image
     * Uses the SVG to save a image file
     */
    saveImage() {
      const svgContent = document.querySelector(
          "#graphContainer > svg"
        ).outerHTML,
        blob = new Blob([svgContent], {
          type: "image/svg+xml",
        });
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = "FM.svg";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["image/svg+xml", a.download, a.href].join(":");
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },
    /**
     * Adds a feature based on the data from an xml dom
     */
    addFeature(feature) {
      let geom = feature.getElementsByTagName("mxGeometry")[0];
      let auxCell = feature.getElementsByTagName("mxCell")[0];

      let newFeature = document.createElement("Feature");
      newFeature.setAttribute("name", feature.getAttribute("name"));
      this.graph.getModel().beginUpdate();
      try {
        var vertex = this.graph.insertVertex(
          this.graph.getDefaultParent(),
          feature.getAttribute("id"),
          newFeature,
          geom.getAttribute("x"),
          geom.getAttribute("y"),
          geom.getAttribute("width"),
          geom.getAttribute("height"),
          auxCell.getAttribute("style")
        );
        console.log(vertex);
        vertex.title = auxCell.getAttribute("title");
      } finally {
        this.graph.getModel().endUpdate();
      }
    },
    /**
     * Adds a realtionship based on the data from an xml dom
     */
    addRelation(relat) {
      //type="Optional" relationship="Parenthood" mincardinality="0" maxcardinality="1" id="4"
      //mxCell => style="startArrow=0;endArrow=oval;endFill=0" edge="1" parent="1" source="2" target="3">
      //mxGeometry => relative="1" as="geometry"/>
      let auxCell = relat.getElementsByTagName("mxCell")[0];

      let newRelationship = document.createElement("Relationship");

      let source = this.graph.model.getCell(auxCell.getAttribute("source"));
      let target = this.graph.model.getCell(auxCell.getAttribute("target"));

      if (relat.hasAttribute("mincardinality")) {
        newRelationship.setAttribute(
          "mincardinality",
          relat.getAttribute("mincardinality")
        );
      }
      if (relat.hasAttribute("maxcardinality")) {
        newRelationship.setAttribute(
          "maxcardinality",
          relat.getAttribute("maxcardinality")
        );
      }

      newRelationship.setAttribute("type", relat.getAttribute("type"));
      newRelationship.setAttribute(
        "relationship",
        relat.getAttribute("relationship")
      );

      let edge = new MxCell(newRelationship, new MxGeometry());
      edge.setEdge(true);
      edge.setStyle(auxCell.getAttribute("style"));
      edge.geometry.relative = true;

      this.graph.addEdge(edge, null, source, target);
    },
    /*
    setGraphXml(node) {
      if (node != null) {
        var dec = new MxCodec(node.ownerDocument);

        if (node.nodeName == "mxGraphModel") {
          this.graph.model.beginUpdate();

          try {
            this.graph.model.clear();
            this.graph.view.scale = 1;
            this.readGraphState(node);
            this.updateGraphComponents();
            dec.decode(node, this.graph.getModel());
          } finally {
            this.graph.model.endUpdate();
          }

          this.fireEvent(new mxEventObject("resetGraphView"));
        } else if (node.nodeName == "root") {
          this.resetGraph();

          // Workaround for invalid XML output in Firefox 20 due to bug in mxUtils.getXml
          var wrapper = dec.document.createElement("mxGraphModel");
          wrapper.appendChild(node);

          dec.decode(wrapper, this.graph.getModel());
          this.updateGraphComponents();
          this.fireEvent(new mxEventObject("resetGraphView"));
        } else {
          throw {
            message: mxResources.get("cannotOpenFile"),
            node: node,
            toString: function () {
              return this.message;
            },
          };
        }
      } else {
        this.resetGraph();
        this.graph.model.clear();
        this.fireEvent(new mxEventObject("resetGraphView"));
      }
    },
    */
  },
  mounted() {
    this.createGraph();
    this.initGraph();
    this.initToolbar();
    this.initRelationType();
    this.$refs.container.style.background = 'url("./mxgraph/images/grid.gif")';
  },
};
</script>

<style lang="scss">
.customToolbarContainer {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

  .options {
    flex: 1;
    position: top;
  }
  .options::after {
    content: "\a";
    white-space: pre;
  }
  .toolbarContainer {
    flex: 1;
    font-size: 20px;
    background: #efefef;
    text-align: center;
    padding-top: 20px;

    ul {
      padding: 0;
      margin: 0;

      li {
        list-style: none;
        margin-bottom: 10px;
        cursor: pointer;

        img {
          width: 15px;
          height: 15px;
        }

        span {
          margin-left: 15px;
        }
      }
    }
  }

  .graphContainer {
    position: relative;
    flex: 7;
  }
}
</style>
