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
                :disabled="check || check_2 || form.action == ''"
                item-text="period"
                item-value="id"
                :label="
                  check
                    ? 'Todos'
                    : check_2
                    ? semesters[semesters.length - 1].period
                    : 'Semestre'
                "
                :hint="check || check_2 ? 'Semestre' : ''"
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
                :disabled="check || check_3 || check_4 || form.action == ''"
                item-text="name"
                item-value="id"
                :label="
                  check || form.payment_method === 0
                    ? beneficiaries[0].name                    
                    : 'Tipo beneficiario'
                "                
                :hint="check || form.payment_method === 0 ? 'Tipo beneficiario' : ''"
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
                  check ||
                  check_3 ||
                  form.beneficiary === 0 ||
                  form.beneficiary == '' ||
                  check_4
                "
                item-text="name"
                item-value="id"
                :label="
                  check || form.payment_method === 0 || form.beneficiary === 0 ? hierarchies[0].name : 'Nivel jerárquico'
                "
                outlined
                dense
                :hint="check || form.payment_method === 0  ? 'Nivel jerárquico' : ''"
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
                src="https://www.opinion.com.bo/asset/thumbnail,992,558,center,center//media/opinion/images/2022/05/24/2022052415283420630.jpg"
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
        :footer-props="{ itemsPerPageOptions: [8, 15, 50, 100] }"
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
                @input="applicationProcess(parameters, false)"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                placeholder="Apellido paterno"
                spellcheck="false"
                class="filter-text"
                v-model="searching.last_name"
                @input="applicationProcess(parameters, false)"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                placeholder="Apellido materno"
                spellcheck="false"
                class="filter-text"
                v-model="searching.mothers_last_name"
                @input="applicationProcess(parameters, false)"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                placeholder="Primer nombre"
                spellcheck="false"
                class="filter-text"
                v-model="searching.first_name"
                @input="applicationProcess(parameters, false)"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                placeholder="Segundo nombre"
                spellcheck="false"
                class="filter-text"
                v-model="searching.second_name"
                @input="applicationProcess(parameters, false)"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                placeholder="Carnet de identidad"
                spellcheck="false"
                class="filter-text"
                v-model="searching.identity_card"
                @input="applicationProcess(parameters, false)"
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
    id: 6, // habilitados para el pago de complemento económico
    module_id: 2, // id del modulo
    
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
    check: false, // recepción de requisitos
    check_2: false, // pago complemento económico
    check_3: false,
    check_4: false,

    affiliates: [],
    options: {
      page: 1,
      itemsPerPage: 8,
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
          `/notification/get_modalities_payment/${this.id}`,
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
            // let amount = this.amountToSend()                      
            // this.$swal({
            //   title: '¿Está seguro de enviar notificaciones?',
            //   text: `¡Se va enviar a ${amount} afiliados`,  
            //   type: 'warning',
            //   showCancelButton: true,
            //   confirmButtonColor: '#00838F',
            //   cancelButtonColor: '#d33',
            //   confirmButtonText: 'Confirmar'
            // }).then( async (result) => {                         
            //     if(result.value) {
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
                      }
                    );
                    let error = response.data.error
                    
                    if (!error) {        
                      this.btn_send_notification = false      
                      let message = response.message            
                      let success_count = response.data.success_count
                      let cmp = success_count == 1 ? "afiliado" : "afiliados"
                      this.$toast.success(
                        `Se ha notificado exitosamente a ${success_count} ${cmp}`     
                      );
                      // this.$swal({
                      //   position: 'top-end',
                      //   type: 'success',
                      //   title: message,
                      //   text: `Se ha notificado exitosamente a ${success_count} ${cmp}`,
                      //   showConfirmButton: false,
                      //   timer: 2500
                      // })
                    } else {
                      this.btn_send_notification = false
                      this.$toast.error('Hubo un error, comuniquese con sistemas');
                      // this.$swal({
                      //   type: 'error',
                      //   title: 'Hubo un error',
                      //   text: 'Comuniquese con sistemas'
                      // })
                    }
                  } catch(e) {
                    // this.$swal({
                    //   type: 'error',
                    //   title: 'Hubo un error',
                    //   text: 'Comuniquese con sistemas'
                    // })
                    this.btn_send_notification = false
                    this.$toast.error('Hubo un error, comuniquese con sistemas');
                    console.log(e)
                  }
              //   }
                
              // })               
          } else if(this.text == null || this.text == "") {
            this.dialog_send_notification = false
            this.$toast.warning('¡El cuerpo del mensae no puede estar vacío!');
            // const Toast = this.$swal.mixin({
            //   toast: true,
            //   position: 'top-end',
            //   showConfirmButton: false,
            //   timer: 3000,
            //   timerProgressBar: true,
            // })
            // Toast.fire({
            //   type: 'warning',
            //   title: '¡El cuerpo del mensaje no puede estar vacío!'
            // })
        } else {
            this.$toast.warning('¡No hay afiliados para notificar!');
            // const Toast = this.$swal.mixin({
            //   toast: true,
            //   position: 'top-end',
            //   showConfirmButton: false,
            //   timer: 3000,
            //   timerProgressBar: true,
            // })
            // Toast.fire({
            //   type: 'warning',
            //   title: '¡No hay afiliados para notificar!'
            // })
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
          // || this.filter
            ? this.preProcessData(response.all)
            : this.all_affiliates
          this.dataSync(response)          
          this.total_affiliates = response.data.total
          this.options.page = response.data.current_page
          this.options.itemsPerPage = parseInt(response.data.per_page)
          // this.filter = false  
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
    show() {
     
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
          this.check = true;
          this.check_2 = false;
          this.check_4 = false;          
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
          this.check = false;
          this.check_2 = true;
          this.form.semester = this.semesters[this.semesters.length - 1].id;
          this.check_4 = false;
          break;
        case 3: // Si es observaciones
          this.resetValues();
          this.flag_payment_method = false;
          this.flag_observation = true;
          this.check = false;
          this.check_2 = false;
          this.check_4 = true;
          break;
      }
    },
    changeStatePaymentMethod(value) {
      this.form.hierarchie = this.form.beneficiary = ""
      this.form.observation = ""
      if (value == 0) {        
        this.check_3 = true;
      } else {
        this.check_3 = false;
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
      // if(this.filter) {        
      //   let diff = this.all_affiliates.filter(
      //     element => this.affiliates.findIndex(
      //       other => other.affiliate_id == element.affiliate_id
      //       ) 
      //     == -1
      //   )  
      //   diff.forEach((element) => {
      //     this.all_affiliates.filter((key) => {
      //       if(key.affiliate_id == element.affiliate_id) {
      //         key.send = false
      //       }
      //     })
      //   })
      // }                      
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
      // this.applicationProcess(this.parameters, false)   
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
          this.$toast.warning('¡El cuerpo del mensae no puede estar vacío!');
        } else {          
          this.$toast.warning('¡No hay afiliados para notificar!');
        } 
        this.dialog_send_notification = false
      } else {
        this.dialog_send_notification = true
      }
    },
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