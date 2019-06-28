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
