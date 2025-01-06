<template>
    <div>
        <form @submit.prevent="loginUser">
            <label>Email:</label>
            <input v-model="email" type="email" required />
            <label>Password:</label>
            <input v-model="password" type="password" required />
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
import { login } from '../services/auth';

export default {
    data() {
        return {
            email: '',
            password: '',
        };
    },
    methods: {
        async loginUser() {
            try {
                const user = await login(this.email, this.password);
                this.$router.push({ name: '/' });
            } catch (error) {
                alert('Login falhou');
            }
        },
    },
};
</script>
