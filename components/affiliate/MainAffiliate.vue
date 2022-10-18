<template>
  <v-container fluid>
    <v-card flat>
      <v-card-title>
        <v-toolbar dense color="tertiary" class="caption">
          <v-row>
            <v-col cols="12" class="pa-0">
              Listado de afiliados
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-icon>mdi-arrow-right-bold-box</v-icon>
                Datos del afiliado
            </v-col>
          </v-row>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  v-bind="attrs"
                  v-on="on"
                   @click="getState_cellphone()"
                  color="success"
                >
                  <v-toolbar-title v-if="!editable"> ASIGNAR CREDENCIALES</v-toolbar-title>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click.stop="saveAffiliate()"
                  :color="editable ? 'success' : 'secondary'"
                >
                  <v-toolbar-title v-if="!editable"> EDITAR</v-toolbar-title>
                  <v-toolbar-title v-else> Confirmar</v-toolbar-title>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="error"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  v-show="editable"
                  @click.stop="resetForm()"
                >
                  <v-toolbar-title> cancelar</v-toolbar-title>
                </v-btn>
            </template>
            <span>EDITAR</span>
            </v-tooltip>
        </v-toolbar>
      </v-card-title>
      <v-card-text>

      <v-tabs
        :vertical="true"
      >
        <v-card color="backgroundCard" >
          <v-card-text>
            <v-row>
              <v-col cols="12" md="12" align="center">
                <h2> {{affiliate.full_name}}</h2><br>
                <strong>C.I.:  </strong> {{affiliate.identity_card}}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-tabs-slider></v-tabs-slider>
        <v-tab class="backgroundTab"
          :href="`#tab-1`"
        >
        DASHBOARD
        </v-tab>
        <v-tab class="backgroundTab"
          :href="`#tab-2`"
        >
        DATOS PERSONALES DEL AFILIADO
        </v-tab>
        <v-tab  class="backgroundTab"
          :href="`#tab-3`"
        >
        INFORMACION ADICIONAL
        </v-tab>
        <v-tab  class="backgroundTab"
          :href="`#tab-4`"
        >
        INFORMACION CONYUGE
        </v-tab>
        <v-tab-item  class="backgroundTab"
        :value="'tab-1'"
        >
          <v-card flat tile >
            <v-card-text>
              <Dashboard 
                :affiliate.sync="affiliate"
                :loading_affiliate="loading_affiliate" />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item
          :value="'tab-2'"
         >
          <v-card flat tile >
            <v-card-text>
              <Profile
                :affiliate.sync="affiliate"
                :editable.sync="editable"
                
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item
           :value="'tab-3'"
        >
          <v-card flat tile >
            <v-card-text>
              <AdditionalInformation
                :affiliate.sync="affiliate"
                :editable.sync="editable"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item
           :value="'tab-4'"
        >
          <v-card flat tile >
            <v-card-text>
              <Spouse
                :affiliate.sync="affiliate"
                :editable.sync="editable"
               />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
                        <v-dialog
                    v-model="dialog_send_credential"
                    width="500">
                      <v-card>
                        <v-card-title>
                          <v-toolbar-title>Confirmar</v-toolbar-title>
                        </v-card-title>
                        <v-spacer></v-spacer>
                        <v-card-text>
                          <v-container v-if="state_cellphone">
                            {{options.response_message}}
                          </v-container>
                          <v-container v-else>
                            Por favor actualice el numero de celular
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="error" text @click="resetForm()">
                            cerrar
                          </v-btn>
                          <v-btn v-if="watch_button_send && state_cellphone"
                          color="success"
                          @click="getCredential()"
                          >
                            ENVIAR
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import AdditionalInformation from '@/components/affiliate/AdditionalInformation'
import Dashboard from '@/components/affiliate/Dashboard'
import Profile from '@/components/affiliate/Profile'
import Spouse from '@/components/affiliate/Spouse.vue'
export default {
  components: {
    AdditionalInformation,
    Dashboard,
    Profile,
    Spouse
},
  props: {
    affiliate_id :{
      type: String,
      require :true,
      default: 0,
    }
  },
  data: () => ({
    affiliate:{
      first_name: null,
      second_name:null,
      last_name: null,
      mothers_last_name:null,
      identity_card:null,
      birth_date:null,
      date_death:null,
      reason_death:null,
      phone_number:null,
      cell_phone_number:null,
      city_identity_card_id:null,
      date_entry:null,
      date_derelict:null,
      unit_name:null,
      affiliate_state_id: null,
    },
    editable:false,
    vertical:false,
    icons: true,
    loading_affiliate:false,
    watch_button_send:false,
    options: {
        response_message: 'Esta seguro de enviar los credenciales',
      },

    dialog_send_credential :false,
    state_cellphone:false,
  }),
  mounted(){
    this.resetForm()
    this.getAffiliate(this.affiliate_id)
    this.editable = false
  },
  watch:{
    /*status_credential: {
      deep: true,
      handler(val) {
        this.getAffiliate(this.affiliate_id)
      }
    },*/
    'status_credential.status': function (newVal, oldVal){
      this.getAffiliate(this.affiliate_id)
    }
  },
  methods: {
    resetForm() {
      this.getAffiliate(this.$route.params.id)
      this.editable = false
      this.dialog_send_credential  = false
      //this.reload = true
      this.$nextTick(() => {
      //this.reload = false
      })
    },
    async getAffiliate(id) {
      try {
        this.loading_affiliate=true
        let res = await this.$axios.get(`/affiliate/affiliate/${id}`)
        console.log(res)
        this.affiliate= res
        this.getStateCredential()
      } catch (e) {
        console.log(e)
      }finally {
        this.loading_affiliate=false
      }
    },
    async saveAffiliate(){
      try {
        if (!this.editable) {
          this.editable=true
        }
        else{
          await this.$axios.patch(`affiliate/affiliate/${this.affiliate.id}`,this.affiliate)
          this.$toast.success('Se actualizao correctamente los datos del afiliado')
          this.editable=false
        }
      } catch (e) {
        this.editable=false
        this.$toast.error('Ocurrio un error durante la actualización')
      }
    },
        getState_cellphone(){
      this.dialog_send_credential=true
      console.log(this.affiliate.cell_phone_number[0])
      if (this.affiliate.cell_phone_number[0].length>0) {
        this.state_cellphone=true;
        this.state_button_send=true;
      }
      else{
        this.state_cellphone =false;
        this.state_button_send=false;
      }
      console.log( this.state_cellphone)
    },

    getStateCredential(){
      if (this.affiliate.credential_status =='No asignadas'){
        this.watch_button_send=true
      }
      else{
        this.watch_button_send=false
        this.options.response_message='El afiliado y cuenta con credencialea asignados como: '+ this.affiliate.credential_status
      }
    },
    async getCredential(){
      try {
        if (this.affiliate.credential_status =='No asignadas'){
          let res = await this.$axios.post(`/affiliate/store/${this.affiliate.id}`)
          this.options.response_message=res.message+' su usuario es: '+res.payload.user+' su password es '+res.payload.pin;
          this.watch_button_send = false
        }
        else{
          this.$toast.info('ya cuenta con credenciales')
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
