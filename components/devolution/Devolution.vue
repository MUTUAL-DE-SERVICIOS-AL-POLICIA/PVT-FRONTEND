<template>
   <v-container fluid>
      <v-row v-if="permissionSimpleSelected.includes('read-economic-complement-movement')">
         <v-col>
            <v-toolbar-title>DEVOLUCIONES</v-toolbar-title>
         </v-col>
         <v-col cols="6" class="text-right">
            <v-spacer></v-spacer>
            <!-- BOTÓN DE REGISTRO DE LA DEUDA -->
            <v-tooltip top>
               <template v-slot:activator="{ on }">
                  <v-btn
                     x-small
                     color="success"
                     class="mr-3 ml-0 pa-4"
                     v-on="on"
                     elevation="2"
                     @click="openRegisterDue()"
                     v-if="permissionSimpleSelected.includes('create-due-economic-complement-movement')"
                  >
                     <v-icon>mdi-plus</v-icon> Registrar deuda
                  </v-btn>
               </template>
               <div>
                  <span>Registrar una deuda</span>
               </div>
            </v-tooltip>
            <!-- BOTÓN DE REGISTRO DE PAGO -->
            <v-tooltip top>
               <template v-slot:activator="{ on }">
                  <v-btn
                     x-small
                     color="info"
                     class="mr-3 ml-0 pa-4"
                     v-on="on"
                     elevation="2"
                     @click="openRegisterAmount()"
                     :disabled="isRegisterDisabled"
                     v-if="permissionSimpleSelected.includes('create-direct-payment-economic-complement-movement')"
                  >
                     <v-icon>mdi-plus</v-icon> Registrar pago
                  </v-btn>
               </template>
               <div>
                  <span>Registrar un pago</span>
               </div>
            </v-tooltip>
         </v-col>
         <v-col cols="12" class="pt-0">
            <v-data-table
               :headers="headers"
               :items="indexedMovements"
               :options.sync="options"
               single-expand
               :footer-props="{
                  showFirstLastPage: true,
                  firstIcon: 'mdi-arrow-collapse-left',
                  lastIcon: 'mdi-arrow-collapse-right',
                  prevIcon: 'mdi-minus',
                  nextIcon: 'mdi-plus',
                  'items-per-page-text': 'Filas por página',
                  itemsPerPageOptions: [10, 20, 30, 100]
               }"
               :loading="loading_table"
               no-data-text="No hay datos disponibles"
            >
               <template v-slot:item="props">
                  <tr :class="props.isExpanded ? 'secondary white--text pointer-row': 'pointer-row'" >
                     <td @click.stop="expand(props)">{{ props.item.correlative }}</td>
                     <td @click.stop="expand(props)">{{ props.item.description }}</td>
                     <td @click.stop="expand(props)">{{ props.item.amount }}</td>
                     <td @click.stop="expand(props)">{{ props.item.balance }}</td>
                     <td @click.stop="expand(props)">{{ props.item.created_at }}</td>
                     <td>
                        <v-tooltip bottom v-if="props.item.index === movements.length - 1" >
                           <template v-slot:activator="{ on }">
                              <v-btn
                                 icon
                                 small
                                 v-on="on"
                                 @click="openDeleteMovement()"
                                 color="error"
                              >
                                 <v-icon>mdi-delete</v-icon>
                              </v-btn>
                           </template>
                           <span>Eliminar registro</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="props.item.description == 'DEUDA'">
                           <template v-slot:activator="{ on }">
                              <v-btn
                                 icon
                                 small
                                 v-on="on"
                                 @click="openPaymentCommitmentRecord(props.item.id)"
                                 color="success"
                              >
                                 <v-icon>mdi-file-plus</v-icon>
                              </v-btn>
                           </template>
                           <span>Crear compromiso de pago</span>
                        </v-tooltip>
                     </td>
                  </tr>
               </template>
               <template v-slot:expanded-item="{ item }">
                  <tr v-if="item.description == 'DEUDA'">
                     <td :colspan="6" class="px-0">
                        <v-data-table
                           :items="detail"
                           :hide-default-footer="true"
                           :loading="loading_sub_table"
                        >
                           <template v-slot:body="{ items }">
                              <tbody>
                                 <tr>
                                    <td v-for="header in headers_dues" :key="header.nro" class="font-weight-bold tertiary">
                                       {{  header.text }}
                                    </td>
                                 </tr>
                                 <tr v-for="it in items" :key="it.correlative" style="background-color: #EBEFF1;">
                                    <td>{{ it.correlative }}</td>
                                    <td>{{ it.amount }}</td>
                                    <td>{{ it.name }}</td>
                                 </tr>
                              </tbody>
                           </template>
                        </v-data-table>
                     </td>
                  </tr>
                  <tr v-else-if="item.description == 'PAGO MEDIANTE TRÁMITE'">
                     <td :colspan="6" class="px-0">
                        <v-data-table
                           :items="detail"
                           :hide-default-footer="true"
                           :loading="loading_sub_table"
                        >
                           <template v-slot:body="{ items }">
                              <tbody>
                                 <tr>
                                    <td v-for="(header, index) in headers_payment_through_process" :key="index" class="font-weight-bold tertiary">
                                       {{ header.text }}
                                    </td>
                                 </tr>
                                 <tr v-for="(it,index) in items" :key="index" style="background-color: #EBEFF1">
                                    <td>{{ it.procedure }}</td>
                                 </tr>
                              </tbody>
                           </template>
                        </v-data-table>
                     </td>
                  </tr>
                  <tr v-else>
                     <td :colspan="6" class="px-0">
                        <v-data-table
                           :items="detail"
                           :hide-default-footer="true"
                           :loading="loading_sub_table"
                        >
                           <template v-slot:body="{ items }">
                              <tbody>
                                 <tr>
                                    <td v-for="(header, index) in headers_direct_payments" :key="index" class="font-weight-bold tertiary">
                                       {{  header.text }}
                                    </td>
                                 </tr>
                                 <tr v-for="(it, index) in items" :key="index" style="background-color: #EBEFF1">
                                    <td>{{ it.voucher }}</td>
                                    <td>{{ it.payment_date }}</td>
                                 </tr>
                              </tbody>
                           </template>
                        </v-data-table>
                     </td>
                  </tr>
               </template>
            </v-data-table>
         </v-col>
      </v-row>
      <!-- REGISTRO DE DEUDA -->
      <v-dialog v-model="dialog_register_due" width="600">
         <v-card>
            <v-card-text>
               <v-container>
                  <v-form ref="forRegisterDue">
                     <v-row>
                        <v-col cols="12">
                           <v-toolbar-title>REGISTRO DE UNA DEUDA</v-toolbar-title>
                        </v-col>
                        <v-col cols="12" md="4">
                           <v-text-field
                              v-model="amount_due"
                              dense
                              label="Monto de la deuda"
                              :rules="[
                                 $rules.obligatoriaExcluyendoCero(),
                                 $rules.soloNumeros('Debe ser un número')
                              ]"
                           >
                           </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                           <v-select
                              v-model="selectedSemester"
                              dense
                              :items="semesters"
                              item-text="name"
                              item-value="id"
                              label="Semestre"
                              :rules="[
                                 $rules.obligatoria('Semestre')
                              ]"
                           >
                           </v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                           <v-btn
                              icon
                              small
                              color="info"
                              outlined
                              @click="validateFormDue()"
                           >
                              <v-icon class="text-center">mdi-plus</v-icon>
                           </v-btn>
                        </v-col>
                     </v-row>
                     <v-row>
                        <v-col cols="12">
                           <v-data-table
                              dense
                              :headers="headers_dues"
                              :items="duesWithNro"
                              no-data-text="No hay datos disponibles"
                              hide-default-footer
                           ></v-data-table>
                        </v-col>
                     </v-row>
                  </v-form>
               </v-container>
            </v-card-text>
            <v-card-actions>
         <v-spacer></v-spacer>
               <v-btn color="error" text @click="reset()">Cerrar</v-btn>
               <v-btn
                  color="success"
                  @click="postRegisterDues()"
                  :disabled="dues.length === 0"
               >
                REGISTRAR
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
      <!-- REGISTRO DE PAGO -->
      <v-dialog v-model="dialog_register_amount" width="600">
         <v-card>
            <v-card-text>
               <v-container>
                  <v-form ref="forRegisterPayment">
                     <v-row>
                        <v-col cols="12">
                           <v-toolbar-title>REGISTRO DE PAGO</v-toolbar-title>
                        </v-col>
                        <v-col cols="12" md="4">
                           <v-text-field
                        dense
                              label="Monto del pago"
                              :rules="[
                                 $rules.obligatoriaExcluyendoCero(),
                                 $rules.soloNumeros('Monto')
                           ]"
                              v-model="amount_payment"
                           >
                           </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                           <v-text-field
                              dense
                              label="Nro de comprobante"
                              :rules="[
                                 $rules.obligatoria('Nro de comprobante')
                              ]"
                              v-model="voucher_payment"
                           >
                           </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                           <v-menu
                              ref="menu"
                              v-model="menu"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                           >
                              <template v-slot:activator="{ on, attrs }">
                                 <v-text-field
                                    dense
                                    v-model="selected_date"
                                    label="Fecha del pago"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    :rules="[
                                       $rules.obligatoria('Fecha de pago')
                                    ]"
                                 ></v-text-field>
                              </template>
                              <v-date-picker
                                 v-model="selected_date"
                                 no-title
                                 @input="menu = false"
                              ></v-date-picker>
                           </v-menu>
                        </v-col>
                     </v-row>
                  </v-form>
               </v-container>
               <v-spacer></v-spacer>
            </v-card-text>
            <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="error" text @click="reset()">Cerrar</v-btn>
               <v-btn
                  color="success"
                  @click="validateFormPayment()"
               >
                REGISTRAR
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
      <!-- ELIMINACIÓN -->
      <v-dialog v-model="dialog_delete_movement" width="400">
         <v-card>
            <v-card-title>
               ¿Está seguro de realizar esta acción?
            </v-card-title>
            <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="error" @click="deletedMovement()">Eliminar</v-btn>
               <v-btn color="success" @click="dialog_delete_movement = false">Cancelar</v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
      <!-- REGISTRO DEL COMPROMISO DE PAGO -->
      <v-dialog v-model="dialog_payment_commitment_record" width="600">
         <v-card>
            <v-card-text>
               <v-container>
                  <v-form ref="forRegisterCommited">
                     <v-row>
                        <v-col cols="12">
                           <v-toolbar-title>CREAR COMPROMISO DE PAGO</v-toolbar-title>
                        </v-col>
                        <v-col cols="12" md="4">
                           <v-select
                              v-model="selected_percentage"
                              dense
                              :items="percentages"
                              item-text="percentage"
                              item-value="percentage_value"
                              label="Porcentaje para amortizar"
                              :rules="[
                                 $rules.obligatoria('Porcentage')
                              ]"
                           >
                           </v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                           <v-select
                              v-model="selectedSemester"
                              dense
                              :items="semesters"
                              item-text="name"
                              item-value="id"
                              label="Gestión de inicio de pago de deuda"
                              :rules="[
                                 $rules.obligatoria('Semestre')
                              ]"
                           >
                           </v-select>
                        </v-col>
                     </v-row>
                  </v-form>
               </v-container>
            </v-card-text>
            <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="error" text @click="reset()">Cerrar</v-btn>
               <v-btn
                  color="success"
                  @click="validatePaymentCommitement()"
               >
                  CREAR
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </v-container>
</template>

