<template>
  <div class="mt-2 pb-8 mx-0 px-0 backgroundCard">
    <v-row>
      <v-col class="ma-4">
        <v-row>
          <v-col cols="12" md="3">
            <v-card class="px-5 py-6 elevation-0">
              <v-select
                v-model="form.action"
                :items="actions"
                item-text="shortened"
                item-value="id"
                label="Acción"
                @change="(value) => changeStateAction(value)"
                :rules="[$rules.obligatoria('Acción')]"
                background-color="backgroundCard"
                outlined
                dense
              ></v-select>
              <v-select
                v-show="flag_payment_method"
                v-model="form.payment_method"
                :items="modalities_payment"
                :disabled="form.action == ''"
                item-text="name"
                item-value="id"
                label="Método de pago"
                background-color="backgroundCard"
                @change="(value) => changeStatePaymentMethod(value)"
                :rules="[
                  $rules.obligatoriaSiCondicion(
                    form.action != 2,
                    'Campo requerido cuando se selecciona Pago de complemento económico'
                  ),
                ]"
                outlined
                dense
              ></v-select>
              <v-select
                v-show="flag_observation"
                v-model="form.observation"
                :items="observations"
                :disabled="form.action == ''"
                item-text="shortened"
                item-value="id"
                label="Tipo Observación"
                background-color="backgroundCard"
                @change="() => changeStateObservation()"
                :rules="[
                  $rules.obligatoriaSiCondicion(
                    form.action != 3,
                    'Campo requerido cuando se selecciona Observación de trámite'
                  ),
                ]"
                outlined
                dense
              ></v-select>
              <v-select
                v-model="form.semester"
                :items="semesters"
                :disabled="check_receipt_of_requirements || check_economic_complement_payment || form.action == ''"
                item-text="period"
                item-value="id"
                :label="
                  check_receipt_of_requirements
                    ? 'Todos'
                    : check_economic_complement_payment
                    ? semesters[semesters.length - 1].period
                    : 'Semestre'
                "
                :hint="check_receipt_of_requirements || check_economic_complement_payment ? 'Semestre' : ''"
                persistent-hint
                outlined
                background-color="backgroundCard"
                @change="() => changeStateObservation()"
                :rules="[
                  $rules.obligatoria(!form.observation, 'Campo requerido'),
                  $rules.obligatoriaSiCondicion(form.action != 3),
                ]"
                dense
              ></v-select>
              <v-select
                v-model="form.beneficiary"
                :items="beneficiaries"
                :disabled="check_receipt_of_requirements || check_beneficiary || check_hierarchie || form.action == ''"
                item-text="name"
                item-value="id"
                :label="
                  check_receipt_of_requirements || form.payment_method === 0
                    ? beneficiaries[0].name
                    : 'Tipo beneficiario'
                "
                :hint="check_receipt_of_requirements || form.payment_method === 0 ? 'Tipo beneficiario' : ''"
                background-color="backgroundCard"
                @change="(value) => changeStateModality(value)"
                persistent-hint
                outlined
                dense
              ></v-select>
              <v-select
                v-model="form.hierarchie"
                :items="hierarchies"
                :disabled="
                  check_receipt_of_requirements ||
                  check_beneficiary ||
                  form.beneficiary === 0 ||
                  form.beneficiary == '' ||
                  check_hierarchie
                "
                item-text="name"
                item-value="id"
                :label="
                  check_receipt_of_requirements || form.payment_method === 0 || form.beneficiary === 0 ? hierarchies[0].name : 'Nivel jerárquico'
                "
                outlined
                dense
                :hint="check_receipt_of_requirements || form.payment_method === 0  ? 'Nivel jerárquico' : ''"
                background-color="backgroundCard"
                persistent-hint
                @change="() => changeStateHierarchies()"
              ></v-select>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="pa-2 elevation-0">
              <transition-group name="list" tag="div">
                <drag
                  class="drag table"
                  v-for="(n, i) in params"
                  :key="n+i"
                  :data="n"
                  @cut="remove(n)"
                  >{{ n.param }}</drag
                >
              </transition-group>
            </v-card>

            <v-card class="pa-5 mt-4 elevation-0">
              <div>
                <drop @drop="onCopyDrop">
                  <v-textarea
                    label="Cuerpo del mensaje"
                    v-model="text"
                    color="primary"
                    no-resize
                    outlined
                    counter
                    :rules="[
                      $rules.obligatoria(
                        text,
                        'El cuerpo del mensaje es requerido'
                      ),
                      $rules.longitudMaxima(1999),
                    ]"
                    rows="5"
                  ></v-textarea>
                </drop>
              </div>
            </v-card>

            <v-card class="pa-5 mt-4 elevation-0">
              <v-row>
                <v-col cols="4">
                  <v-file-input
                    accept="image/png,image/jpeg,image/jpg"
                    dense
                    label="Imagen"
                    outlined
                    v-model="file"
                    @change="() => fileUpload()"
                    clearable
                    show-size
                  >></v-file-input>
                </v-col>
                <v-col cols="8">
                  <v-alert
                    class="ml-2"
                    text
                    dense
                    color="info"
                    icon="mdi-information"
                    border="left"
                  >
                    <div class="text-left">
                      Consideraciones para la imagen:<br />
                      - Debe tener el formato jpg o png.<br />
                    </div>
                  </v-alert>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card ma-3 elevation="0" tile>
              <v-card class="text-center primary" height="25" >
                <v-card-subtitle class="mt-0 py-1">
                  <h3 class="font-weight-bold white--text">VISTA PREVIA</h3>
                </v-card-subtitle>
              </v-card>
              <v-img
                :src="require('@/assets/images/img_notification.jpg')"
              >
              </v-img>
              <v-card
                class="overflow-y-auto"
                v-scroll.self="onScroll"
                max-height="220"
              >
                <v-card-text>
                  <h2 class="text-h6 primary--text">Comunicado</h2>
                  <h3 class="secundary--text">Complemento Económico</h3>
                  <v-divider class="mt-2"></v-divider>
                  <p style="white-space: pre-line">{{ text }}</p>
                </v-card-text>
              </v-card>
              <v-card>
                <v-card-actions>
                  <v-btn
                    class="mr-4 white--text font-weight-bold elevation-0 mb-1"
                    block
                    elevation="5"
                    color="primary"
                    :disabled="filter"
                    @click="verify()"
                  >
                    ENVIAR
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-card class="ma-4 pb-10 elevation-0">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            @click="clearAllFilters()"
            color="warning"
            v-on="on"
            x-small
            absolute
            right
            style="margin-top: 8px; margin-right: 50px; color: white"
          >
            <v-icon> mdi-broom </v-icon>
          </v-btn>
        </template>
        <span class="caption">Limpiar todos los filtros</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            @click="checkAll()"
            color="success"
            v-on="on"
            x-small
            absolute
            right
            style="margin-top: 8px; margin-right: 100px; color: white"
          >
            <v-icon> mdi-check-bold </v-icon>
          </v-btn>
        </template>
        <span class="caption">Desmarcar / Marcar</span>
      </v-tooltip>

      <v-data-table
        dense
        class="inputSearch px-10 pt-12"
        :headers="headers"
        :items="affiliates"
        :options.sync="options"
        :server-items-length="total_affiliates"
        :footer-props="{
          showFirstLastPage: true,
          firstIcon: 'mdi-arrow-collapse-left',
          lastIcon: 'mdi-arrow-collapse-right',
          prevIcon: 'mdi-minus',
          nextIcon: 'mdi-plus',
          'items-per-page-text':'Filas por página',
          itemsPerPageOptions: [12, 30, 50, 100]
         }"
        :loading="loading_table"
        no-data-text="No hay datos disponibles"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-checkbox
            v-model="item.send"
            color="primary"
            :value="item.send"
            @click="updateStateSend(item.send, item.affiliate_id)"
            hide-details
          ></v-checkbox>
        </template>

        <template slot="body.prepend">
          <tr>
            <td>
              <v-text-field
                placeholder="NUP afiliado"
                spellcheck="false"
                class="filter-text"
                v-model="searching.affiliate_id"
                @keyup="searchTimeOut()"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                placeholder="Apellido paterno"
                spellcheck="false"
                class="filter-text"
                v-model="searching.last_name"
                @keyup="searchTimeOut()"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                placeholder="Apellido materno"
                spellcheck="false"
                class="filter-text"
                v-model="searching.mothers_last_name"
                @keyup="searchTimeOut()"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                placeholder="Primer nombre"
                spellcheck="false"
                class="filter-text"
                v-model="searching.first_name"
                @keyup="searchTimeOut()"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                placeholder="Segundo nombre"
                spellcheck="false"
                class="filter-text"
                v-model="searching.second_name"
                @keyup="searchTimeOut()"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                placeholder="Carnet de identidad"
                spellcheck="false"
                class="filter-text"
                v-model="searching.identity_card"
                @keyup="searchTimeOut()"
              ></v-text-field>
            </td>
            <td>
              <v-text-field disabled class="filter-text"></v-text-field>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="dialog_send_notification"
      max-width="400"
      persistent
    >
      <v-card>
          <v-card-title>
            ¿Está seguro de realizar el envío de<br> notificaciones?
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
              @click="notify()"
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
import { Drag, Drop } from "vue-easy-dnd";

