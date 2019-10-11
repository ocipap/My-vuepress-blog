<template>
  <div class="post-content">
    <h1 class="post-title">{{this.$frontmatter.title}}</h1>
    <p class="post-subtitle">{{this.$frontmatter.subtitle}}</p>
    <Content />
    <Disqus/>
  </div>
</template>

<style scoped>
  .post-content {
    max-width: 1080px;
    width: 100%;
    margin: auto;
    padding: 0 15px;
  }

  .post-content .post-title {
    font-size: 2.3rem;
    line-height: 4rem;
    margin-bottom: 1rem;
  }

  .post-content .post-subtitle {
    font-size: 1.5rem;
    font-weight: bold;
    color: #525252;
    margin: 0;
    margin-left: 5px;
  }

  
</style>