<script>
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";
export default {
   name: "Devolution",
   components: {
      GlobalBreadCrumb
   },
   props: {
      affiliate: {
         type: String,
         required: true,
         default: null
      }
   },
   data: () => ({
      loading_table: false,
      loading_sub_table: false,
      headers: [
         {
            text: "NRO.",
            value: "correlative",
            class: ["table", "white--text"],
         },
         {
            text: "TIPO",
            value: "description",
            class: ["table", "white--text"]
         },
         {
            text: "MONTO",
            value: "amount",
            class: ["table", "white--text"]
         },
         {
            text: "BALANCE",
            value: "balance",
            class: ["table", "white--text"]
         },
         {
            text: "FECHA",
            value: "created_at",
            class: ["table", "white--text"]
         },
         {
            text: "ACCIÓN",
            value: "actions",
            input: '',
            menu: false,
            type: "text",
            class: ["table", "white--text", "text-md-center"],
            align: "center",
            sortable: false
         }
      ],
      headers_dues: [
         {
            text: 'NRO',
            value: 'nro',
            class: ["font-weight-bold tertiary"]
         },
         {
            text: "MONTO",
            value: 'amount',
            class: ["font-weight-bold tertiary"]
         },
         {
            text: "SEMESTRE",
            value: 'name',
            class: ["font-weight-bold tertiary"]
         },
      ],
      headers_direct_payments: [
         {
            text: "COMPROBANTE",
            value: "voucher",
            class: ["table", "white--text"]
         },
         {
            text: "FECHA DE PAGO",
            value: "payment_date",
            class: ["table", "white--text"]
         }
      ],
      headers_payment_through_process: [
         {
            text: "SEMESTRE",
            value: "procedure",
            class: ["table", "white--text"]
         }
      ],
      percentages: [
         {
            percentage: '10%',
            percentage_value: 0.1
         },
         {
            percentage: '20%',
            percentage_value: 0.2
         },
         {
            percentage: '30%',
            percentage_value: 0.3
         },
         {
            percentage: '40%',
            percentage_value: 0.4
         },
         {
            percentage: '50%',
            percentage_value: 0.5
         },
         {
            percentage: '60%',
            percentage_value: 0.6
         },
         {
            percentage: '70%',
            percentage_value: 0.7
         },
         {
            percentage: '80%',
            percentage_value: 0.8
         },
         {
            percentage: '90%',
            percentage_value: 0.9
         },
         {
            percentage: '100%',
            percentage_value: 1
         },
      ],
      dues: [],
      detail: [],
      movements: [],
      semesters: [],
      amount_due: null,
      amount_payment: null,
      voucher_payment: null,
      percentage: null,
      movement_id: null,
      selected_date: null,
      menu: false,
      options: {
         page: 1,
         itemsPerPage: 10,
      },
      dialog_register_amount: false,
      dialog_register_due: false,
      dialog_delete_movement: false,
      dialog_payment_commitment_record: false,
      selectedSemester: null,
      selected_semester_id: null,
      selected_semester_name: null,
      selected_percentage: null,
      expanded: []
   }),
   computed: {
      duesWithNro() {
         return this.dues.map((due, index) => {
            return {
               nro: index + 1,
               ...due
            }
         })
      },
      indexedMovements() {
         return this.movements.map((item, index) => ({
            ...item,
            index
         }))
      },
      lastItem() {
         if(this.movements.length > 0) {
            return this.movements[this.movements.length - 1]
         }
         return null
      },
      isRegisterDisabled() {
         return this.lastItem && this.lastItem.balance === '0.00'
      },
      permissionSimpleSelected() {
         return this.$store.getters.permissionSimpleSelected
      }
   },
   mounted() {
      this.getSemesters()
      this.getMovements()
   },
   watch: {
      options: function (newVal, oldVal) {
         if(
            newVal.page != oldVal.page ||
            newVal.itemsPerPage != oldVal.itemsPerPage
         ) {
            this.getMovements()
         }
      },
      selectedSemester: {
         handler(newVal) {
            const selected = this.semesters.find(semester => semester.id === newVal)
            if(selected) {
               this.selected_semester_id = selected.id
               this.selected_semester_name = selected.name
            } else {
               this.selected_semester_id = null
               this.selected_semester_name = null
            }
         }
      }
   },
   methods: {
      async postRegisterDues() {
         this.dialog_register_due = true
         try {
            let response = await this.$axios.post(
               "/economic_complement/register_devolution",
               {
                  affiliate_id: this.affiliate,
                  dues: this.dues
               }
            )
            const error = response.error
            const message = response.message
            if(!error) {
               this.getMovements()
               this.$toast.success(message)
            } else this.$toast.error(message)
            this.reset()
         } catch(e) {
            this.$toast.error(
               "Ocurrió un error durante el registro."
            )
            console.log(e)
         } finally {
            this.dialog_register_due = false
         }
      },
      async getMovements() {
         try {
            this.loading_table = true
            let response = await this.$axios.get(
               `/economic_complement/movement_list/${this.affiliate}`
            )
            const error = response.error
            if(!error) {
               this.movements = response.payload.movements
            }
         } catch(e) {
            this.$toast.error(
               "Ocurrió un error al obtener los movimientos."
            )
            console.log(e)
         } finally {
            this.loading_table = false
         }
      },
      async getSemesters() {
         try {
            let response = await this.$axios.get(
               `/economic_complement/eco_com_procedure_list`
            )
            const error = response.error
            if(!error) {
               this.semesters = response.payload.eco_com_procedures
            }
         } catch(e) {
            console.log(e)
            this.$toast.error(
               "Ocurrió un error al obtener los semestres."
            )
         }
      },
      async deletedMovement() {
         try {
            let response = await this.$axios.delete(
               `/economic_complement/delete_movement/${this.affiliate}`
            )
            const error = response.error
            const message = response.message
            if(!error) {
               this.getMovements()
               this.$toast.success(message)
            } else this.$toast.error(message)
            this.reset()
         } catch(e) {
            this.$toast.error("Ocurrió una eliminación durante la eliminación.")
             console.log(e)
         }
      },
      async saveRegisterMovement() {
         try {
            let response = await this.$axios.post(
               "/economic_complement/register_direct_payment",
               {
                  affiliate_id: this.affiliate,
                  amount: this.amount_payment,
                  voucher: this.voucher_payment,
                  payment_date: this.selected_date
               }
            )
            const error = response.error
            const message = response.message
            if(!error) {
               this.resetPayment()
               this.getMovements()
               this.$toast.success(message)
            } else this.$toast.error(message)
         } catch(e) {
            this.$toast.error(
               "Ocurrió un error durante el registro."
            )
         } finally {
         }
      },
      async getDues(movement_id) {
         try {
            this.loading_sub_table = true
            let response = await this.$axios.get(
               `/economic_complement/show_dues/${movement_id}`
            )
            const error = response.error
            if(!error) {
               this.detail = response.payload.detail
            }
         } catch(e) {
            console.log(e)
         } finally {
            this.loading_sub_table = false
         }
      },
      async postRegisterCommited() {
         try {
            let response = await this.$axios.patch(
               `/economic_complement/register_payment_commitement/${this.movement_id}`,
               {
                  percentage: this.selected_percentage,
                  start_eco_com_procedure_id: this.selectedSemester
               }
            )
            const error = response.error
            const message = response.message
            if(!error) this.$toast.success(message)
            else this.$toast.error(message)
            this.reset()
         } catch(e) {
            this.$toast.error(
               "Ocurrió un error durante el registro."
            )
            console.log(e)
         }
      },
      openRegisterDue() {
         this.dialog_register_due = true
      },
      openRegisterAmount() {
         this.dialog_register_amount = true
      },
      openDeleteMovement() {
         this.dialog_delete_movement = true
      },
      openPaymentCommitmentRecord(movement_id) {
         this.movement_id = movement_id
         this.dialog_payment_commitment_record = true
      },
      reset() {
         this.dialog_register_amount = false
         this.dialog_register_due = false
         this.dialog_delete_movement = false
         this.dialog_payment_commitment_record = false
         this.dues = []
         this.resetPayment()
         this.resetDue()
      },
      validateFormDue() {
         if(this.$refs.forRegisterDue) {
            if(this.$refs.forRegisterDue.validate()) {
               this.addDebtToRecord()
            }
         }
      },
      validateFormPayment() {
         if(this.$refs.forRegisterPayment) {
            if(this.$refs.forRegisterPayment.validate()) {
               this.saveRegisterMovement()
            }
         }
      },
      addDebtToRecord() {
         const newDue = {
            amount: this.amount_due,
            eco_com_procedure_id: this.selected_semester_id,
            name: this.selected_semester_name
         }
         this.dues.push(newDue)
         this.resetDue()
      },
      resetDue() {
         this.amount_due = null
         this.selectedSemester = null
         this.selected_semester_id = null
         this.selected_semester_name = null
      },
      resetPayment() {
         this.dialog_register_amount = false
         this.amount_payment = null
         this.voucher_payment = null
      },
      expand(props) {
         this.getDues(props.item.id)
         props.expand(!props.isExpanded)
      },
      validatePaymentCommitement() {
         if(this.$refs.forRegisterCommited) {
            if(this.$refs.forRegisterCommited.validate()) {
               this.postRegisterCommited()
            }
         }
      },
   }
}

</script>
<style scoped>
.pointer-row {
   cursor: pointer;
}
</style>