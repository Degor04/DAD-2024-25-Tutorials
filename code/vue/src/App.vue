<template>
  <Toaster />
  <div id="app">
    <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
    <NavBar>
    </NavBar>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted, useTemplateRef, provide } from 'vue'
import NavBar from './components/common/NavBar.vue';
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useAuthStore } from './stores/auth';
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'


const storeAuth = useAuthStore()

const logoutConfirmed = () => {
    storeAuth.logout()
}

const logout = () => {
  alertDialog.value.open(logoutConfirmed, 'Logout confirmation?', 'Cancel', `Yes, I want to log out`,
    `Are you sure you want to log out? You can still access your account later with your credentials.`)
}


const alertDialog = useTemplateRef('alert-dialog')
provide('alertDialog', alertDialog)

</script>