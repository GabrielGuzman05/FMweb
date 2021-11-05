import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const demoRouter = [
  {
    path: 'welcome',
    name: 'welcome',
    meta: {
      title: 'Welcome',
      icon: require('@/assets/icon/home.png')
    },
    component: () => import('@/views/example/welcome')
  }/*,
  {
    path: 'cascadeDelete',
    name: 'cascadeDelete',
    meta: {
      title: 'Cascade Delete',
      icon: require('@/assets/icon/delete.png')
    },
    component: () => import('@/views/example/cascadeDelete')
  },
  {
    path: 'toolbar',
    name: 'toolbar',
    meta: {
      title: 'Toolbar',
      icon: require('@/assets/icon/toolbar.png')
    },
    component: () => import('@/views/example/toolbar')
  },
  {
    path: 'customToolbar',
    name: 'customToolbar',
    meta: {
      title: 'Custom Toolbar',
      icon: require('@/assets/icon/toolbar2.png')
    },
    component: () => import('@/views/example/customToolbar')
  },
  {
    path: 'stencilToolbar',
    name: 'stencilToolbar',
    meta: {
      title: 'Stencil Toolbar',
      icon: require('@/assets/icon/stencil.png')
    },
    component: () => import('@/views/example/stencilToolbar')
  },
  {
    path: 'htmlLabel',
    name: 'htmlLabel',
    meta: {
      title: 'HTML Label',
      icon: require('@/assets/icon/label.png')
    },
    component: () => import('@/views/example/htmlLabel')
  },
  {
    path: 'edgeStyle',
    name: 'edgeStyle',
    meta: {
      title: 'Edge Style',
      icon: require('@/assets/icon/line.png')
    },
    component: () => import('@/views/example/edgeStyle')
  },
  {
    path: 'customConnectionConstraints',
    name: 'customConnectionConstraints',
    meta: {
      title: 'Custom Connection Constraints',
      icon: require('@/assets/icon/connectPoint.png')
    },
    component: () => import('@/views/example/customConnectionConstraints')
  },
  {
    path: 'manualDrawing',
    name: 'manualDrawing',
    meta: {
      title: 'Manual Drawing',
      icon: require('@/assets/icon/handler.png')
    },
    component: () => import('@/views/example/manualDrawing')
  },
  {
    path: 'graphEditor',
    name: 'graphEditor',
    meta: {
      title: 'Graph Editor',
      icon: require('@/assets/icon/editor.png')
    },
    component: () => import('@/views/example/graphEditor')
  },
  {
    path: 'groupEditor',
    name: 'groupEditor',
    meta: {
      title: 'Group Editor',
      icon: require('@/assets/icon/group.png')
    },
    component: () => import('@/views/example/groupEditor')
  }*/
  ,
  
  {
    path: 'fmWeb',
    name: 'fmWeb',
    meta: {
      title: 'FMWeb',
      icon: require('@/assets/icon/group.png')
    },
    component: () => import('@/views/example/fmWeb')
  }
]

export const globalRouter = [
  {
    path: '/',
    name: 'home',
    redirect: '/welcome',
    component: () => import('@/views/layout'),
    children: [
      ...demoRouter
    ]
  },
]

export default new Router({
  routes: [...globalRouter]
})
