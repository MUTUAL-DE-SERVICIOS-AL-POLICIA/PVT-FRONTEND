<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3" class="ma-0 pa-2 pt-0" align="center">
        <v-card>
          SIN TRAMITES
          <v-divider class="mx-4"></v-divider>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>

export default {
  props: {
    affiliate: {
      type: Object,
      required: true
    },
    loading_affiliate:{
      required: true
    },
  }
}
</script>
