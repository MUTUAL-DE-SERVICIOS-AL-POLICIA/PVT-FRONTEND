<template>
  <!-- <v-container> -->
    <div>
      <v-row >
        <v-col md="12" >
          <v-card-text  >
            <v-form ref="forLogin" >
              <div
                class="
                  display-1
                  font-weight-thin
                  text-md-center text-uppercase
                  pb-10
                "
              >
                <p>LOGIN</p>
              </div>
              <v-text-field
                class="pl-5 pr-5"
                @keyup.enter="validateForm()"
                v-model="form.username"
                prepend-icon="mdi-account"
                label="Usuario"
                autocomplete="on"
                autofocus
                :rules="[$rules.obligatoria('Usuario'), $rules.soloLetras()]"
              ></v-text-field>
              <v-text-field
                class="pl-5 pr-5 mb-3"
                @keyup.enter="validateForm()"
                v-model="form.password"
                prepend-icon="mdi-key"
                label="Contraseña"
                type="password"
                autocomplete="on"
                :rules="[$rules.obligatoria('Contraseña'), $rules.longitudMinima(4)]"
              ></v-text-field>
              <v-btn @click="validateForm()" primary large block color="primary"
                >Ingresar</v-btn
              >
            </v-form>
          </v-card-text>
        </v-col>
      </v-row>
    </div>
</template>

<script>
export default {
  name: "auth-Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async authenticate() {
      try {
        let response = await this.$axios.post("/auth/login", this.form);
        this.$auth.startSession(
          response.payload.user,
          response.payload.access_token
        );
        console.log(response);
      } catch (e) {
        console.log(e);
        this.$toast.error(e.message)
      }
    },
    async getUser() {
      try {
        let res = await this.$axios.get("/auth/auth_user");
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    },
    validateForm() {
      if (this.$refs.forLogin) {
        if (this.$refs.forLogin.validate()) {
          this.authenticate();
        } else {
          console.log("no valido");
        }
      }
    },
  },
};
</script>