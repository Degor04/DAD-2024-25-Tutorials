<template>
    <button class="register-button" @click="handleClick">
      Register
    </button>
  </template>

  <script>
  export default {
    name: "RegisterButton",
    methods: {
      handleClick() {
        alert("Você clicou no botão Register!");
        // Aqui você pode redirecionar para a página de registro ou executar outra ação.
      },
    },
  };
  </script>

  <style scoped>
  .register-button {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    background-color: #28a745;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .register-button:hover {
    background-color: #218838;
  }
  </style>
