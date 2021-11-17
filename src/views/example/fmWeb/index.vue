<template>
  <div class="customToolbarContainer">
    <div class="options row">
      <button v-on:click="exportGraphXML()">Export</button>
      <button type="button" v-on:click="saveFile()">Save as File</button>
      <button
        type="button"
        id="show-modal"
        v-on:click="$refs.modalImport.openModal()"
      >
        Import Model
      </button>
      <button type="button" v-on:click="saveImage()">Save as Image</button>
      <modal ref="modalImport">
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
            <button @click="$refs.modalImport.closeModal()">Cancel</button>
            <button @click="$refs.modalImport.closeModal()">Save</button>
          </div>
        </template>
      </modal>
      <el-dialog
        title="Cardinality Input"
        :visible.sync="dialogFormVisible"
        :before-close="handleClose"
      >
        <el-form>
          <el-form-item label="Minimum Cardinality" :label-width="labelWidth">
            <el-input-number
              v-model="inputMinCar"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="Maximum Cardinality" :label-width="labelWidth">
            <el-input-number
              v-model="inputMaxCar"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button type="primary" @click="carInputSave()">Confirm</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="workspace row">
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
        <br />
        <div id="properties" class="properties">
          <table v-if="featureSelected">
            <tr>
              <label for="fname">Feature Name:</label>
              <input type="text" v-model="fName" id="fname" name="fname" />
            </tr>
            <tr>
              <button v-on:click="changeName()">Change Name</button>
            </tr>
            <tr>
              <button v-on:click="deleteCell()">Delete</button>
            </tr>
          </table>
          <table v-else-if="relationSelected">
            <tr>
              Type:
              {{
                rType
              }}
            </tr>
            <tr>
              Relationship:
              {{
                rRealtionship
              }}
            </tr>
            <tr>
              Minimum Cardinality:
              {{
                rMinCardinality
              }}
            </tr>
            <tr>
              Maximum Cardinality:
              {{
                rMaxCardinality
              }}
            </tr>
            <tr>
              <button v-on:click="deleteCell()">Delete</button>
            </tr>
          </table>
          <table v-else>
            <tr>
              None Selected
            </tr>
          </table>
        </div>
      </div>
      <div class="graphContainer" ref="container" id="graphContainer"></div>
    </div>
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
  mxGraphModel as mxGraphModel,
  mxRectangle as MxRectangle,
} from "mxgraph/javascript/mxClient";
//import a modal from the components
import Modal from "./../../../components/Modal.vue";
//Imports the sidebar toolbar items
import { relationshipTypes, toolbarItems } from "./toolbar";

