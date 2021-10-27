/*
import {
  mxConstants as MxConstants
} from 'mxgraph/javascript/mxClient'
*/
//const outputIcon = './icon/output.png'
//const inputIcon = './icon/input.png'
//Imports the icons from the assets icon folder
const featureIcon = './icon/feature.png'
const relationIcon = './icon/link.png'

/**
 * Array of toolbar elemnts, follow the structure:
 *  {
 *  icon:
 *  title:
 *  width:
 *  height:
 *  style:  {}
 *  }
 */
export const toolbarItems = [
  {
    icon: featureIcon,
    title: 'Feature',
    width: 150,
    height: 50,
    style: {
      fillColor: 'transparent',
      strokeColor: '#000000',
      strokeWidth: '1',
      cursor: 'pointer',
      textAlign: "center",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      border: "2px solid black",
    }
  },/*
  {
    icon: inputIcon,
    title: '输入',
    width: 50,
    height: 50,
    style: {
      fillColor: 'transparent', // 填充色
      strokeColor: '#000000', // 线条颜色
      strokeWidth: '1', // 线条粗细
      shape: MxConstants.SHAPE_LABEL, // 形状
      align: MxConstants.ALIGN_CENTER, // 水平方向对其方式
      verticalAlign: MxConstants.ALIGN_BOTTOM, // 垂直方向对其方式
      imageAlign: MxConstants.ALIGN_CENTER, // 图形水平方向对其方式
      imageVerticalAlign: MxConstants.ALIGN_TOP, // 图形方向对其方式
      image: inputIcon // 图形
    }
  }*/
]

/**
 * Array with the types of realtionships follows the structure:
 * {
 *  title: ...,
 *  relationship: ...,
 *  icon: ...,
 *  style:  {}
 *  }
 */
export const relationshipTypes = [
  {
    title: 'Optional',
    relationship: 'Parenthood',
    icon: relationIcon,
    style: {
      startArrow: 0,
      endArrow: 'oval',
      endFill: 0
    }
  },
  {
    title: 'Mandatory',
    relationship: 'Parenthood',
    icon: relationIcon,
    style: {
      startArrow: 0,
      endArrow: 'oval',
      endFill: 1
    }
  },
  {
    title: 'Alternative',
    relationship: 'LogicAssociation',
    icon: relationIcon,
    style: {
      startArrow: 'block', endArrow: 'block', startFill: 0, endFill: 0
    }
  },
  {
    title: 'Or',
    relationship: 'LogicAssociation',
    icon: relationIcon,
    style: {
      startArrow: 'block', endArrow: 'block', startFill: 1, endFill: 1
    }
  },
  {
    title: 'Requires',
    relationship: 'Dependency',
    icon: relationIcon,
    style: {
      dashed: 1, startArrow: 0, endArrow: 'block', endFill: 1
    }
  },
  {
    title: 'Excludes',
    relationship: 'Dependency',
    icon: relationIcon,
    style: {
      dashed: 1, startArrow: 'block', endArrow: 'block', startFill: 1, endFill: 1
    }
  },
]