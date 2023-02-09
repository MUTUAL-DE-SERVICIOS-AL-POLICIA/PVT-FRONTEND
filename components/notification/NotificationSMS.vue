<template>
  <div class="mt-2 pb-8 mx-0 px-0 backgroundCard">
        <v-form ref="forNotification">
          <v-row>
            <v-col cols="6" align="center">
              <v-card class="ma-4 pa-4 elevation-0">
                <v-alert
                  text
                  dense
                  color="info"
                  icon="mdi-information"
                  border="left"
                >
                  <div class="text-left">
                    Consideraciones para el archivo:<br />
                    - Debe tener el formato xls.<br />
                    - La primera columna debe contener el NUP del afiliado, sin
                    encabezado.<br />
                    - La segunda columna debe contener el número de celular del
                    afiliado. Ej. 65432100.<br />
                    - La tercer columna debe contener el mensaje. (160 caracteres máx)<br />
                  </div>
                </v-alert>

                <v-file-input
                  accept="application/vnd.ms-excel,application/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  dense
                  label="Archivo"
                  outlined
                  clearable
                  v-model="form.file"
                  show-size
                  :rules="[
                    $rules.obligatoria('Archivo'),
                    $rules.longitudMinima(4),
                  ]"
                >
                  ></v-file-input
                >
                <v-btn
                  color="primary"
                  block
                  elevation="2"
                  right
                  @click="validateFormNotification()"
                  class="ma-0"
                >
                  ENVIAR
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-form>

    <v-dialog v-model="dialog_send_notification" max-width="400" persistent>
      <v-card>
        <v-card-title>
          ¿Está seguro de realizar el envío de <br>notificaciones?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="dialog_send_notification = false"
            :disabled="btn_send_notification"
          >
            Cerrar
          </v-btn>
          <v-btn
            color="sucess"
            text
            @click.stop="sendNotification()"
            :loading="btn_send_notification"
          >
            Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>
</template>

<script>
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";

export default {
  name: "user-MainUsers",
  components: {
    GlobalBreadCrumb,
  },
  props: {},
  data: () => ({
    form: {
      file: null,
      title: null,
      message: null,
      attached: null,
      notification_type: 7,
    },
    notification: [],
    dialog_send_notification: false,
    btn_send_notification: false,
  }),

  mounted() {},
  methods: {
    async sendNotification() {
      try {
        this.btn_send_notification = true;
        let formData = new FormData();
        formData.append("file", this.form.file);
        formData.append("user_id", this.$store.getters.user.id)
        formData.append("action", this.form.notification_type);
        let res = await this.$axios.post(
          "/notification/file",
          formData
        );
        if (!res.error) {
          this.notification = res.data.delivered;
          this.btn_send_notification = false;
          this.dialog_send_notification = false;
          this.$toast.success(
            "Se está notificando a los afiliados"
          );
          this.clearInputs();
        } else {
          this.$toast.error(res.message);
        }
      } catch (e) {
        console.log(e);
        this.$toast.error("Ocurrio un error durante el envio");
        this.dialog_send_notification = false;
      }
    },
    validateFormNotification() {
      if (this.$refs.forNotification) {
        if (this.$refs.forNotification.validate()) {
          this.dialog_send_notification = true;
          this.btn_send_notification = false;
        } else {
          this.dialog_send_notification = false;
          console.log("no valido");
        }
      }
    },
    clearInputs() {
      this.form = {
        file: null,
        title: null,
        message: null,
        attached: null,
      };
    },
  },
};
</script>