import mxIconSet from "./toolbar";

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
      featureSelected: false,
      relationSelected: false,
      fName: "",
      rType: "",
      rRealtionship: "",
      rMinCardinality: 0,
      rMaxCardinality: 0,
      inputMinCar: 0,
      inputMaxCar: 0,
      dialogFormVisible: false,
      labelWidth: "120 px",
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

      this.graph.connectionHandler.addListener(
        MxEvent.CONNECT,
        function (sender, evt) {
          that.applyRules(that, evt);
        }
      );

      this.graph.getSelectionModel().addListener(MxEvent.CHANGE, () => {
        this.selectionChanged();
      });
    },
    /**
     * Initailizes the graph elemnts and adds an event for double click
     * on elements that shows the elements data in the console.
     */
    initGraph() {
      if (this.R.isNil(this.graph)) {
        return;
      }
      var that = this;

      this.graph.setConnectable(true);
      this.graph.setCellsDisconnectable(false);
      this.graph.setPanning(true);
      this.graph.setAllowDanglingEdges(false);
      this.graph.setCellsEditable(false);
      this.graph.setMultigraph(false);
      //this.graph.enterStopsCellEditing=true;
      this.graph.convertValueToString = (cell) => {
        return this.R.prop("name", cell);
      };
      this.graph.addListener(MxEvent.DOUBLE_CLICK, (graph, evt) => {
        const cell = this.R.pathOr([], ["properties", "cell"], evt);
        console.info(cell);
        this.$prompt("Please input a new name for the Feature", "Tip", {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          //inputPattern:  /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: "Invalid Name",
        })
          .then(({ value }) => {
            let cell = this.graph.getSelectionCell();
            this.graph.getModel().beginUpdate();
            try {
              console.log(value);
              cell.setAttribute("name", value);
              var preferred = this.graph.getPreferredSizeForCell(cell);
              this.graph.updateCellSize(cell, true);
              var current = cell.getGeometry();
              var width = 150;
              var height = 50;
              current.width = preferred.width > width ? preferred.width : width;
              current.height =
                preferred.height > height ? preferred.height : height;
            } finally {
              this.graph.getModel().endUpdate();
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "Input canceled",
            });
          });
      });

      var iconTolerance = 20;

      this.graph.addMouseListener({
        currentState: null,
        currentIconSet: null,
        mouseDown: function (sender, me) {
          // Hides icons on mouse down
          if (this.currentState != null) {
            this.dragLeave(me.getEvent(), this.currentState);
            this.currentState = null;
          }
        },
        mouseMove: function (sender, me) {
          if (
            this.currentState != null &&
            (me.getState() == this.currentState || me.getState() == null)
          ) {
            var tol = iconTolerance;
            var tmp = new MxRectangle(
              me.getGraphX() - tol,
              me.getGraphY() - tol,
              2 * tol,
              2 * tol
            );

            if (MxUtils.intersects(tmp, this.currentState)) {
              return;
            }
          }

          tmp = that.graph.view.getState(me.getCell());

          // Ignores everything but vertices
          if (
            that.graph.isMouseDown ||
            (tmp != null && !that.graph.getModel().isVertex(tmp.cell))
          ) {
            tmp = null;
          }

          if (tmp != this.currentState) {
            if (this.currentState != null) {
              this.dragLeave(me.getEvent(), this.currentState);
            }

            this.currentState = tmp;

            if (this.currentState != null) {
              this.dragEnter(me.getEvent(), this.currentState);
            }
          }
        },
        mouseUp: function (sender, me) {},
        dragEnter: function (evt, state) {
          if (this.currentIconSet == null) {
            this.currentIconSet = new mxIconSet(state);
          }
        },
        dragLeave: function (evt, state) {
          if (this.currentIconSet != null) {
            this.currentIconSet.destroy();
            this.currentIconSet = null;
          }
        },
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
          if (
            cell != undefined &&
            (cell.nodeName == "feature" || cell.nodeName == "relationship")
          ) {
            //Just add to the graph if it is a feature in case of realtionships, push them to an array
            //so you can add them later
            if (cell.nodeName == "feature") {
              this.addFeature(cell);
            } else {
              cells.push(cell);
            }
          }
          elt = elt.nextSibling;
        }
        //Add all the relationships that weren't added previously
        cells.array.forEach((cell) => {
          this.addRelation(cell);
        });
      };
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
    /**
     * Changes the values for the selected cell to activate the properties panel
     */
    selectionChanged() {
      let cell = this.graph.getSelectionCell();

      if (cell == null) {
        this.featureSelected = false;
        this.relationSelected = false;
      } else {
        if (cell.value.nodeName == "FEATURE") {
          this.featureSelected = true;
          this.relationSelected = false;
          this.fName = cell.getAttribute("name");
        } else if (cell.value.nodeName == "RELATIONSHIP") {
          this.featureSelected = false;
          this.relationSelected = true;
          this.rType = cell.getAttribute("type");
          this.rRealtionship = cell.getAttribute("relationship");
          this.rMinCardinality = cell.getAttribute("mincardinality");
          this.rMaxCardinality = cell.getAttribute("maxcardinality");
        }
      }
    },
    /**
     * Removes the selected element from the graph
     */
    deleteCell() {
      let cell = this.graph.getSelectionCell();
      this.graph.getModel().beginUpdate();
      try {
        this.graph.removeCells([cell]);
      } finally {
        this.graph.getModel().endUpdate();
      }
    },
    /**
     * Changes the name from the selected feature
     */
    changeName() {
      let cell = this.graph.getSelectionCell();
      this.graph.getModel().beginUpdate();
      try {
        cell.setAttribute("name", this.fName);
        this.graph.updateCellSize(cell);
      } finally {
        this.graph.getModel().endUpdate();
      }
    },
    /**
     * Gets all the descendants of a given cell
     * Return an array with all the descendants
     */
    getDescendants(cell, descendantsArray) {
      //Gets all descendants of a given cell
      let self = this;
      let outgoing = mxGraphModel.prototype.getOutgoingEdges(cell);
      let descendants = self.getTargets(outgoing);
      if (descendants.length > 0) {
        descendantsArray = self.fuseArrays(descendantsArray, descendants);
        for (let i = 0; i < descendants.length; i++) {
          self.getDescendants(descendants[i], descendantsArray);
        }
      }
      return descendantsArray;
    },
    /**
     * Gets all the ancestors of a given cell
     * Returns and array of all the ancestors
     */
    getAncestors(cell, ancestorsArray) {
      //Gets all ancestors of a given cell
      let self = this;
      let incoming = mxGraphModel.prototype.getIncomingEdges(cell);
      let ancestors = self.getSources(incoming);
      if (ancestors.length > 0) {
        ancestorsArray = self.fuseArrays(ancestorsArray, ancestors);
        for (let i = 0; i < ancestors.length; i++) {
          self.getAncestors(ancestors[i], ancestorsArray);
        }
      }
      return ancestorsArray;
    },
    /**
     * Gets all the relationships that are of the same type
     * Retunrs an array with all the cells that represent the given type of relationship
     */
    getRelationships(relationshipType) {
      //Gets all relationships of the given type
      let allCells = this.graph.getDefaultParent().children;
      let edges = new Array();
      for (let i = 0; i < allCells.length; i++) {
        if (!allCells[i].isVertex()) {
          if (allCells[i].value.attributes.type.nodeValue == relationshipType) {
            edges.push(allCells[i]);
          }
        }
      }
      return edges;
    },
    filterSource(sourceVertex, arrayEdges) {
      //Gets all edges in arrayEdges where sourceVertex is the source
      let finalArray = new Array();
      for (let i = 0; i < arrayEdges; i++) {
        if (
          this.graph.getModel().getTerminal(arrayEdges[i], true) == sourceVertex
        ) {
          finalArray.push(arrayEdges[i]);
        }
      }
      return finalArray;
    },
    filterTarget(targetVertex, arrayEdges) {
      //Gets all edges in arrayEdges where targetVertex is the target
      let finalArray = new Array();
      for (let i = 0; i < arrayEdges.length; i++) {
        if (
          this.graph.getModel().getTerminal(arrayEdges[i], false) ==
          targetVertex
        ) {
          finalArray.push(arrayEdges[i]);
        }
      }
      return finalArray;
    },
    getSources(arrayEdges) {
      //Gets all the sources from the edges in arrayEdges
      let arraySources = new Array();
      for (let i = 0; i < arrayEdges.length; i++) {
        arraySources.push(
          this.graph.getModel().getTerminal(arrayEdges[i], true)
        );
      }
      return arraySources;
    },
    getTargets(arrayEdges) {
      //Gets all the targets from the edges in arrayEdges
      let arrayTargets = new Array();
      for (let i = 0; i < arrayEdges.length; i++) {
        arrayTargets.push(
          this.graph.getModel().getTerminal(arrayEdges[i], false)
        );
      }
      return arrayTargets;
    },
    compareVertex(arrayVertexA, arrayVertexB) {
      //Compares if there is any coincidence from the vertex in arrayA and arrayB. true = any coincidences found
      for (let i = 0; i < arrayVertexA.length; i++) {
        for (let j = 0; j < arrayVertexB.length; j++) {
          if (arrayVertexA[i] == arrayVertexB[j]) {
            return true;
          }
        }
      }
      return false;
    },
    findInArray(arrayVertex, vertex) {
      //Looks if vertex is present in arrayVertex. true = vertex found
      for (let i = 0; i < arrayVertex.length; i++) {
        if (arrayVertex[i] == vertex) {
          return true;
        }
      }
      return false;
    },
    fuseArrays(arrayA, arrayB) {
      //Fuses arrayA and arrayB getting rid of all duplicates
      let finalArray = new Array();
      for (let i = 0; i < arrayA.length; i++) {
        if (!finalArray.includes(arrayA[i])) {
          finalArray.push(arrayA[i]);
        }
      }
      for (let i = 0; i < arrayB.length; i++) {
        if (!finalArray.includes(arrayB[i])) {
          finalArray.push(arrayB[i]);
        }
      }
      return finalArray;
    },
    /*
     *Wrapper for the rule usage on connection
     */
    applyRules(that, evt) {
      let edge = evt.getProperty("cell");
      let target = that.graph.getModel().getTerminal(edge, false);
      let source = that.graph.getModel().getTerminal(edge, true);

      //DEF01, DEF02, CST01
      if (that.relationType == "Mandatory" || that.relationType == "Optional") {
        this.carInputOpen();
      }

      //CST04, CST05
      if (that.relationType == "Or" || that.relationType == "Alternative") {
        //CST04
        let rel = that.fuseArrays(
          that.getRelationships("Mandatory"),
          that.getRelationships("Optional")
        );
        let a = that.filterTarget(target, rel);
        let b = that.filterTarget(source, rel);
        a = that.getSources(a);
        b = that.getSources(b);
        if (!that.compareVertex(a, b)) {
          that.graph.removeCells([edge]);
          MxUtils.alert(
            "CST04. Can't create " +
              that.relationType +
              ". Only between brothers"
          );
        }
        //CST05
        rel = that.getRelationships("Mandatory");
        a = that.filterTarget(target, rel);
        b = that.filterTarget(source, rel);
        a = that.getSources(a);
        b = that.getSources(b);
        if (!that.compareVertex(a, b)) {
          that.graph.removeCells([edge]);
          MxUtils.alert(
            "CST05. Can't create " +
              that.relationType +
              ". Only between Mandatory Features"
          );
        }
      }

      //CST07, CST08
      if (that.relationType == "Requires" || that.relationType == "Excludes") {
        //CST07
        let rel = that.fuseArrays(
          that.getRelationships("Mandatory"),
          that.getRelationships("Optional")
        );
        let a = that.filterTarget(target, rel);
        let b = that.filterTarget(source, rel);
        a = that.getSources(a);
        b = that.getSources(b);
        if (that.compareVertex(a, b)) {
          that.graph.removeCells([edge]);
          MxUtils.alert(
            "CST07. Can't create " + that.relationType + " between brothers"
          );
        }

        // //CST08
        // if(relationType == "Excludes"){
        //     let descendantsArray = new Array();
        //     descendantsArray = that.getDescendants(source, descendantsArray);
        //     console.log(descendantsArray);
        //     if(!that.findInArray(descendantsArray, target)){
        //         MxUtils.alert("CST08 se cumple");
        //     }
        //     else{
        //         MxUtils.alert("CST08 NO se cumple");
        //     }
        // }
      }
    },
    carInputOpen() {
      this.dialogFormVisible = true;
    },
    carInputSave() {
      this.dialogFormVisible = false;

      let minCardinality = this.inputMinCar;
      let maxCardinality = this.inputMaxCar;

      //let minCardinality = MxUtils.prompt("Minimum Cardinality");
      //let maxCardinality = MxUtils.prompt("Maximum Cardinality");
      let edge = this.graph.getSelectionCell();
      edge.setAttribute("minCardinality", minCardinality);
      edge.setAttribute("maxCardinality", maxCardinality);

      if (minCardinality == null || maxCardinality == null) {
        MxUtils.alert(
          "You didn't complete the min or max cardinality input request or canceled it, so the relationship will be removed"
        );
        this.graph.removeCells([edge]);
        return;
      }
      //DEF01
      if (this.relationType == "Mandatory") {
        if (!(minCardinality > 0)) {
          this.graph.removeCells([edge]);
          MxUtils.alert(
            "DEF01. Can't create Mandatory. Minimum cardinality must be greater than 0"
          );
        }
      }
      //DEF02
      else if (this.relationType == "Optional") {
        if (!(minCardinality == 0)) {
          this.graph.removeCells([edge]);

          MxUtils.alert(
            "DEF02. Can't create Optional. Minimum cardinality must be equal to 0"
          );
          this.graph.clearSelection();
          this.relationSelected = false;
        }
      }
      //CST01

      if (!(minCardinality >= 0 && minCardinality <= maxCardinality)) {
        this.graph.removeCells([edge]);
        MxUtils.alert(
          "CST01. Cant't create " +
            this.relationType +
            ". Minimum Cardinality < 0 or Minimum Cardinality > Maximum Cardinality"
        );
      }
    },
    /**
     * Handles the close event for dialog
     */
    handleClose() {
      this.$confirm("Are you sure to close this dialog?")
        .then(() => {
          this.dialogFormVisible = false;
          let edge = this.graph.getSelectionCell();
          this.graph.removeCells([edge]);
          this.$message({
            type: "info",
            message: "Cadinality Input canceled, the relation was be removed",
          });
        })
        .catch(() => {
          
        });
    },
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
  position: relative;

  .options {
    display: flex;
    height: 20px;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 2px;
  }
  .workspace {
    height: 100%;
    display: flex;
    position: relative;
    width: 100%;

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
      .properties {
        background: #ffffff;
        margin: 10px;
        padding: 10px;
        text-align: center;
        flex-wrap: wrap;
        justify-content: center;
        border: 2px solid black;
      }
    }

    .graphContainer {
      position: relative;
      flex: 7;
    }
  }
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }
}
</style>
