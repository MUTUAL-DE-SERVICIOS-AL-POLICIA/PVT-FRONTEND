<template>
  <v-container fluid>
    <v-form>
      <v-row justify="center">
        <v-col cols="12">
          <v-toolbar-title>DOMICILIO</v-toolbar-title>
        </v-col>
        <v-col cols="12">
          <Address
            :affiliate.sync="affiliate"
            :obj_address.sync="obj_address"
            :editable.sync="editable"
            :cancel.sync="cancel"
            :readonly="!editable || !permission.secondary"
            :outlined="editable && permission.secondary"
            :disabled="editable && !permission.secondary"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-container class="py-0">
            <v-row>
              <v-col cols="12">
                <v-toolbar-title>TELÉFONOS</v-toolbar-title>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="affiliate.cell_phone_number[0]"
                  dense
                  label="Celular1"
                  v-mask="'(###)-#####'"
                  :readonly="!editable || !permission.secondary"
                  :outlined="editable && permission.secondary"
                  :disabled="editable && !permission.secondary"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="affiliate.cell_phone_number[1]"
                  dense
                  label="Celular2"
                  v-mask="'(###)-#####'"
                  :readonly="!editable || !permission.secondary"
                  :outlined="editable && permission.secondary"
                  :disabled="editable && !permission.secondary"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="affiliate.phone_number"
                  dense
                  label="Telefono"
                  v-mask="'(#) ###-###'"
                  :readonly="!editable || !permission.secondary"
                  :outlined="editable && permission.secondary"
                  :disabled="editable && !permission.secondary"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="12" md="6">
          <v-container class="py-0">
            <v-row>
              <v-col cols="12">
                <v-toolbar-title>OFICINA VIRTUAL</v-toolbar-title>
              </v-col>
              <v-col>
                <span><strong>Estado de credenciales: </strong> {{affiliate.credential_status.access_status}}</span><br />
                <template v-if="affiliate.credential_status.access_status != 'No asignadas'">
                  <span>
                    <strong>Fecha de creación de credenciales: </strong>{{ $filters.date(affiliate.credential_status.created_at) }}</span><br />
                  <span>
                    <strong>Fecha de actualización de credenciales: </strong>{{ $filters.date(affiliate.credential_status.updated_at) }}</span>
                </template>
              </v-col>
            </v-row>
          </v-container>
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
    editable: {
      type: Boolean,
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

  data: () => ({}),
  watch: {},
  computed: {},
  mounted() {},
  methods: {},
};
</script>
