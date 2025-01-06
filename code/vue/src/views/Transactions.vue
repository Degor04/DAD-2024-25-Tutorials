<script setup>
import { inject } from 'vue'
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios'
import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import { User } from 'lucide-vue-next';
import GameCard from '../components/GameHistory/GameCard.vue';
import ScoreBoardCard from '../components/ScoreBoard/ScoreBoardCard.vue';

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

const router = useRouter()
const storeAuth = useAuthStore()
const storeError = useErrorStore()

const credentials = ref({
  user_id: storeAuth.id,
  game_id: null,
  type: 'P',
  euros: '',
  payment_reference: '',
  payment_type: '',
  transaction_datetime: '',
  brain_coins: '',
})

var numberValid = ref(false)

function isEurosInteger(amount) {
  // !isNaN(value) retorna true se for um numero 

  var eurosAmount = Number(amount)
  if (Number.isInteger(eurosAmount) && !isNaN(Number(amount)) && eurosAmount > 0 && eurosAmount < 100) {
    numberValid.value = true

  }

  else {
    numberValid.value = false
  }
  return numberValid
}

const cancel = () => {
  router.back()
}

const payment = ref(null)
const paymentTypeList = ref([
  { code: 'P', description: 'PAYPAL' },
  { code: 'W', description: 'MBWAY' },
  { code: 'I', description: 'IBAN' },
  { code: 'M', description: 'MB' },
  { code: 'V', description: 'VISA' }
])

async function purchase(credentials) {
  if (storeAuth.userType == 'P') {
    if (numberValid.value) { // valor de brain coins valido
      credentials.payment_type = payment.value.description
      const dateTransaction = new Date()
      credentials.transaction_datetime = formateDate(dateTransaction)
      credentials.euros = Number(credentials.euros)
      credentials.brain_coins = credentials.euros * 10
      console.log(credentials)

      const valuesForAPI = ref({
        type: '',
        reference: '',
        value : ''
      })
      valuesForAPI.value.type = payment.value.description
      valuesForAPI.value.reference = credentials.payment_reference
      valuesForAPI.value.value = credentials.euros

      console.log(valuesForAPI)
      try{
        const code = await axios.post('https://dad-202425-payments-api.vercel.app/api/debit',valuesForAPI.value)
      if(code.status == 201){
      const response2 = await axios.post('transactionsUpdate', credentials); // criar a transacao na BD
      const response = await axios.post('/user/update-brain-coins', { // atualizar as brain coins do user
        brain_coins_balance: credentials.brain_coins
      });
      console.log('Brain coins updated:', response.data);
      window.location.reload();
      }
      else{
        storeError.setErrorMessages('There was error, check your payment data')
      }
      }catch(error){
        storeError.setErrorMessages('There was error, check your payment data')
      }
      
    }
  }
  else {
    storeError.setErrorMessages('Only players can purchase brain coins')
  }
}

function formateDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

watch(() => credentials.value.euros, (newValue) => {
  isEurosInteger(newValue)
})


</script>


<template>
  <Card class="w-[450px] mx-auto my-8 p-4 px-8">
    <CardHeader>
      <CardTitle>Purchase Brain Coins</CardTitle>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label class="mb-3">Euros</Label>
            <Input placeholder="Amount of euros to add" v-model="credentials.euros" />
            <p v-if="!numberValid" class="text-red-500">The ammount must be a integer number in [1,99]</p>
          </div>
          <div class="form-group">
            <Label>Select a payment type:<br><br></Label>
            <select
              class=" mb-3 form-control block w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
              v-model="payment">
              <option v-for="paymentOption in paymentTypeList" :value="paymentOption">
                {{ paymentOption.description }}
              </option>
            </select>
          </div>
        </div>
        <span v-if="payment" class="alert-info col-md-2 col-md-offset-1 mt-2">
          {{ payment ? ` Write your here ${payment.description}` : 'Empty' }}
          <Input :placeholder="payment.description" v-model="credentials.payment_reference" />
        </span>
      </form>
    </CardContent>
    <CardFooter class=" flex justify-between px-6 pb-6">
      <Button variant="outline" @click="cancel">
        Cancel
      </Button>
      <Button @click="purchase(credentials)">
        Purchase Brain Coins
      </Button>

    </CardFooter>
  </Card>
</template>