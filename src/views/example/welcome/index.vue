<template>
  <div class="welcomeContainer">
    <h1>Welcome to the FMweb homepage</h1>
    <h3>
      This is a prototype for a correct synthax feature modeling tool
    </h3>
    <h4>
      It works on vue.js and the drawing library mxgraph
    </h4>
    <h4>
      If you want to try working with it go to the sidebar and click on the second element that will have the name pop-up FMweb
    </h4>
    <h5>This is a template file that you can download by clicking on the linl to get you started <a href="/Template.xml" download>download</a>, just import it when you want to use it</h5>
    <h4>
      More Information:
    </h4>
    <ul>
      <li>Lorem Ipsum</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  publicPath: process.env.BASE_URL,
}
</script>

<style lang="scss">
.welcomeContainer {
  width: 100%;
  height: 100%;
}
</style>
