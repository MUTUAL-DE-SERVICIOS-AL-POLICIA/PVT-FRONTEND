<template>
  <v-container fluid>
    <v-form>
      <v-row justify="center">
        <v-col cols="12" md="6" class="v-card-profile">
          <v-row>
            <v-col cols="12">
              <v-toolbar-title>INFORMACION CONYUGE</v-toolbar-title>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                v-model="affiliate.first_name"
                class="purple-input"
                label="Primer Nombre"
                :readonly="!editable "
                :outlined="editable "
                :disabled="(!editable || affiliate.affiliate_state_id != 4)"
              >
            </v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
  export default {
  props: {
    affiliate :{
      type: Object,
      require :true,
    },
    editable:{
      type: Boolean,
      require :true,
    }
  },
}
</script>
