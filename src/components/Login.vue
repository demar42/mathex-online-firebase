<template>
    <div>
        <template v-if="!pin_provided">
            <input type="text" class="form-control" placeholder="Enter the Game PIN" 
                v-on:keyup.enter="submitPIN" v-model="pin"/>
            <small>The game PIN will be provided by the teacher</small>
        </template>
        <template v-if="pin_provided">
            <input type="text" class="form-control" placeholder="Enter your username" />
        </template>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data: function() {
        return {
            pin_provided: false,
            pin: null
        }
    },
    methods: {
        submitPIN: function() {
            alert(this.pin)
        }
    }
}
</script>
