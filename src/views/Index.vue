<template>
  <div class="container h-100">
    <Title/>
    <div class="row justify-content-center">
      <div class="col col-md-6 p-5">
        <MainContent />
      </div>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import MainContent from '@/components/MainContent'

export default {
  name: 'index',
  components: {
    Title,
    MainContent
  }
}
</script>

<style>
body, html {
  height: 100%;
}
</style>