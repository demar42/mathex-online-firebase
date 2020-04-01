<template>
    <div class="btn-group">
        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Action
        </button>
        <div class="dropdown-menu">
            <a v-for="action in this.actions" :key="action[0]" class="dropdown-item" @click="action[1]">{{action[0]}}</a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'dropdown',
    props: ['actions']
}
</script>