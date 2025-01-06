<template>
  <div class="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
    <p class="text-sm text-gray-500">NickName: {{ nickname.user_nickname }}</p>
    <p class="mt-1 text-sm text-gray-500">Number of turns played: {{ nickname.total_turns_winner }}</p>
  </div>
</template>

<script setup>
defineProps({
  nickname: {
    type: Object,
    },
});
</script>
