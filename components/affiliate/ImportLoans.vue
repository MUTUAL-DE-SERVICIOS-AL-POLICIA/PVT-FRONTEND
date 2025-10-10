<template>
    <v-container fluid>
        <v-card-title mb-4>
            <v-toolbar dense color="tertiary" class="caption">
              <GlobalBreadCrumb />
            </v-toolbar>
        </v-card-title>
        <v-card-text>
        <v-tabs left background-color="backgroundTab" v-model="tab">
            <v-tab v-for="item in actions" :key="item.name_tab">{{item.name_tab}}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="item in actions" :key="item.name_tab">
            <v-toolbar-title class="pb-5">
                <div class="text-right">
                    <Information 
                        :title="updatedInformation.title" 
                        :parameters="updatedInformation" 
                /></div>
            </v-toolbar-title>
            <ImportProcessObservations
                ref="ImportProcessObservationsComponent"
                :import_obs="actions[tab]"
            />
          </v-tab-item>
        </v-tabs-items>
        </v-card-text>

</v-container>
</template>

<script>

import Information from '@/components/contribution/Information.vue';
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";
import ImportProcessObservations from '@/components/affiliate/ImportProcessObservations.vue';

export default {
  name: "ImportLoans",
  components: {
    Information,
    GlobalBreadCrumb,
    ImportProcessObservations,
  },
  data: () => ({
    tab: 0,
    actions: [
      { name_tab: "Importación Mora", 
        value: "0", 
        type: "mora", 
        name_file: "AfiliadosMora.csv",
        color:"red"
      },
      { name_tab: "Importación Préstamos Estacional", 
        value: "1", 
        type: "estacional", 
        name_file:"AfiliadosEstacional.csv",
        color: "orange"
      },
    ],
    information: {
      title: "IMPORTACIÓN",
      parameters: [
        {
          title: "FORMATO ARCHIVO",
          body: 'tipo CSV delimitado por "dos puntos" (:)',
        },
      ],
    },
  }),
  computed: {
    updatedInformation() {
      return [
        ...this.information.parameters,
        {
          title: "NOMBRE ARCHIVO",
          body: `tipo.csv Ejemplo ${this.actions[this.tab].name_file}`
        }
      ];
    },
  },
  watch: {
    tab(newVal, oldVal) {
      if (newVal !== oldVal) {
        let componentRef = this.$refs.ImportProcessObservationsComponent[newVal];
        if (componentRef && typeof componentRef.clearData === 'function') {
          componentRef.clearData();
        }
      }
    },
  },
};
</script>
