<template>
  <footer id="footer">
    <div class="inner">
      <div id="owner">Copyright 2019. PAPICO</div>
      <div id="power">Powered by VuePress</div>
    </div>
  </footer>
</template>
<style scoped>
#footer {
  display: flex;
  margin-top: auto;
  color: #b3b3b3;
  justify-content: center;
  align-items: center;
}

#footer .inner {
  display: flex;
  padding: 30px 0px;
}

#footer .inner > * {
  margin: 0px 10px;
}

</style>