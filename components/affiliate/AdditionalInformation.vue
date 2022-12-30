<template>
  <v-container fluid>
    <v-form ref="refAdditionalInformation">
      <v-row class="text-right">
        <v-col cols="12" class="ma-0 pa-0 pt-0">
          <template>
            <v-btn
              x-small
              right
              color="success"
              dark
              @click.stop="validateFormAdditionalInformation()"
            >
              <span v-if="!sync_up.editable"> EDITAR</span>
              <span v-else> Confirmar</span>
            </v-btn>
            <v-btn
              x-small
              color="error"
              dark
              v-show="sync_up.editable"
              @click.stop="$nuxt.$emit('eventResetForm', true)"
            >
              <span> Cancelar</span>
            </v-btn>
          </template>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-toolbar-title class="pb-2">DOMICILIO</v-toolbar-title>
          <Address
            :affiliate.sync="affiliate"
            :obj_address.sync="obj_address"
            :sync_up.sync="sync_up"
            :cancel.sync="cancel"
            readonly
            disabled
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-toolbar-title  class="pb-2">TELÉFONOS</v-toolbar-title>
          <v-text-field
            v-model="affiliate.cell_phone_number[0]"
            dense
            label="Celular1"
            v-mask="'(###)-#####'"
            :readonly="!sync_up.editable || !permission.secondary"
            :outlined="sync_up.editable && permission.secondary"
            :disabled="sync_up.editable && !permission.secondary"
            :rules="[
                  $rules.longitudMinima(11),
                  $rules.longitudMaxima(11),
            ]"
          ></v-text-field>
          <v-text-field
            v-model="affiliate.cell_phone_number[1]"
            dense
            label="Celular2"
            v-mask="'(###)-#####'"
            :readonly="!sync_up.editable || !permission.secondary"
            :outlined="sync_up.editable && permission.secondary"
            :disabled="sync_up.editable && !permission.secondary"
          ></v-text-field>
          <v-text-field
            v-model="affiliate.phone_number"
            dense
            label="Teléfono"
            v-mask="'(#) ###-###'"
            readonly
            disabled
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-toolbar-title class="pb-5">DATOS FINANCIEROS </v-toolbar-title>
          <v-select
            dense
            :loading="loading"
            :items="entity"
            item-text="name"
            item-value="id"
            label="Entidad Financiera"
            v-model="affiliate.financial_entity_id"
            readonly
            disabled
          ></v-select>
          <v-text-field
            dense
            v-model="affiliate.account_number"
            label="Número de Cuenta SIGEP activa"
            readonly
            disabled
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
        <v-toolbar-title class="pb-2">OFICINA VIRTUAL</v-toolbar-title>
        <span><strong>Estado de credenciales: </strong> {{affiliate.credential_status.access_status}}</span><br />
        <template v-if="affiliate.credential_status.access_status != 'No asignadas'">
          <span>
            <strong>Fecha de creación de credenciales: </strong>{{ $filters.dateTime(affiliate.credential_status.created_at) }}</span><br />
          <span>
            <strong>Fecha de actualización de credenciales: </strong>{{ $filters.dateTime(affiliate.credential_status.updated_at) }}</span>
        </template>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import Address from "@/components/affiliate/Address";

export default {
  name: "AdditionalInformationAffiliate",
  components: {
    Address,
  },
  props: {
    affiliate: {
      type: Object,
      require: true,
    },
    sync_up: {
      type: Object,
      require: true,
    },
    obj_address: {
      type: Object,
      require: true,
    },
    cancel: {
      type: Boolean,
      require: true,
    },
    permission: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    entity: [],
    loading:false
  }),
  watch: {},
  computed: {},
  mounted() {
    this.getFinancialEntity()
  },
  methods: {
    async getFinancialEntity() {
      try {
        this.loading = true;
        let res = await this.$axios.get(`global/financial_entity`);
        this.entity = res;
        this.entity.unshift({
          id: null,
          name: "-------"
        })
      } catch (e) {
        this.dialog = false;
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    validateFormAdditionalInformation() {
      if (!this.sync_up.editable) {
        this.sync_up.editable = true;
      } else {
        if (this.$refs.refAdditionalInformation) {
          if (this.$refs.refAdditionalInformation.validate()) {
            this.$nuxt.$emit('eventSaveAffiliate2', true)
          } else {
            console.log("no valido");
          }
        }
      }
    },
  },
};
</script>
