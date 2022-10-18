<template>
  <v-container fluid>
    <v-card flat>
      <v-card-title>
        <v-toolbar dense color="tertiary" class="caption">
          <GlobalBreadCrumb />
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-form ref="forNotification">
          <v-row>
            <v-col cols="6" align="center">
              <v-card class="ma-0 pa-3">
                <v-text-field
                  dense
                  label="Titulo"
                  outlined
                  clearable
                  v-model="form.title"
                  :rules="[
                    $rules.obligatoria('Titulo'),
                    $rules.longitudMinima(4),
                  ]"
                >
                </v-text-field>

                <v-textarea
                  dense
                  label="Mensaje"
                  outlined
                  clearable
                  v-model="form.message"
                  :rules="[
                    $rules.obligatoria('Mensaje'),
                    $rules.longitudMinima(4),
                  ]"
                >
                </v-textarea>

                <v-alert
                  class="ml-2"
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
                    encabezado.
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
                  color="success"
                  right
                  @click="validateFormNotification()"
                >
                  ENVIAR
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog_send_notification" max-width="500" persistent>
      <v-card>
        <v-card-title>
          Esta seguro de realizar el envio de notificaciones?
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
            @click="sendNotification()"
            :loading="btn_send_notification"
          >
            Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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
        formData.append("title", this.form.title);
        formData.append("message", this.form.message);
        formData.append("attached", this.form.attached);

        let res = await this.$axios.post(
          "/notification/send_notifications",
          formData
        );
        if (!res.error) {
          this.notification = res.data.delivered;
          this.btn_send_notification = false;
          this.dialog_send_notification = false;
          this.$toast.success(
            "Se ha enviado correctamente la notificación a " +
              res.data.success_count +
              " destinatarios"
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
