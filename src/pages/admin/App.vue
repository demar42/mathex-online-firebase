<template>
  <div class="container h-100">
    <Title />
    <div class="row justify-content-center">
      <div class="col col-md-6 p-5">
        admin stuff
      </div>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'

export default {
  name: 'admin',
  components: {
    Title
  }
}
</script>

<style>
body, html {
  height: 100%;
  overflow: hidden;
}
</style>