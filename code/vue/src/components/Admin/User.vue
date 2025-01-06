<script setup>
import { useUserStore } from '@/stores/user';
import { inject } from 'vue';

const storeUser = useUserStore();

const props = defineProps({
  user: Object,
  readonly: Boolean,
});

const alertDialog = inject('alertDialog');

const deleteConfirmed = () => {
  storeUser.deleteUser(props.user);
};

const deleteUser = () => {
  alertDialog.value.open(
    deleteConfirmed,
    'Are you sure?',
    'Cancel',
    `Yes, delete user @${props.user.nickname}`,
    `This action cannot be undone. This will permanently delete the user ${props.user.nickname}.`
  );
};
</script>

<template>
  <div :class="{ 'bg-gray-200': readonly }">
    <div class="flex ps-2 pe-1">
      <div class="flex flex-col grow">
        <div class="text-base pe-4 grow leading-10 flex space-x-2">
          <span class="w-12">{{user.nickname}}</span>
          <span class="text-gray-700">{{ user.type }}</span>
        </div>
      </div>

      <div class="py-1 flex items-center min-w-[6.75rem]">
        <!-- Block/unblock button -->
        <button type="button" class="inline-block rounded bg-blue-500 p-2 m-0.5 text-white"
            @click="storeUser.toggleUserBlockedStatus(user)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 2a2 2 0 012-2h8a2 2 0 012 2v2m-10-4V8a4 4 0 118 0v4" />
            </svg>
        </button>
        <!-- Promote to admin/player button -->
        <button type="button" class="inline-block rounded bg-green-500 p-2 m-0.5 text-white"
            @click="storeUser.toggleUserRole(user)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14c3.866 0 7 1.343 7 3v2H5v-2c0-1.657 3.134-3 7-3zM12 12a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
        </button>
        <!-- Delete button -->
        <button type="button" class="inline-block rounded bg-red-500 p-2 m-0.5 text-white"
            @click="storeUser.deleteUser(user)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
        </button>
      </div>
    </div>
  </div>
</template>
