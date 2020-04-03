<template>
    <div class="container mb-2 p-2 border-bottom">
        <div class="row align-items-end">
            <div class="col-auto">
                <span class="mb-0 display-4">Mathex Online</span>
            </div>
            <div class="col-auto mb-2 mr-auto">
                <span class="text-muted">A web-app by Daniel Mar</span>
            </div>
            <div class="col-auto mb-2">
                <router-link class="card-link" v-if="link" :to='link'>{{linkText}}</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['link', 'link-text'],
    name: 'Title'
}
</script>