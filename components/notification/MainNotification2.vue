<template>
  <v-container fluid>

    <v-card-title mb-4>
      <v-toolbar dense color="tertiary" class="caption">
        <GlobalBreadCrumb />
      </v-toolbar>
    </v-card-title>

    <v-tabs v-model="tab" left background-color="notificationCard" class="px-4">
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="mx-4 my-2 notificationCard">
      <v-tab-item v-for="item in items" :key="item">
        <v-row>
          <v-col class="ma-4">
            <v-row>
              
              <!-- filtros -->
              <v-col cols="12" md="3">
                <v-card class="px-5 py-6 elevation-0">
                  <v-select    
                    v-model="action" 
                    :items="actions"
                    item-text="shortened"
                    item-value="id"
                    label="Acción"
                    @change="(value) => changeStateAction(value)"    
                    background-color="#E7F6FE"
                    color="#318058"                             
                    outlined
                    dense
                  ></v-select>
                  <v-select
                    v-show="flag_payment_method"
                    v-model="payment_method"
                    :items="modalities_payment"
                    item-text="name"
                    item-value="id"
                    label="Método de pago"
                    background-color="#E7F6FE"
                    color='#318058'
                    @change="(value) => changeStatePaymentMethod(value)"
                    outlined
                    dense
                  ></v-select>
                  <v-select
                    v-show="flag_observation"
                    v-model="observation"
                    :items="observations"
                    item-text="shortened"
                    item-value="id"
                    label="Tipo Observación"
                    background-color="#E7F6FE"
                    outlined
                    dense
                  ></v-select>
                  <!--  @change="(value) => changeStateObservation(value)"-->
                  <v-select                    
                    v-model="semester"
                    :items="semesters"
                    :disabled="check || check_2"
                    item-text="period"
                    item-value="id"                    
                    :label="check ? 'Todos' : (check_2 ? semesters[semesters.length - 1].period : 'Semestre')"                    
                    :hint="check || check_2 ? 'Semestre' : ''"
                    persistent-hint
                    outlined
                    item-color="purple"   
                    background-color="#E7F6FE"  
                    @change="(value) => changeStateObservation(value)"
                    color="purple"               
                    dense
                  ></v-select>
                  <v-select                    
                    v-model="beneficiary"
                    :items="beneficiaries"
                    :disabled="check || check_3 || check_4"
                    item-text="name"
                    item-value="id"
                    :label="check ? beneficiaries[0].name : (check_3 ? beneficiaries[0].name : 'Tipo beneficiario')"
                    :hint="check ? 'Tipo beneficiario' : ''"
                    background-color="#E7F6FE"
                    @change="(value) => changeStateModality(value)"
                    persistent-hint
                    outlined
                    dense
                  ></v-select>
                  <v-select
                    v-model="hierarchie"
                    :items="hierarchies"
                    :disabled="check || check_3 || (beneficiary === 0 ) || check_4"
                    item-text="name"
                    item-value="id"
                    :label="check ? hierarchies[0].name : (check_3 ? hierarchies[0].name :'Nivel jerárquico')"
                    outlined
                    dense
                    :hint="check ? 'Nivel jerárquico' : ''"
                    background-color="#E7F6FE"
                    persistent-hint
                    @change="(value) => changeStateHierarchies(value)"
                  ></v-select>                  
                </v-card>
              </v-col>

              <!-- área de redacción -->
              <v-col cols="12" md="6">
                <v-card class="pa-2 elevation-0">
                  <transition-group name="list" tag="div">
                    <drag
                      class="drag"
                      v-for="n in params"
                      :key="n"
                      :data="n"
                      @cut="remove(n)"
                    >{{ n.param }}</drag>
                  </transition-group>
                </v-card>

                <v-card class="pa-5 mt-4 elevation-0">
                  <div>
                    <drop @drop="onCopyDrop">
                      <v-textarea
                        label="Cuerpo del mensaje"
                        v-model="text"
                        background-color=""
                        color="cyan"
                        outlined
                        ></v-textarea>
                    </drop>
                  </div>
                </v-card>
              </v-col>

              <!-- pre visualizador -->
              <v-col cols="12" md="3">
                <v-card ma-3 elevation="0" tile>
                  <v-card class="text-center" height="25" color="#516E84">
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
                    max-height="330"
                  >
                    <v-card-text>
                      <h2 class="text-h6 primary--text">Comunicado</h2>
                      <h3 class="secundary--text">Complemento Económico</h3>
                      <!-- <v-divider></v-divider> -->
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
                        @click="show()"
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

        <!-- table -->
        <v-card color="#f3f3f3" class="ma-4 elevation-0">
          <v-tooltip top >
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                @click="clearAll()"
                color="table"
                v-on="on"
                x-small
                absolute
                right
                style="margin-top: 5px; margin-right:50px; color: white;"
              >
                <v-icon> mdi-broom </v-icon>
              </v-btn>
            </template>
            <span class="caption">Limpiar todos los filtros</span>
          </v-tooltip>
          <v-data-table
            dense
            class="inputSearch px-10 pt-12"
            :headers="headers"
            :items="affiliates"
            :options.sync="options"
            :server-items-length="total_affiliates"
            :footer-props="{ itemsPerPageOptions: [8, 15, 50, 100]}"
            :loading="loading_table"
          >
            <template v-slot:[`header.nup_affiliate`]="{ header }">
              <span :class="searching.nup_affiliate? 'primary--text' : ''">{{ header.text }}</span>
            </template>

            <template v-slot:[`header.full_name_affiliate`]="{ header }">
              <span :class="searching.full_name_affiliate? 'primary--text' : ''">{{ header.text }}</span>
            </template>

            <template v-slot:[`header.identity_card_affiliate`]="{ header }">
              <span :class="searching.identity_card_affiliate? 'primary--text' : ''">{{ header.text }}</span>
            </template>

            <template v-slot:[`header.name_degree`]="{ header }">
              <span :class="searching.name_degree? 'primary--text' : ''">{{ header.text }}</span>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-checkbox
                v-model="item.send"
                color="indigo"
                :value="item.send"
                @click="updateStateSend(item.send, item.affiliate_id)"
                hide-details
              ></v-checkbox>
            </template>

            <template slot="body.prepend">
              <tr>
                <td><v-text-field placeholder="NUP afiliado" spellcheck="false" class="filter-text" v-model="searching.nup_affiliate" ></v-text-field></td>
                <td><v-text-field placeholder="Apellido paterno" spellcheck="false" class="filter-text" v-model="searching.last_name" ></v-text-field></td>
                <td><v-text-field placeholder="Apellido materno" spellcheck="false" class="filter-text" v-model="searching.mothers_last_name" ></v-text-field></td>
                <td><v-text-field placeholder="Primer nombre" spellcheck="false" class="filter-text" v-model="searching.first_name" ></v-text-field></td>
                <td><v-text-field placeholder="Segundo nombre" spellcheck="false" class="filter-text" v-model="searching.second_name"></v-text-field></td>
                <td><v-text-field placeholder="Carnet de identidad" spellcheck="false" class="filter-text" v-model="searching.identity_card_affiliate" ></v-text-field></td>
                <td><v-text-field disabled class="filter-text"></v-text-field></td>
              </tr>
            </template>
          
          </v-data-table>
        </v-card>

      </v-tab-item>
    </v-tabs-items>

  </v-container>
