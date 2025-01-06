<script setup>
const props = defineProps(['card', 'index'])
const emit = defineEmits(['play'])

const play = () => {
    emit('play', props.index)
}
</script>

<template>
    <div>
        <img :src="card" alt="Tictactoe piece" class="h-20 w-20"
            @click.prevent="play">
    </div>
</template>