<template>
  <v-card class="mx-5 px-5 py-6 elevation-0">
    SALDO SIM:
    <span
      ><strong>{{ $filters.money(balance) }} Bs.</strong></span
    >
    <v-btn
      x-small
      class="ma-2 pa-3"
      color="info"
      :loading="loading_btn_balance"
      @click.stop="updateBalance()"
    >
      actualizar saldo
      <v-icon>mdi-reload</v-icon>
    </v-btn>
  </v-card>
</template>
<script>
export default {
  name: "CellBalance",
  components: {},
  data: () => ({
    balance: "256.65",
    loading_btn_balance: false,
  }),
  mounted() {
    this.updateBalance();
  },
  methods: {
    async updateBalance() {
      try {
        this.loading_btn_balance = true;
        this.loading_btn_balance = false;
      } catch (e) {
        console.log(e);
        this.loading_btn_balance = false;
      }
    },
  },
};
</script>