</template>


<script>
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";
import { Drag, Drop } from "vue-easy-dnd";

export default {
  name: "MainNotification2",
  components: {
    GlobalBreadCrumb,
    Drag,
    Drop
  },
  mounted() {
    this.getActions()
    this.getMethodsPayments()
    this.getSemesters()
    this.getHierarchies()
    this.getObservations()
    this.getBeneficiaries()
  },
  data: () => ({
    scrollInoked: 0,
    tab: null,
    items: ["Notificación App", "SMS's"],
    id: 6,
    module_id: 2, // id del modulo
    // ====================== filtros =======================
    actions: [],
    modalities_payment: [],
    semesters: [],
    hierarchies: [],
    observations: [],
    beneficiaries: [],
    // ==================== fin filtros =====================
    params: [
      {
        param: "nombre",
        value: "{{nombre}}"
      }, 
      {
        param: "grado",
        value: "{{grado}}"
      }, 
      {
        param: "carnet",
        value: "{{carnet}}"
      }, 
      {
        param: "fecha",
        value: "{{fecha}}"
      }
    ],
    copied: [],
    // ====================== tabla  ========================
    headers: [
      { text: 'NUP', value:'affiliate_id', class:['table', 'white--text'], width: '5%', sortable: false},
      { text: 'Apellido Paterno', value:'last_name', class:['table', 'white--text'], width: '5%', sortable: false},
      { text: 'Apellido Materno', value:'mothers_last_name', class:['table', 'white--text'], width: '5%', sortable: false},
      { text: 'Primer Nombre', value:'first_name', class:['table', 'white--text'], width: '5%', sortable: false},
      { text: 'Segundo Nombre', value:'second_name', class:['table', 'white--text'], width: '5%', sortable: false},
      { text: 'Carnet Identidad', value:'identity_card', class:['table', 'white--text'], width: '5%', sortable: false},
      { text: 'Acción', value:'actions', class:['table', 'white--text'], width: '5%', sortable: false},
    ],
    searching: {
      nup_affiliate: "",
      full_name_affiliate: "",
      identity_card_affiliate: "",
      name_degree: "",
    },
    // ==================== fin tabla =======================

    // values select (podemos volverlo un array)
    action:"",
    payment_method:"",
    semester:"",
    hierarchie:"",
    observation:"",
    beneficiary:"", // viudedad, orfandad, vejez

    flag_payment_method:false,
    flag_observation:false,

    // mensajes
    text: "",
    check: false, // recepción de requisitos
    check_2: false, // pago complemento económico
    check_3: false,
    check_4: false,

    // Table
    affiliates: [],
    options: {
      page: 1,
      itemsPerPage: 8,
    },
    total_affiliates: 0,
    loading_table: false,
    all_affiliates: [],
    aux: [],

  }),
  watch:{
    options: function (newVal, oldVal) {
      if (
        newVal.page != oldVal.page ||
        newVal.itemsPerPage != oldVal.itemsPerPage
      ) {
        this.receiptOfRequirements(false)
        this.paymentMethod(false)
        this.modality(false)
        this.hierarchies2(false)
        this.observation22(false)
      }
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
        this.modalities_payment .unshift({id: 0, name: "Todos"})
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
        // this.semesters.unshift({id: 0, period: "Todos"})
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
        this.hierarchies.unshift({id: 0, name: "TODOS"})
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
          '/notification/get_beneficiary_type',
          undefined
        );
        this.beneficiaries = response.beneficiary_type;
        this.beneficiaries.unshift({id: 0, name: "todos"})
      } catch(e) {
        console.log(e)
      }
    },
    async receiptOfRequirements(flag = true) {
      try{
        this.loading_table = true;
        let response = await this.$axios.post("/notification/list_to_notify", {
          action: this.action,
          first: flag,
          page: this.options.page,
          per_page: this.options.itemsPerPage,
        })
        this.all_affiliates = flag ? this.preProcessData(response.all) : this.all_affiliates 
        this.dataSync(response)
        this.total_affiliates = response.data.total
        this.options.page = response.data.current_page
        this.options.itemsPerPage = parseInt(response.data.per_page)
        this.loading_table = false
      } catch(e){
        this.loading_table = false
        console.log(e)
      }
    },
    async paymentMethod(flag = true) {
      try{
        this.loading_table = true
        let response = await this.$axios.post("/notification/list_to_notify", {
          action: this.action,
          payment_method: this.payment_method,
          first: flag,
          page: this.options.page,
          per_page: this.options.itemsPerPage,

        })
        this.all_affiliates = flag ? this.preProcessData(response.all) : this.all_affiliates 
        this.dataSync(response)
        this.total_affiliates = response.data.total
        this.options.page = response.data.current_page
        this.options.itemsPerPage = parseInt(response.data.per_page)
        this.loading_table = false
      } catch(e) {
        this.loading_table = false
        console.log(e)
      }
    },
    async modality(flag = true) {
      try {
        this.loading_table = true
        let response = await this.$axios.post("/notification/list_to_notify", {
          action: this.action,
          payment_method: this.payment_method,
          modality: this.beneficiary,
          first: flag,
          page: this.options.page,
          per_page: this.options.itemsPerPage,
        })
        this.all_affiliates = flag ? this.preProcessData(response.all) : this.all_affiliates 
        this.dataSync(response)
        this.total_affiliates = response.data.total
        this.options.page = response.data.current_page
        this.options.itemsPerPage = parseInt(response.data.per_page)
        this.loading_table = false;
      } catch(e) {
        this.loading_table = false;
        console.log(e)
      }
    },
    async hierarchies2(flag = true) {
      try {
        this.loading_table = true
        let response = await this.$axios.post("/notification/list_to_notify", {
          action: this.action,
          payment_method: this.payment_method,
          modality: this.beneficiary,
          hierarchies: this.hierarchie,
          first: flag,
          page: this.options.page,
          per_page: this.options.itemsPerPage,
        })
        this.all_affiliates = flag ? this.preProcessData(response.all) : this.all_affiliates 
        this.dataSync(response)
        this.total_affiliates = response.data.total
        this.options.page = response.data.current_page
        this.options.itemsPerPage = parseInt(response.data.per_page)
        this.loading_table = false;
      } catch(e) {
        this.loading_table = false;
        console.log(e)
      }
    },
    async observation22(flag = true) {
      try {
        if(this.semester != "") {
        this.loading_table = true
            console.log("entra true")
          let response = await this.$axios.post("/notification/list_to_notify", {
            action: this.action,
            type_observation: this.observation,
            semester_id: this.semester, // id
            first: flag,
            page: this.options.page,
            per_page: this.options.itemsPerPage,
          })
          this.all_affiliates = flag ? this.preProcessData(response.all) : this.all_affiliates 
          this.dataSync(response)
        //   console.log(this.all_affiliates)
          this.total_affiliates = response.data.total
          this.options.page = response.data.current_page
          this.options.itemsPerPage = parseInt(response.data.per_page)
          this.loading_table = false;
        } else console.log("entra false")
      } catch(e) {
        this.loading_table = false;
        console.log(e)
      }
    },
    onScroll() {
      this.scrollInvoked++;
    },
    onCopyDrop(e) {      
      this.text += " " + e.data.value + " "
      this.copied.push(e.data);
    },
    show() {
      this.$swal("Notificado!", "Se ha notificado con exito!", "success");
    },
    resetValues() {
      this.payment_method = this.semester = this.hierarchie = this.observation = this.beneficiary = ""
    },
    changeStateAction(value) {
      switch(value) {
        case 1: // si es recepción de requisitos
          this.resetValues()
          this.flag_payment_method = false
          this.flag_observation = false    
          this.check = true
          this.check_2 = false
          this.check_4 = false
          this.receiptOfRequirements()            
          break;
        case 2: // si es pago de complemento económico
          this.resetValues()
          this.flag_payment_method = true
          this.flag_observation = false
          this.check = false
          this.check_2 = true
          this.semester = this.semesters[this.semesters.length - 1].id
          this.check_4 = false
          break;
        case 3: // Si es observaciones
          this.resetValues()
          this.flag_payment_method = false 
          this.flag_observation = true
          this.check = false    
          this.check_2 = false 
          this.check_4 = true  
          break;
      }
    },
    changeStatePaymentMethod(value) {
        if(value == 0){
          this.hierarchie = this.observation = this.beneficiary = "";
          this.check_3 = true;
        } else {
          this.check_3 = false;
        }
        this.paymentMethod()
    },
    changeStateModality(value) {
        if(value === 0) this.hierarchie = "" 
        this.modality()
    },
    changeStateHierarchies(value) {
        this.hierarchies2()
    },
    changeStateObservation(value) {
        console.log("semestre " + this.semester)
        console.log("observación " + this.observation)
      this.beneficiary = this.hierarchie = ""
      this.observation22()
    },
    updateStateSend(send, affiliate_id) {
        this.all_affiliates.some(element => {
            if(element.affiliate_id == affiliate_id) {
                element.send = send ?? false;
                return
            }
        })
    },
    preProcessData(array) {
        array.forEach(element => {
            element.send = true
        });
        return array
    },
    dataSync(response) {
        this.affiliates = this.preProcessData(response.data.data)
        if(this.all_affiliates.length) {
            this.affiliates.forEach(element => {
                this.all_affiliates.filter(function(key) {
                    if(key.affiliate_id == element.affiliate_id) {
                        element.send = key.send
                    }
                })
            })
        }
        // console.log(this.all_affiliates)
    }
  },
};
</script>
<style scoped>
  .drag {
      width: 78px;
      height: 30px;
      background-color: rgb(94, 164, 72);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0px 0px 0 30px;
      font-size: 20px;
      transition: all 0.5s;
      border-radius: 5px;
      color: white;
    }
  .group {
      display: flex;
  }
</style>