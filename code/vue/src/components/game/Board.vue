<script setup>
import Cell from './Cell.vue'
import {ref} from 'vue'

const path = "/cards/";
const file_type = ".png";
const hidden_card = path + `semFace` + file_type;

const gridCols= ref(['grid-cols-3', 'grid-cols-4', 'grid-cols-6']) 

const props = defineProps({
    board: {
        type: Array,
        required: true
    },
    showCard: {
        type: Array,
        required: true
    },
    columns: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['play'])

const playPieceOfBoard = (idx) => {
    emit('play', idx)
}


</script>

<template>
    <div :class="['grid', 'grid-cols-' + columns, 'border', 'divide-y', 'divide-x']">
        <Cell v-for="(card, idx) in board" :key="idx" 
                :card="showCard[idx] ? card : hidden_card" :index="idx" 
                @play="playPieceOfBoard">
        </Cell>
    </div>
</template>
