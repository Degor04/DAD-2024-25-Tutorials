<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter();
const storeAuth = useAuthStore();

const name = ref('');
const nickname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const showNameWarning = ref(false);
const showNicknameWarning = ref(false);
const showEmailWarning = ref(false);
const showPasswordWarning = ref(false);
const showConfirmPasswordWarning = ref(false);

const backendErrors = ref([]);

const submitRegister = async () => {
  showNameWarning.value = !name.value;
  showNicknameWarning.value = !nickname.value;
  showEmailWarning.value = !email.value;
  showPasswordWarning.value = password.value.length < 3;
  showConfirmPasswordWarning.value = password.value !== confirmPassword.value;

  if (
    !name.value ||
    !nickname.value ||
    !email.value ||
    showPasswordWarning.value ||
    showConfirmPasswordWarning.value
  ) {
    return;
  }

  backendErrors.value = [];

  try {
    console.log("Aqui")
    await storeAuth.register({
      name: name.value,
      nickname: nickname.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
    });
  
    router.push({ name: 'Homepage' });
  } catch (error) {
    const errors = error.response?.data?.errors || {};
    for (const field in errors) {
      backendErrors.value.push(...errors[field]);
    }
  }
};






</script>


<template>
  <Card class="w-[450px] mx-auto my-8 p-4 px-8">
    <CardHeader>
      <CardTitle>Register Account</CardTitle>
      <CardDescription>Create your account, so you can play multiplayer games!</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="register-form">
        <form @submit.prevent="submitRegister">
          <div class="form-group">
            <Label for="name">Name</Label>
            <Input type="text" id="name" v-model="name" placeholder="Enter your name" required />
            <p v-if="showNameWarning" class="text-red-500 text-sm mt-1">Name is required.</p>
          </div>
          <div class="form-group mt-4">
            <Label for="nickname">Nickname</Label>
            <Input type="text" id="nickname" v-model="nickname" placeholder="Create a nickname" required />
            <p v-if="showNicknameWarning" class="text-red-500 text-sm mt-1">Nickname is required.</p>
          </div>
          <div class="form-group mt-4">
            <Label for="email">E-mail</Label>
            <Input type="email" id="email" v-model="email" placeholder="Enter your e-mail" required />
            <p v-if="showEmailWarning" class="text-red-500 text-sm mt-1">Email is required.</p>
          </div>
          <div class="form-group mt-4">
            <Label for="password">Password</Label>
            <Input type="password" id="password" v-model="password" placeholder="Create a password" required />
            <p v-if="showPasswordWarning" class="text-red-500 text-sm mt-1">Password must be at least 3 characters long.
            </p>
          </div>
          <div class="form-group mt-4">
            <Label for="confirm-password">Confirm password</Label>
            <Input type="password" id="confirm-password" v-model="confirmPassword" placeholder="Confirm your password"
              required />
            <p v-if="showConfirmPasswordWarning" class="text-red-500 text-sm mt-1">Passwords do not match.</p>
          </div>

          <!-- Exibe mensagens de erro do backend -->
          <div v-if="backendErrors.length" class="mt-4 text-red-500 text-sm">
            <ul>
              <li v-for="(error, index) in backendErrors" :key="index">{{ error }}</li>
            </ul>
          </div>

          <Button type="submit" class="mt-6">Create</Button>
        </form>
      </div>
    </CardContent>
  </Card>
</template>
