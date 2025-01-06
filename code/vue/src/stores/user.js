import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'

export const useUserStore = defineStore('user', () => {
    const storeError = useErrorStore()
    const users = ref([])
    const filterByBlocked = ref(null)
    const filterByType = ref(null)

    const totalUsers = computed(() => {
        return users.value ? users.value.length : 0
    })

    const totalFilteredUsers = computed(() => {
        return filteredUsers.value ? filteredUsers.value.length : 0
    })

    const userInFilter = (user) => {
        if (filterByBlocked.value) {
            if (filterByBlocked.value.blocked != user.blocked) {
                return false
            }
        }
        if (filterByType.value) {
            if (filterByType.value.type !== user.type) {
                return false
            }
        }
        return true
    }

    const filteredUsers = computed(() => users.value.filter(userInFilter))

    const filterDescription = computed(() => {
        if (!filterByBlocked.value && !filterByType.value) {
            return 'All users'
        }
        let description = ''
        if (filterByBlocked.value) {
            description += filterByBlocked.value.filterDescription
        }
        if (filterByType.value) {
            description += filterByType.value.filterDescription
        }
        return description
    })

    const fetchUsers = async () => {
        storeError.resetMessages()
        const response = await axios.get('users')
        users.value = response.data
    }

    const getIndexOfUser = (userId) => {
        return users.value.findIndex((p) => p.id === userId)
    }

    const fetchUser = async (userId) => {
        storeError.resetMessages()
        const response = await axios.get('users/' + userId)
        const index = getIndexOfUser(userId)
        if (index > -1) {
            users.value[index] = Object.assign({}, response.data.data)
        }
        return response.data.data
    }

    const insertUser = async (user) => {
        storeError.resetMessages()
        try {
            const response = await axios.post('users', user)
            users.value.push(response.data.data)
            return response.data.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data, e.response.status, 'Error inserting user!')
            return false
        }
    }

    const updateUser = async (user) => {
        storeError.resetMessages()
        try {
            const response = await axios.put(`users/${user.id}`, user)
            const index = getIndexOfUser(user.id)
            if (index > -1) {
                users.value[index] = Object.assign({}, response.data.data)
            }
            return response.data.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data, e.response.status, 'Error updating user!')
            return false
        }
    }

    const deleteUser = async (user) => {
        storeError.resetMessages();
        try {
            await axios.delete(`users/${user.id}`);

            const index = getIndexOfUser(user.id);
            if (index > -1) {
                users.value.splice(index, 1);
            }
            return true;
        } catch (e) {
            storeError.setErrorMessages(
                e.response.data,
                e.response.status,
                'Error deleting user!'
            );
            return false;
        }
    };


    const toggleUserRole = async (user) => {
        storeError.resetMessages();
        try {
            const updatedUser = { ...user, type: user.type === 'P' ? 'A' : 'P' };
            const response = await axios.put(`users/${user.id}/role`, updatedUser);
            const index = getIndexOfUser(user.id);
            if (index > -1) {
                users.value[index] = Object.assign({}, response.data.data);
            }
            return response.data.data;
        } catch (e) {
            storeError.setErrorMessages(e.response.data, e.response.status, 'Error toggling user role!');
            return false;
        }
    };

    const toggleUserBlockedStatus = async (user) => {
        storeError.resetMessages();
        try {
            const updatedUser = { ...user, blocked: user.blocked === 0 ? 1 : 0 };
            const response = await axios.put(`users/${user.id}/blocked`, updatedUser);
            const index = getIndexOfUser(user.id);
            if (index > -1) {
                users.value[index] = Object.assign({}, response.data.data);
            }
            return response.data.data;
        } catch (e) {
            storeError.setErrorMessages(e.response.data, e.response.status, 'Error toggling user blocked status!');
            return false;
        }
    };

    return {
        users, totalUsers, totalFilteredUsers, filteredUsers,
        filterDescription, filterByBlocked, filterByType,
        fetchUsers, fetchUser, insertUser, updateUser, deleteUser,
        toggleUserRole, toggleUserBlockedStatus
    }
})
