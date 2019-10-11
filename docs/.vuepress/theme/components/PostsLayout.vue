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
    padding: 0 30px;
  }

  .post-list {
    list-style: none;
    padding: 30px 0;
  }

  .post-list + .post-list {
    border-top: solid 1px #ddd;
  }

  .post-list a {
    text-decoration: none;
  }

  .post-list a>* {
    margin: 10px 0px;
  }

  .post-list .post-category {
    font-size: 15.75px;
    color: #262626;
  }

  .post-list .post-title {
    font-weight: bold;
    font-size: 2rem;
    line-height: 1.5;
    color: #212121;
  }

  .post-list .post-subtitle {
    font-size: 0.9rem;
    color: #424242;
  }
</style>
