<template>
  <div class="welcomeContainer">
    <h1>Welcome to the FMweb homepage</h1>
    <h3>
      This is a prototype for a correct syntax feature modeling tool.
    </h3>
    <h4>
      It works on vue.js and the drawing library mxGraph.
    </h4>
    <h4>
      If you want to try working with it go to the sidebar and click on the second element that will have the name pop-up FMweb.
    </h4>
    <h5>There is a <a href="/Template.xml" download>template</a> file that you can download by clicking on the link to get you started, just import it when you want to use it</h5>
    <h4>
      More Information:
    </h4>
    <ul>
      <li>This project is based on the tool <a href="http://estocolmo.ceisufro.cl/">FMxx</a> and follows the same rules.</li>
      <li>Funded by the project DI20-0060 from the <a href="https://www.ufro.cl/">Universidad de La Frontera</a></li>
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
