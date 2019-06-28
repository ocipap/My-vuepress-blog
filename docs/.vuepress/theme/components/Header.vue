<template>
  <header id="header">
    <h1 class="header-name">
      <router-link to="/">
        {{ $themeConfig.headerTitle || $siteTitle }}
      </router-link>
    </h1>
    <div class="header-right">
      <ul class="nav" v-if="$themeConfig.nav">
        <li class="nav-item" v-for="item in $themeConfig.nav">
          <router-link :to="item.link">{{ item.text }}</router-link>
        </li>
      </ul>
      <div class="search-wrapper">
        <SearchBox/>
      </div>
    </div>
  </header>
</template>
<script>
  import SearchBox from '@SearchBox'

  export default {
    components: {
      SearchBox
    }
  }
</script>
<style scoped>
  #header {
    display: flex;
    padding: 0 30px;
  }

  #header .header-name a {
    text-decoration: none;

  }

  #header .header-right {
    margin-left: auto;
    display: flex;
    align-items: center
  }

  .nav {
    margin-right: 10px;
  }

  .nav .nav-item {
    display: inline-block;
    margin: 0 15px;
  }

  .nav .nav-item a {
    text-decoration: none;
  }
</style>