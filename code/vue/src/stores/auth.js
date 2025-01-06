import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import avatarNoneAssetURL from '@/assets/avatar-none.png'

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const storeError = useErrorStore();

    const user = ref(null);
    const token = ref('');
    let intervalToRefreshToken = null;

    const socket = inject('socket')
    
    const userName = computed(() => {
        return user.value ? user.value.name : '';
    });

    const getFirstLastName = (fullName) => {
        const names = fullName.trim().split(' ')
        const firstName = names[0] ?? ''
        const lastName = names.length > 1 ? names[names.length -1 ] : ''
        return (firstName + ' ' + lastName).trim()
    }

    const userFirstLastName = computed(() => {
        return getFirstLastName(userName.value)
    })

    const id = computed(() => {
        return user.value ? user.value.id : '';
    });

    const userEmail = computed(() => {
        return user.value ? user.value.email : '';
    });

    const userType = computed(() => {
        return user.value ? user.value.type : '';
    });

    const userGender = computed(() => {
        return user.value ? user.value.gender : '';
    });

    const usernickName = computed(() => {
        return user.value ? user.value.nickname : '';
    });

    const brainCoinsBalance = computed(() => {
        return user.value ? user.value.brain_coins_balance : '';
    });

    function replaceLastSegment(url, searchValue, newValue) {
        return url.replace(new RegExp(`${searchValue}(/)?$`), `${newValue}$1`);
    }

    const userPhotoUrl = computed(() => {

        const photoFile = user.value ? user.value.photoFileName ?? '' : '';
        if (photoFile && axios.defaults.baseURL) {
            return replaceLastSegment(axios.defaults.baseURL, '/api', photoFile);
        }
        return avatarNoneAssetURL;
    });



    const clearUser = () => {
        resetIntervalToRefreshToken()
        if (user.value) {
            socket.emit('logout', user.value)
        }
        user.value = null
        token.value = ''
        localStorage.removeItem('token')
        axios.defaults.headers.common.Authorization = ''
    }
    
    const login = async (credentials) => {
        storeError.resetMessages()
        try {
            const responseLogin = await axios.post('auth/login', credentials)
            token.value = responseLogin.data.token
            localStorage.setItem('token', token.value)
            axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
            const responseUser = await axios.get('users/me')
            user.value = responseUser.data.data
            socket.emit('login', user.value)
            repeatRefreshToken()
            router.push({ name:'Homepage' }) // a pagina que carrega apos o login <--------
            return user.value
        } catch (e) {
            clearUser()            
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Authentication Error!')
            return false
        }
    }

    /*const logout = async () => { //do to merges
        storeError.resetMessages()
        try {
            await axios.post('auth/logout')
            clearUser()
            return true
        } catch (e) {
            clearUser()
            storeError.setErrorMessages(e.response.data.message, [], e.response.status, 'Authentication Error!')
            return false
        }
    }*/

    // These 2 functions and intervalToRefreshToken variable are "private" - not exported by the store
    /*let intervalToRefreshToken = null*/ //do to merges

    const resetIntervalToRefreshToken = () => {
        if (intervalToRefreshToken) {
            clearInterval(intervalToRefreshToken);


    }
        user.value = null;
        token.value = '';
        localStorage.removeItem('token');
        axios.defaults.headers.common.Authorization = '';
    };

    const repeatRefreshToken = () => {
        if (intervalToRefreshToken) {
            clearInterval(intervalToRefreshToken);
        }
        intervalToRefreshToken = setInterval(async () => {
            try {
                const response = await axios.post('auth/refreshtoken');
                token.value = response.data.token;
                localStorage.setItem('token', token.value);
                axios.defaults.headers.common.Authorization = 'Bearer ' + token.value;

            } catch (e) {
                clearUser();
                storeError.setErrorMessages(
                    e.response?.data?.message || 'Error refreshing token',
                    e.response?.data?.errors || null,
                    e.response?.status || 500,
                    'Authentication Error!'
                );
            }
        }, 1000 * 60 * 110); // repeat every 110 minutes
    };

    /*const login = async (credentials) => { //do to merges
        storeError.resetMessages();
        try {
            const responseLogin = await axios.post('auth/login', credentials);
            token.value = responseLogin.data.token;

            localStorage.setItem('token', token.value);
            axios.defaults.headers.common.Authorization = 'Bearer ' + token.value;

            const responseUser = await axios.get('users/me');
            user.value = responseUser.data.data;

            repeatRefreshToken();
            await router.push('/'); // Redirect after successful login
        } catch (error) {
            storeError.setErrorMessages(
                error.response?.data?.message || 'Login failed',
                error.response?.data?.errors || null,
                error.response?.status || 500,
                'Authentication Error!'
            );
        }
    };*/
    
    /*const restoreToken = async function () {//do to merges
        let storedToken = localStorage.getItem('token')
            if (storedToken) {
                try {
                    token.value = storedToken
                    axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
                    const responseUser = await axios.get('users/me')
                    user.value = responseUser.data.data
                    socket.emit('login', user.value)
                    repeatRefreshToken()
                    return true                 
                } catch {
                    clearUser()
                    return false 
                }
        }
    };*/

    const restoreToken = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            clearUser();
            return false;
        }
                try {
            token.value = storedToken;
            axios.defaults.headers.common.Authorization = 'Bearer ' + token.value;

            const responseUser = await axios.get('users/me');
            user.value = responseUser.data.data;

            repeatRefreshToken();
            return true;
                } catch {
            clearUser();
            return false;



    }
    };

    const canUpdateDeleteProject = (project) => {
        return project && user.value && (userType.value === 'A' || user.value.id === project.created_by_id);
    };

    const register = async (credentials) => {
        storeError.resetMessages(); // Reseta mensagens de erro antes de iniciar
        try {
          await axios.post("register", credentials);
          const loginResponse = await login({
            email: credentials.email,
            password: credentials.password,
          });
          if (loginResponse) {
            console.log("aqui no if")
            await addTransaction(loginResponse.id);
            console.log("aqui no if depois da funcao")
        }
        } catch (e) {
          storeError.setErrorMessages(
            e.response.data.message,
            e.response.data.errors,
            e.response.status,
            "Registration Error!"
          );
          if (e.response?.data.errors != null) {
            errorsRegister.value = e.response.data.errors;
          }
          return false;
        }
      };



      const credentials2 = ref({
        user_id: null,
        game_id: '',
        type: 'B',
        euros: null,
        payment_ref: null,
        payment_type: null,
        transaction_datetime: '',
        brain_coins: 10,
      })
      
      
      async function addTransaction(userData) {
          const dateTransaction = new Date()
          credentials2.value.transaction_datetime = formateDate(dateTransaction)
          credentials2.value.user_id = userData
          console.log(credentials2)
      
          const response2 = await axios.post('transactionsUpdate', credentials2.value); // criar a transacao na BD
          //window.location.reload(); // atualizar a pagina

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



    const updateUserProfile = (newProfile) => {
        if (user.value) {
            user.value.nickname = newProfile.username;
            user.value.name = newProfile.name;
            user.value.email = newProfile.email;
        }
    };

    const saveNickname = async () => {
        try {
            const response = await axios.patch('/api/user/update-username', {
                nickname: user.value.nickname, // Enviando o nickname atualizado
            },
            {
            headers: {
                Authorization: `Bearer ${storeAuth.token}`, // Incluindo o token de autenticação
            },

            });

            if (response.status === 200) {
                console.log('Nickname atualizado com sucesso!');
                storeAuth.usernickName = user.value.nickname; // Atualizando o store
            }
        } catch (error) {
            console.error('Erro ao atualizar o nickname:', error);
            console.log('Erro ao salvar o nickname. Tente novamente.');
        }
    };


    const logout = () => {
        clearUser();
        router.push('/'); // Redirect to login page after logout
    };

    return {
        user,
        userName,
        userFirstLastName,
        userEmail,
        userType,
        userGender,
        brainCoinsBalance,
        userPhotoUrl,
        id,
        usernickName,
        login,
        logout,
        restoreToken,
        canUpdateDeleteProject,
        updateUserProfile,
        saveNickname,
        getFirstLastName,
        register
    };
});