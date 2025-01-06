<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from './UserForm.vue'
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/error'

const storeAuth = useAuthStore()
const storeError = useErrorStore()

const router = useRouter()

const user = ref(null)

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
})

watch(
    () => props.id,
    async (newId) => {
        try {
            const fetchedUser = await storeAuth.fetchUser(newId);

            user.value = {
                ...fetchedUser,
                blocked: fetchedUser.blocked,
                type: fetchedUser.type
            };
        } catch (error) {
            storeError.setErrorMessages(
                error.response?.data?.message || 'Error fetching user data',
                error.response?.data?.errors || [],
                error.response?.status || 500,
                'Error loading user!'
            );
        }
    },
    { immediate: true }
);



const updateBlockedStatus = async (userId, isBlocked) => {
    try {
        const updatedUser = await storeAuth.updateUser(userId, { blocked: isBlocked })
        user.value = updatedUser
        console.log(`Blocked status updated to ${isBlocked}`)
    } catch (error) {
        storeError.setErrorMessages(
            error.response?.data?.message || 'Error updating blocked status',
            error.response?.data?.errors || [],
            error.response?.status || 500,
            'Error updating blocked status!'
        )
    }
}

const toggleUserType = async (userId, currentType) => {
    const newType = currentType === 'A' ? 'P' : 'A'
    try {
        const updatedUser = await storeAuth.updateUser(userId, { type: newType })
        user.value = updatedUser
        console.log(`User type updated to ${newType}`)
    } catch (error) {
        storeError.setErrorMessages(
            error.response?.data?.message || 'Error updating user type',
            error.response?.data?.errors || [],
            error.response?.status || 500,
            'Error updating user type!'
        )
    }
}

const save = async (task) => {
    if (await storeTask.updateTask(task)) {
        router.push({ name: 'tasks' })
    }
}

const cancel = () => {
    storeError.resetMessages()
    router.back()
}
</script>

<template>
    <UserForm v-if="user" :user="user" :title="`Update User @${ user.nickname }`" @save="save" @cancel="cancel"></UserForm>

    <div v-if="user" class="actions">
        <button @click="updateBlockedStatus(user.id, !user.blocked)">
            {{ user.blocked ? 'Unblock User' : 'Block User' }}
        </button>

        <button @click="toggleUserType(user.id, user.type)">
            Change to {{ user.type === 'A' ? 'Player' : 'Admin' }}
        </button>
    </div>
</template>