export default {
  name: "NotificationApp",
  components: {
    Drag,
    Drop,
  },
  props: {},
  mounted() {
    this.getActions()
    this.getMethodsPayments()
    this.getSemesters()
    this.getHierarchies()
    this.getObservations()
    this.getBeneficiaries()
  },
  data: () => ({
    scrollInvoked: 0,
    items: ["Notificación App", "SMS's"],
    eco_com_state_type_id: 6, // habilitados para el pago de complemento económico
    module_id: 2, // id del módulo para observaciones

    actions: [],
    modalities_payment: [],
    semesters: [],
    hierarchies: [],
    observations: [],
    beneficiaries: [],

    params: [
      {
        param: "nombre",
        value: "{{full_name}}",
      },
      {
        param: "grado",
        value: "{{degree}}",
      },
      {
        param: "categoría",
        value: "{{category}}",
      },
      {
        param: "carnet",
        value: "{{identity_card}}",
      },
      {
        param: "entidad",
        value: "{{pension_entity}}",
      },
    ],

    headers: [
      {
        text: "NUP",
        value: "affiliate_id",
        class: ["table", "white--text"],
        width: "3%",
        sortable: false,
      },
      {
        text: "Apellido Paterno",
        value: "last_name",
        class: ["table", "white--text"],
        width: "5%",
        sortable: false,
      },
      {
        text: "Apellido Materno",
        value: "mothers_last_name",
        class: ["table", "white--text"],
        width: "5%",
        sortable: false,
      },
      {
        text: "Primer Nombre",
        value: "first_name",
        class: ["table", "white--text"],
        width: "5%",
        sortable: false,
      },
      {
        text: "Segundo Nombre",
        value: "second_name",
        class: ["table", "white--text"],
        width: "5%",
        sortable: false,
      },
      {
        text: "Carnet Identidad",
        value: "identity_card",
        class: ["table", "white--text"],
        width: "5%",
        sortable: false,
      },
      {
        text: "Acción",
        value: "actions",
        class: ["table ", "white--text"],
        width: "2%",
        align: "center",
        sortable: false,
      },
    ],
    searching: {
      affiliate_id: "",
      last_name: "",
      mothers_last_name: "",
      first_name: "",
      second_name: "",
      identity_card: "",
    },

    form: {
      action: "",
      payment_method: "",
      semester: "",
      hierarchie: "",
      observation: "",
      beneficiary: "",
    },
    flag_payment_method: false,
    flag_observation: false,

    text: "",
    check_receipt_of_requirements: false, // recepción de requisitos
    check_economic_complement_payment: false, // pago complemento económico
    check_beneficiary: false,
    check_hierarchie: false,

    affiliates: [],
    options: {
      page: 1,
      itemsPerPage: 12,
    },
    total_affiliates: 0,
    loading_table: false,
    all_affiliates: [],
    check_all: true,
    file: null,
    url_file: null,
    parameters: {},
    filter: false,
    dialog_send_notification: false,
    btn_send_notification: false,
  }),
  watch: {
    options: function (newVal, oldVal) {
      if (
        newVal.page != oldVal.page ||
        newVal.itemsPerPage != oldVal.itemsPerPage
      ) {
        this.parameters.page = this.options.page
        this.parameters.per_page = this.options.itemsPerPage
        this.parameters.first = false
        this.applicationProcess(this.parameters, false)
      }
    },
    searching: {
      deep: true,
      handler(val) {
        this.parameters.page = 1
      },
    },
  },
  methods: {
    async getActions() {
      try {
        let response = await this.$axios.get(
          "/notification/get_actions",
          undefined
        );
        this.actions = response.Acciones;
      } catch (e) {
        console.log(e);
      }
    },
    async getMethodsPayments() {
      try {
        let response = await this.$axios.get(
          `/notification/get_modalities_payment/${this.eco_com_state_type_id}`,
          undefined
        );
        this.modalities_payment = response.modalities_payment;
        this.modalities_payment.unshift({ id: 0, name: "Todos" });
      } catch (e) {
        console.log(e);
      }
    },
    async getSemesters() {
      try {
        let response = await this.$axios.get(
          "/notification/get_semesters",
          undefined
        );
        this.semesters = response.semesters;
      } catch (e) {
        console.log(e);
      }
    },
    async getHierarchies() {
      try {
        let response = await this.$axios.get(
          "/notification/get_hierarchical_level",
          undefined
        );
        this.hierarchies = response.hierarchies;
        this.hierarchies.unshift({ id: 0, name: "Todos" });
      } catch (e) {
        console.log(e);
      }
    },
    async getObservations() {
      try {
        let response = await this.$axios.get(
          `/notification/get_observations/${this.module_id}`,
          undefined
        );
        this.observations = response.observations;
      } catch (e) {
        console.log(e);
      }
    },
    async getBeneficiaries() {
      try {
        let response = await this.$axios.get(
          "/notification/get_beneficiary_type",
          undefined
        );
        this.beneficiaries = response.beneficiary_type;
        this.beneficiaries.unshift({ id: 0, name: "Todos" });
      } catch (e) {
        console.log(e);
      }
    },
    async notify() {
      try {
          if(this.text != null && this.text != "" && this.all_affiliates.length && this.amountToSend() !== 0) {

            if(this.file != null)
              this.url_file = await this.$firebase.getURL(this.file);
                  try {
                    this.btn_send_notification = true
                    let response = await this.$axios.post(
                      "/notification/send_mass_notification",
                      {
                        title: "Complemento económico",
                        message: this.text,
                        user_id: this.$store.getters.user.id,
                        image: this.url_file,
                        attached: "Comunicado",
                        sends: this.all_affiliates,
                        action: this.form.action,
                        semester_id: this.form.semester,
                      }
                    );
                    let error = response.data.error
                    this.dialog_send_notification = false
                    if (!error) {
                      this.btn_send_notification = false
                      let message = response.message
                      let success_count = response.data.success_count
                      let cmp = success_count == 1 ? "afiliado" : "afiliados"
                      this.$toast.success(
                        `Se ha notificado exitosamente`
                      );
                      this.btn_send_notification = false
                    } else {
                      this.btn_send_notification = false
                      this.$toast.error('Hubo un error');
                    }
                  } catch(e) {
                    this.btn_send_notification = false
                    this.$toast.error('Hubo un error');
                    console.log(e)
                  }
          } else if(this.text == null || this.text == "") {
            this.dialog_send_notification = false
            this.$toast.error('¡El cuerpo del mensaje no puede estar vacío!');
        } else {
            this.$toast.error('¡No hay afiliados para notificar!');
        }
      } catch (e) {
        console.log(e);
      }
    },
    async applicationProcess(obj, flag = true){
      try {
        this.loading_table = true
        setTimeout(async () => {
          obj.first = flag
          if(!this.isEmptyObjectValues(this.searching)) {  // entra cuando se llenaron los filtros
            this.filter = true
            obj = {...obj, ...this.searching}
          }  else {
            this.filter = false
          }
          let response = await this.$axios.post("/notification/list_to_notify", obj)
          this.all_affiliates = flag
            ? this.preProcessData(response.all)
            : this.all_affiliates
          this.dataSync(response)
          this.total_affiliates = response.data.total
          this.options.page = response.data.current_page
          this.options.itemsPerPage = parseInt(response.data.per_page)
        }, 300)
        this.loading_table = false
      } catch(e) {
        this.loading_table = false
        console.log(e)
      }
    },
    isEmptyObjectValues(obj) {
      let values = Object.values(obj)
      for(const val of values) {
        if(val != "") return false
      }
      return true
    },
    onScroll() {
      this.scrollInvoked++;
    },
    onCopyDrop(e) {
      this.text += " " + e.data.value + " ";
    },
    amountToSend(){
      let i = 0
      this.all_affiliates.forEach((el) => {
        if(el.send) i++
      })
      console.log(i)
      return i
    },
    resetValues() {
      this.form.payment_method =
      this.form.semester =
      this.form.hierarchie =
      this.form.observation =
      this.form.beneficiary = "";
    },
    changeStateAction(value) {
      switch (value) {
        case 1: // si es recepción de requisitos
          this.resetValues();
          this.flag_payment_method = false;
          this.flag_observation = false;
          this.check_receipt_of_requirements = true;
          this.check_economic_complement_payment = false;
          this.check_hierarchie = false;
          this.parameters = {
            action: this.form.action,
            first: true,
            page: this.options.page,
            per_page: this.options.itemsPerPage,
          }
          this.applicationProcess(this.parameters)
          break;
        case 2: // si es pago de complemento económico
          this.resetValues();
          this.flag_payment_method = true;
          this.flag_observation = false;
          this.check_receipt_of_requirements = false;
          this.check_economic_complement_payment = true;
          this.form.semester = this.semesters[this.semesters.length - 1].id;
          this.check_hierarchie = false;
          break;
        case 3: // Si es observaciones
          this.resetValues();
          this.flag_payment_method = false;
          this.flag_observation = true;
          this.check_receipt_of_requirements = false;
          this.check_economic_complement_payment = false;
          this.check_hierarchie = true;
          break;
      }
    },
    changeStatePaymentMethod(value) {
      this.form.hierarchie = this.form.beneficiary = ""
      this.form.observation = ""
      if (value == 0) {
        this.check_beneficiary = true;
      } else {
        this.check_beneficiary = false;
      }
      this.parameters = {
          action: this.form.action,
          payment_method: this.form.payment_method,
          first: true,
          page: this.options.page,
          per_page: this.options.itemsPerPage,
      }
      this.applicationProcess(this.parameters)
    },
    changeStateModality(value) {
      if (value === 0) this.form.hierarchie = "";
      this.parameters = {
          action: this.form.action,
          payment_method: this.form.payment_method,
          modality: this.form.beneficiary,
          first: true,
          page: this.options.page,
          per_page: this.options.itemsPerPage,
      }
      this.applicationProcess(this.parameters)
    },
    changeStateHierarchies() {
      this.parameters = {
          action: this.form.action,
          payment_method: this.form.payment_method,
          modality: this.form.beneficiary,
          hierarchies: this.form.hierarchie,
          first: true,
          page: this.options.page,
          per_page: this.options.itemsPerPage,
      }
      this.applicationProcess(this.parameters)
    },
    changeStateObservation() {
      if(this.form.semester !== "") {
        this.form.beneficiary = this.form.hierarchie = "";
        this.parameters = {
          action: this.form.action,
          type_observation: this.form.observation,
          semester_id: this.form.semester, // id
          first: true,
          page: this.options.page,
          per_page: this.options.itemsPerPage,
        }
        this.applicationProcess(this.parameters)
      }
    },
    updateStateSend(send, affiliate_id) {
      this.all_affiliates.some((element) => {
        if (element.affiliate_id == affiliate_id) {
          element.send = send ?? false
          return
        }
      })
    },
    preProcessData(array) {
      if(array.length) {
        array.forEach((element) => {
          element.send = true;
        });
      }
      return array;
    },
    dataSync(response) {
      this.affiliates = this.preProcessData(response.data.data)
      if (this.all_affiliates.length) {
        this.affiliates.forEach((element) => {
          this.all_affiliates.filter((key) => {
            if (key.affiliate_id == element.affiliate_id) {
              element.send = key.send
            }
          })
        })
      }
    },
    clearAllFilters() {
      this.searching.affiliate_id = ""
      this.searching.last_name = ""
      this.searching.mothers_last_name = ""
      this.searching.first_name = ""
      this.searching.second_name = ""
      this.searching.identity_card = ""
      const {affiliate_id, last_name, mothers_last_name, first_name, second_name, identity_card, ...think} = this.parameters  // más eficiente
      this.filter = false
      this.applicationProcess(think, false)
    },
    checkAll() {
      this.check_all = !this.check_all
      this.all_affiliates.forEach((element) => {
        element.send = this.check_all
        this.affiliates.filter((key) => {
          if(key.affiliate_id == element.affiliate_id) {
            key.send = element.send
          }
        })
      })
    },
    fileUpload() {
      if(this.file !== null)
      console.log(this.$firebase.upload(this.file));
    },
    verify() {
      if(this.text == null || this.text == "" || this.all_affiliates.length == 0 || this.amountToSend() === 0) {
        if(this.text == null || this.text == "") {
          this.$toast.error('¡El cuerpo del mensaje no puede estar vacío!');
        } else {
          this.$toast.error('¡No hay afiliados para notificar!');
        }
        this.dialog_send_notification = false
      } else {
        this.dialog_send_notification = true
      }
    },
    searchTimeOut() {
      this.parameters.page = this.options.page
      this.parameters.per_page = this.options.itemsPerPage
      this.parameters.first = false
      if(this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.applicationProcess(this.parameters, false)
      }, 800);
    }
  }
}
</script>
<style scoped>
.drag {
  width: 85px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0px 0px 0 20px;
  font-size: 15px;
  transition: all 0.5s;
  border-radius: 5px;
  color: white;
}
.group {
  display: flex;
}
</style>