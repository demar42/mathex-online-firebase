<template>
  <div class="container h-100">
    <Title/>
    <div class="row justify-content-center">
      <div class="col col-md-6 p-5">
        <Login v-on:data="arg => {$cookie.set('gameinfo', JSON.stringify(arg)); $router.push('/game')}"/>
      </div>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import Login from '@/components/Login'

export default {
  name: 'index',
  components: {
    Title,
    Login
  }
}
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
}
</style>