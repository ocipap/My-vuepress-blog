<template>
  <ul class="posts-content">
    <li v-for="post in posts" class="post-list">
      <router-link :to="post.path">
        <div class="post-category">{{post.frontmatter.category}}</div>
        <div class="post-title">{{post.frontmatter.title}}</div>
        <p class="post-subtitle">{{post.frontmatter.subtitle}}</p>
      </router-link>
    </li>
  </ul>
</template>

<script>
  export default {
    computed: {
      posts() {
        return this.$site.pages
          .filter(x => x.path.startsWith("/posts/") && !x.frontmatter.blog_index)
          .sort(
            (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
          );
      }
    }
  }
</script>

<style>
  .posts-content {
    max-width: 1080px;
    width: 100%;
    margin: auto;
  }

  .post-list {
    list-style: none;
    padding: 30px 10px;
  }

  .post-list a {
    text-decoration: none;
  }

  .post-list a>* {
    margin: 10px 0px;
  }

  .post-list .post-category {
    color: #525252;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .post-list .post-title {
    font-weight: bold;
    font-size: 2.5rem;
  }

  .post-list .post-subtitle {
    color: #111;
    font-size: 1.4rem;
  }
</style>