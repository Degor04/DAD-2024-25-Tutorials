import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { h } from 'vue'

export const useTransactionsStore = defineStore('transaction', () => {
    
    const router = useRouter()
    const storeError = useErrorStore()
    const transactions = ref([])

   const fetchTransactions = async () => {
    storeError.resetMessages()
            const response = await axios.get('transactionsHistory');
            transactions.value = response.data.data
            console.log(transactions)
    }

    return {
        transactions,
        fetchTransactions
    }
})
