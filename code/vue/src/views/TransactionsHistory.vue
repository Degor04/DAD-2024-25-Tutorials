<script setup>
import { inject } from 'vue'
import { ref, computed, onMounted } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';
import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { User } from 'lucide-vue-next';

const storeTransactions = useTransactionsStore()
const storeGame = useGameStore()
const storeAuth = useAuthStore()

let myTransactions = ref([])
const currentPage = ref(1); // ao abrir o site estara na 1 pagina
const numberTransactionPerPage = 9;
const jumpPage = ref(currentPage.value);
var isloading = ref(true)

function loading() {
    setTimeout(() => { isloading.value = false; });
}


function writeTypeTransaction(type, euros) {
    if (!type) return 'No data';
    if (type === 'B') return 'Bonus';
    if (type === 'P') return 'Purchase' + writeEuros(euros);
    if (type === 'I') return 'Spendings/Earnings related to a game';
}

function writeEuros(euros) {
    return ' Amount used ' + euros
}

function writePaymenttpe(payment_type, payment_reference) {
    if (!payment_type) return '';
    else {
        return 'Payment type ' + payment_type + ' Payment reference ' + payment_reference
    }
}

const countMyTransactions = computed(() => {
    return myTransactions.value = storeTransactions.transactions.filter(
        (transaction) => transaction.user_id === storeAuth.id).length
});

const filterMyTransactions = computed(() => {
    return myTransactions.value = storeTransactions.transactions.filter(
        (transaction) => transaction.user_id === storeAuth.id)
})

const paginatedTransactions = computed(() => {
    const startIndex = (currentPage.value - 1) * numberTransactionPerPage;
    const lastPage = startIndex + numberTransactionPerPage;
    return filterMyTransactions.value.slice(startIndex, lastPage);
});

const paginatedTransactionsAdmin = computed(() => {
    const startIndex = (currentPage.value - 1) * numberTransactionPerPage;
    const lastPage = startIndex + numberTransactionPerPage;
    return storeTransactions.transactions.slice(startIndex, lastPage);
});

const totalPagesAdmin = computed(() => {
    return Math.ceil(storeTransactions.transactions.length / numberTransactionPerPage);
});

const totalPages = computed(() => {
    return Math.ceil(filterMyTransactions.value.length / numberTransactionPerPage);
});

function goToNextPageAdmin() {
    if (currentPage.value < totalPagesAdmin.value) {
        currentPage.value++;
    }
}

function goToNextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
}

function goToPreviousPage() {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
}

function goToPage(pageNumber) {
    const targetPage = parseInt(pageNumber, 10); // 10 significa que o numero recebido esta na base decimal
    if (targetPage >= 1 && targetPage <= totalPages.value) {
        currentPage.value = targetPage;
        jumpPage.value = targetPage;
        // to do
        // adicionar pop-up de erro para input invalido
    }
}

function goToPageAdmin(pageNumber) {
    const targetPage = parseInt(pageNumber, 10); // 10 significa que o numero recebido esta na base decimal
    if (targetPage >= 1 && targetPage <= totalPagesAdmin.value) {
        currentPage.value = targetPage;
        jumpPage.value = targetPage;
        // adicionar pop-up de erro para input invalido
    }
}


onMounted(() => {
    storeTransactions.fetchTransactions().then(() => {
        loading();
    })
})
</script>


<template>

    <div class="container mx-auto p-6">
        <div>

            <!---Player-->
            <div v-if="storeAuth.userType === 'P'">
                <div v-if="isloading" class="text-center text-gray-600">
                    <p>Loading your transaction... Please wait!</p>
                </div>
                <div v-else>
                    <div v-if="countMyTransactions != 0">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            <div v-for="(transaction, index) in paginatedTransactions" :key="transaction.id"
                                class="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
                                <div class="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
                                    <p class="mt-1 text-sm text-gray-500">
                                        Game id associated: {{ transaction.game_id }} <br>
                                        Date {{ transaction.transaction_datetime }} <br>
                                        Brain Coins Changes {{ transaction.brain_coins }} <br>
                                        Transaction type {{ writeTypeTransaction(transaction.type,transaction.euros) }}<br>
                                        {{ writePaymenttpe(transaction.payment_type, transaction.payment_reference) }} <!--Deixar para ultimo parametro-->
                                    </p>
                                </div>
                            </div>
                        </div>
                        <!---Fazer o paginate-->
                        <div class="pagination mt-6 flex justify-center items-center gap-4">
                            <button @click="goToPreviousPage" :disabled="currentPage === 1"
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
                                Previous
                            </button>
                            <span class="text-sm text-gray-700">
                                Page {{ currentPage }} of {{ totalPages }}
                            </span>
                            <input v-model="jumpPage" type="number" min="1" :max="totalPages"
                                class="w-16 px-2 py-1 border rounded text-center" placeholder="Go to" />

                            <button @click="goToPage(jumpPage)" :disabled="jumpPage < 1 || jumpPage > totalPages"
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
                                Go
                            </button>
                            <button @click="goToNextPage" :disabled="currentPage === totalPages"
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
                                Next
                            </button>
                        </div>
                    </div>
                    <div v-else>
                        This page is more empty that my fridge
                        You can do transactions and spend money here. The best site ever!
                        Its more fun that watching cat videos 🐱
                    </div>
                </div>
            </div>
            <!---Admin  -->
            <div v-if="storeAuth.userType === 'A'">
                <div v-if="isloading" class="text-center text-gray-600">
                    <p>Loading your transaction... Please wait!</p>
                </div>
                <div v-else>
                    <div v-if="storeTransactions.transactions.length == 0">
                        This page is more empty that my head
                        The are no transactions registered 😭. Invite your friends to this site. The best site ever !
                        Its more fun that watching cat videos 🐱
                    </div>
                    <div v-else>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        <div v-for="(transaction, index) in paginatedTransactionsAdmin" :key="transaction.id" class="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
                            <div class="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
                                <p class="mt-1 text-sm text-gray-500">
                                    User nickname:   {{ transaction.user_name }}<br>
                                    Game id associated: {{ transaction.game_id }} <br>
                                    Transactions date: {{ transaction.transaction_datetime }}<br>
                                    Brain Coins Changes {{ transaction.brain_coins }} <br> 
                                    Transaction type {{ writeTypeTransaction(transaction.type, transaction.euros) }}<br>
                                    {{writePaymenttpe(transaction.payment_type,transaction.payment_reference)}} <!--Deixar para ultimo parametro-->
                                </p>
                            </div>
                        </div>
                    </div>
                        <div class="pagination mt-6 flex justify-center items-center gap-4">
                            <button @click="goToPreviousPage" :disabled="currentPage === 1"
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
                                Previous
                            </button>
                            <span class="text-sm text-gray-700">
                                Page {{ currentPage }} of {{ totalPagesAdmin }}
                            </span>
                            <input v-model="jumpPage" type="number" min="1" :max="totalPagesAdmin"
                                class="w-16 px-2 py-1 border rounded text-center" placeholder="Go to" />

                            <button @click="goToPageAdmin(jumpPage)"
                                :disabled="jumpPage < 1 || jumpPage > totalPagesAdmin"
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
                                Go
                            </button>
                            <button @click="goToNextPageAdmin" :disabled="currentPage === totalPagesAdmin"
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!--- Fim do admin-->
        </div>
    </div>
</template>