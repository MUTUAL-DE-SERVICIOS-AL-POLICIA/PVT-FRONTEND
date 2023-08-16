<template>
  <v-menu
    v-model="dialog_menu"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn text color="indigo" dark v-bind="attrs" v-on="on">
        Información
      </v-btn>
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle
              > <b>CONSIDERACIONES PARA {{title}}</b></v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <div class="py-1 pl-2 ma-1">
        <small v-for="(parameter, index) in parameters" :key="index">
          <v-icon>mdi-check</v-icon> <b>{{parameter.title}}:</b><br />
          <div class="information-body-style">{{parameter.body}}<br/></div>
        </small>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog_menu = false"> Salir </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name:"Information",
    data: ()=>({
        dialog_menu: false
    }),
    props: {
      title: {
        type: String,
        required: true,
        default: '',
      },
      parameters: {
        type: Array,
        required: true,
        default: () => [],
      }
    }

};
</script>

<style>
  .information-body-style {
    max-width:95%;
    padding-left: 25px;
  }
</style>