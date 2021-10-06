/*
import {
  mxConstants as MxConstants
} from 'mxgraph/javascript/mxClient'
*/
//const outputIcon = './icon/output.png'
//const inputIcon = './icon/input.png'
const featureIcon = './icon/feature.png'
const relationIcon = './icon/link.png'

export const toolbarItems = [
  {
    icon: featureIcon,
    title: 'Feature',
    name: 'New Feature',
    width: 100,
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

export const relationshipTypes = [
  {
    title: 'Optional',
    icon: relationIcon,
    style: {
      startArrow: 0,
      endArrow: 'oval',
      endFill: 0
    }
  },
  {
    title: 'Mandatory',
    icon: relationIcon,
  },
  {
    title: 'Alternative',
    icon: relationIcon,
  },
  {
    title: 'Or',
    icon: relationIcon,
  },
  {
    title: 'Requires',
    icon: relationIcon,
  },
  {
    title: 'Excludes',
    icon: relationIcon,
  },
]