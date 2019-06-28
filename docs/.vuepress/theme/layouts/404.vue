<template>
  <LayoutWrapper>
    <div class="not-found">
      <div>
        <h1>Page Not Found :(</h1>
        <div class="backhome">
          <router-link to="/">Bring me Home</router-link>
        </div>
      </div>

      <div class="recommend">
        <h2>Recommend Contents</h2>
        <ul class="card-contents">
          <li v-for="content in recommendContents" class="card-content">
            <router-link :to=content.path>
              <div class="content-thumbnail" :style="{ backgroundImage : `url(${content.frontmatter.thumbnail})`}">
              </div>
              <div class="content-cover">
                <div class="content-category">{{content.frontmatter.category}}</div>
                <h3 class="content-title">{{content.frontmatter.title}}</h3>
                <p class="content-subtitle">{{content.frontmatter.subtitle}}</p>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </LayoutWrapper>
</template>
<script>
  export default {
    computed: {
      recommendContents() {
        return this.$site.pages
          .filter(x => x.path.startsWith("/posts/") && !x.frontmatter.blog_index)
          .sort(
            (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
          ).slice(0, 3)
      }
    }
  }
</script>
<style>
  @import "../styles/index.css";
</style>
<style scoped>
  .not-found {
    max-width: 1080px;
    width: 100%;
    padding: 10px;
    margin: 0 auto;
  }

  .not-found h1 {
    font-size: 3rem;
  }

  .backhome a {
    background: #007fff;
    color: #fff;
    text-decoration: none;
    padding: 9px 15px;
    border-radius: 5px;
  }

  .recommend {
    margin-top: 80px;
  }

  .recommend .card-contents {
    display: flex;
    justify-content: space-between;
  }

  .card-contents .card-content {
    max-width: 280px;
    width: 100%;
    list-style: none;
    box-shadow: 0 2px 3px rgba(0, 10, 18, .1), 0 0 0 1px rgba(0, 10, 18, .1);
    margin: 0 10px;
  }

  .card-content a {
    text-decoration: none;
  }

  .card-content .content-thumbnail {
    width: 100%;
    min-height: 170px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .card-content .content-cover {
    padding: 10px 15px;
  }

  .card-content .content-category {
    font-size: 14px;
  }

  .card-content .content-title {
    font-size: 1.5rem;
    margin: 0.5rem 0 1.5rem;
  }

  .card-content .content-subtitle {
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    width: 100%;
    overflow: hidden;
  }
</style>