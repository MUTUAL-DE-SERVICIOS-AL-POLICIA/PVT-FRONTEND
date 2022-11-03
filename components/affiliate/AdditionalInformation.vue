<template>
  <v-container fluid>
    <v-form>
      <v-row justify="center">
        <v-col cols="12" md="12">
          <v-col cols="12">
            <v-toolbar-title>DOMICILIO</v-toolbar-title>
          </v-col>
          <v-col cols="12">
            <Address
              :affiliate.sync="affiliate"
              :obj_address.sync="obj_address"
              :editable.sync="editable"
              :cancel.sync="cancel"
            />
          </v-col>
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
                  :readonly="!editable"
                  :outlined="editable"
                  :disabled="!editable"
                  label="Celular1"
                  v-mask="'(###)-#####'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="affiliate.cell_phone_number[1]"
                  dense
                  :disabled="!editable"
                  :outlined="editable"
                  label="Celular2"
                  v-mask="'(###)-#####'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="affiliate.phone_number"
                  dense
                  label="Telefono"
                  v-mask="'(#) ###-###'"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="12" md="6">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-toolbar-title>OFICINA VIRTUAL</v-toolbar-title>

                <v-card color="info_card" shaped class="elevation-1">
                  <v-card-title>Credenciales</v-card-title>
                  <v-card-text>
                    <strong>Estado:</strong> {{ affiliate.credential_status.access_status
                    }}<br />
                    <strong>Fecha de creación:</strong>
                    {{ $filters.date(affiliate.credential_status.created_at) }}
                  </v-card-text>
                </v-card>
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
  },

  data: () => ({}),
  watch: {},
  computed: {},
  mounted() {},
  methods: {},
};
</script>
