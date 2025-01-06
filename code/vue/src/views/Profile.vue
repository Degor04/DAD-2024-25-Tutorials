<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios'; // Certifique-se de ter o axios configurado
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { onMounted } from 'vue';

const router = useRouter();
const storeAuth = useAuthStore();


const user = ref({
  username: storeAuth.usernickName,
  name: storeAuth.userName,
  email: storeAuth.userEmail,
  type: storeAuth.userType,
  currentPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
});

const updatedPhoto = ref(null);

const saveProfile = async () => {
  try {
    const response = await axios.patch('/user/update-username', {
      nickname: user.value.username,
      name: user.value.name,
      email: user.value.email,
    });

    if (response.status === 200) {
      storeAuth.$patch({
        usernickName: user.value.username,
        userName: user.value.name,
        userEmail: user.value.email,
      });

      console.log('Perfil atualizado com sucesso!');
    } else {
      console.log('Erro ao atualizar o perfil.');
      return;
    }

    if (user.value.newPassword || user.value.newPasswordConfirmation) {
      if (user.value.newPassword !== user.value.newPasswordConfirmation) {
        console.log('As senhas não correspondem!');
        return;
      }

      if (!user.value.currentPassword) {
        console.log('Por favor, insira sua senha atual.');
        return;
      }

      const passwordResponse = await axios.post('/user/update-password', {
        current_password: user.value.currentPassword,
        new_password: user.value.newPassword,
        new_password_confirmation: user.value.newPasswordConfirmation,
      });

      if (passwordResponse.status === 200) {
        console.log('Senha atualizada com sucesso!');
      } else {
        console.log('Erro ao atualizar a senha.');
        return;
      }
    }

    if (updatedPhoto.value) {
      const formData = new FormData();
      formData.append('photo_file', updatedPhoto.value);

      const photoResponse = await axios.post('/api/user/update-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (photoResponse.status === 200) {
        console.log('Foto atualizada com sucesso!');
      } else {
        console.log('Erro ao atualizar a foto.');
        return;
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      const validationErrors = error.response.data.errors;
      console.log('Erro de validação: ' + JSON.stringify(validationErrors));
    } else if (error.response) {
      console.log(`Erro (${error.response.status}): ${error.response.data.message || 'Tente novamente mais tarde.'}`);
    } else {
      console.error('Erro ao atualizar perfil:', error);
      console.log('Erro ao salvar as alterações. Tente novamente.');
    }
  }
};

const cancelEdit = () => {
  router.push('/');
};

const deleteAccount = async () => {
    const confirmed = confirm('Você tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.');

    if (!confirmed) {
        return;
    }

    try {
        const response = await axios.delete('/user/delete-account'); // Use DELETE para excluir a conta

        if (response.status === 200) {
          storeAuth.user = null; // Reseta o estado do usuário na store (desloga o usuário)
          console.log('Conta deletada com sucesso!');
            router.push('/'); // Página principal após a exclusão da conta
        } else {
          console.log('Erro ao excluir a conta.');
        }
    } catch (error) {
        console.error('Erro ao excluir conta:', error);
        console.log('Ocorreu um erro ao tentar excluir sua conta. Tente novamente mais tarde.');
    }
};

const goToAdmin = () => {
  router.push('/users'); 
};


</script>


<template>
  <div class="flex items-center justify-center">
    <Card class="w-[800px] my-8 p-6">
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Visualize e atualize os dados do seu perfil.</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col space-y-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="username">Username</Label>
            <Input
              id="username"
              type="text"
              v-model="user.username"
              placeholder="Digite seu username"
              class="w-full"
            />
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Nome</Label>
            <Input
              id="name"
              type="text"
              v-model="user.name"
              placeholder="Digite seu nome"
              class="w-full"
            />
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              v-model="user.email"
              placeholder="Digite seu email"
              class="w-full"
            />
          </div>
          <div class="flex flex-col space-y-1.5 mt-4">
            <Label for="current-password">Senha Atual</Label>
            <Input
              id="current-password"
              type="password"
              v-model="user.currentPassword"
              placeholder="Digite sua senha atual"
              class="w-full"
            />
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="new-password">Nova Senha</Label>
            <Input
              id="new-password"
              type="password"
              v-model="user.newPassword"
              placeholder="Digite sua nova senha"
              class="w-full"
            />
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="confirm-password">Confirmar Nova Senha</Label>
            <Input
              id="confirm-password"
              type="password"
              v-model="user.newPasswordConfirmation"
              placeholder="Confirme sua nova senha"
              class="w-full"
            />
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="photo">Foto de Perfil</Label>
            <div class="flex items-center space-x-4">
              <img
                :src="storeAuth.userPhotoUrl"
                alt="User Photo"
                class="w-16 h-16 rounded-full"
              />
              <input
                id="photo"
                type="file"
                @change="(e) => (updatedPhoto.value = e.target.files[0])"
                accept="image/*"
                class="w-full"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button variant="outline" @click="cancelEdit">Cancel</Button>
        <Button v-if="user.type === 'P'" @click="deleteAccount" class="bg-red-500 text-white border-red-500 hover:bg-red-700 hover:text-white">
          Delete Account
        </Button>
        <Button v-if="user.type === 'A'" variant="secondary" @click="goToAdmin">
          Administracion
        </Button>
        <Button @click="saveProfile">Save</Button>
      </CardFooter>
    </Card>
  </div>
</template>
