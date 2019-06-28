---
type: PostLayout
title: vuepress 이용해 블로그를 만들자
subtitle: 조금만 해볼려고 했는데 일주일 걸린 블로그 만들기
category: Vue
thumbnail: /190627/create_vuepress_blog.png
meta:
  - name: description
    content: vuepress 이용해 블로그를 만들자
date: 2019-06-27
---



나는 git 블로그에 대해서 별로 안 좋은 시선을 가지고 있었다. 뭔가 다른 사람이 만들어 놓은 템플릿을 고치고 수정하면서 일주일씩 고생하고 나서 막상 올려보면 관리도 안되고 결국 다시 tistory 로 돌아가는 나의 모습을 너무 잘 알기 때문일지도 모른다. 우연히 알게된 `vuepress` 로 인해 또 다시 그 일을 반복하나 했지만 하면서 오기가 생겨서 여차저차 블로그를 만들었다. 지금부터 `vuepress` 를 이용해 블로그를 만든 과정에 대해 설명해보겠다.



## vuepress ?

`vue` 기반 **정적 사이트 생성기**이다. 이미 `jekyll` ,`hexo`, `gatsby` 등 여러 프레임워크나 라이브러리에서 정적 사이트를 생성하는 여러 방법을 제공하고 있다. `vuepress` 는 기본적으로 테마를 지원해주고 `Google Analytics` , `toc` 등 여러 유용한 플러그인드도 지원하고 있어 기술문서를 작성하기 용이하다.

`vuepress` 를 기본 설정 방식이나 사용방법은 공식 문서나 타 블로그에서 잘 정리되어 있으므로 이번 포스팅에서는 블로그를 만들면서 삽질을 했던 경험에 대해 이야기해보겠다.

간단히 블로그를 만들때 사용했던 플러그인만 소개하겠다.

```json
"devDependencies": {
  "@vuepress/markdown": "^1.0.2",
  "@vuepress/markdown-loader": "^1.0.2",
  "@vuepress/plugin-active-header-links": "^1.0.0-rc.1",
  "@vuepress/plugin-back-to-top": "^1.0.0-rc.1",
  "@vuepress/plugin-blog": "^1.2.3",
  "@vuepress/plugin-pagination": "^1.0.0-alpha.0",
  "@vuepress/plugin-search": "^1.0.2",
  "vuepress": "^1.0.2"
}
```



## 구현할 기능들

기존 테마도 이쁘지만 좀 더 이쁘게 블로그를 만들고 싶어서 아예 `theme`를 새로 만들었다. 공식문서에서는 custom theme  만드는 방법을 기존 테마를 `eject` 해서 고쳐서 만들라고 명시되어 있다. 그래서 여러 블로그를 뒤져가면서 어떻게 하면 커스텀 테마를 만들수 있는지 찾아보았다. 그런데 각각의 블로그마다 만드는 방법이 다르고 계속 버젼이 바뀌면서 지원하지 않는 기능들도 꽤 있었다. 그래서 일단 내가 블로그를 운영하는데 필수적으로 필요한 기능이 무엇인지 나열해보았다.  

- main 화면은 post 리스트가 역시간 순으로
- post는 가능한 이쁘게 code 는 codehight가 적용되게
- 옆에 따라다니는 목차를 만들어 쉽게 본문 내용에 쉽게 접근할 수 있도록
- category 별로 리스팅
- Google Analytics
- 댓글 기능
- 404 페이지

그래서 각각의 기능을 구현하기 위한 방법을 찾아보았다.



## 각각의 컴포넌트 핸들링

일단 각각의 컴포넌트들을 분리했다.

```bash
$ tree ./docs/.vuepress/theme/components 
./docs/.vuepress/theme/components
├── Disqus.vue // 댓글
├── Footer.vue // 푸터
├── Header.vue // 헤더
├── LayoutWrapper.vue // 헤더와 푸터를 포함해 중복 제거
├── PostLayout.vue // 글 
└── PostsLayout.vue // 글 목록
```

```bash
$ tree ./docs/.vuepress/theme/layouts 
./docs/.vuepress/theme/layouts
├── 404.vue // 404 레이아웃
└── Layout.vue // 본문 레이아웃
```



그리고 각각의 페이지를 `Layout.vue` 에서 `frontmatter` 값을 이용하여 각각의 컴포넌트들을 바인딩했다.

```vue
# docs/.vuepress/theme/layout/Layout.vue

<template>
  <LayoutWrapper>
    <div class="main">
      <component :is="$page.frontmatter.type"></component>
    </div>
  </LayoutWrapper>
</template>
<style>
  @import "../styles/index.css";
</style>
```



그리고 각각의 `frontmatter` 에 `type: 컴포넌트 이름` 을 넣는다. 

```markdown
---
type: PostLayout
title: vuepress 이용해 블로그를 만들자
subtitle: 조금만 해볼려고 했는데 일주일 걸린 블로그 만들기
category: Vue
thumbnail: /190627/create_vuepress_blog.png
date: 2019-06-27
---
```



## Code highlighting

기본적으로 `vuepress` 에서 지원해주는 markdown 플러그인을 통해  `line number` 기능등 여러가지를 사용할 수 있다. 

```js
# docs/.vuepress/config.js

module.exports = {
  ~~~
   markdown: {
    lineNumbers: true,
    toc: { includeLevel: [ 2 ] },
  }
}
```



그리고 코드 하이라이팅은 `prism.css` 를 가져다가 커스터마이징하여 사용하였다.



## 댓글 기능

[https://62che.com/blog/vuepress/%EB%8C%93%EA%B8%80-%EC%8B%9C%EC%8A%A4%ED%85%9C-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0.html](https://62che.com/blog/vuepress/댓글-시스템-연동하기.html) 

위 링크를 참고하여 Disqus 컴포넌트를 만들었고, 해당 컴포넌트를 PostLayout 하단부에 삽입하였다.



## 404 페이지

`vuepress` 에서 기본적으로 404 에러가 발생했을 경우, layout 디렉토리 밑에있는 `404.vue` 컴포넌트를 바인딩 시켜준다. 그래서 404 페이지에서 최신글 3개가 보이는 로직을 작성하여 사용자가 올바른 url 로 다시 돌아오도록 유도했다.

```vue
# docs/.vuepress/theme/layout/404.vue

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
```



## 삽질

- 우선 코드 하이라이팅에서 `line-number` 기능이 제대로 동작하지 않았다. 이유를 알아보니 별도로 설치한 `prismjs` 모듈 때문에 기존 `vuepress` 내장 모듈 설정을 덮어써졌다.

- 컨텐츠 옆에 있는 Table of contents 를 어떻게 구현해야 하는지 감이 오지 않았다. 그러던 중 기본 내장 모듈중에 `plugin-active-header-links` 를 알게되었고 다음 버젼에 추가할 예정이다.
- `category` 능과 `tag` 기능도 다음 포스팅때 기능을 추가시킬 예정이다.



## 마무리

아직 블로그의 전체적인 기능을 구현을 못했지만 기능을 하나씩 개발해가는 재미가 쏠쏠한 것 같다. 앞으로 내가 개발하면서 일어났던 기억에 남는 일들을 잘 정리해 하나씩 포스팅해나가겠다.

마지막으로 github 레포 링크이다. 