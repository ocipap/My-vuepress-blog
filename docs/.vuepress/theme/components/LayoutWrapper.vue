<template>
  <div class="wrapper">
    <Header/>
    <slot/>
    <Footer/>
  </div>
</template>

<script>
  import Header from '@theme/components/Header'
  import Footer from '@theme/components/Footer'
  export default {
    components: { Header, Footer }
  }
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 980px;
  margin-right: auto;
  margin-left: auto;
}
</style>
