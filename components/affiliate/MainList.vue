<template>
  <v-container fluid>
    <v-card flat>
      <v-card-title>
        <v-toolbar dense color="tertiary" class="caption">
          <GlobalBreadCrumb />
          <v-tooltip top >
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                @click="clearAll()"
                color="table"
                v-on="on"
                x-small
                absolute
                left
                style="margin-top: -2px; margin-left:400px; color: white;"
              >
                <v-icon> mdi-broom </v-icon>
              </v-btn>
            </template>
            <span class="caption">Limpiar todos los filtros</span>
          </v-tooltip>
        </v-toolbar>
      </v-card-title>

      <v-card-text>

      <v-tabs left background-color="backgroundTab">
        <v-tab id="1" :href="`#tab-1`" @click="tabClicked"> Lista de Afiliados </v-tab>
        <v-tab id="2" :href="`#tab-2`" @click="tabClicked"> Lista de Cónyuges </v-tab>

        <!-- Hacerlo dinámico esta parte -->
        <v-tab-item :value="'tab-1'">
          <v-card flat tile>
            <v-card-text>
              <ListAffiliates />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item :value="'tab-2'">
          <v-card flat tile>
            <v-card-text>
              <ListSpouses />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>

    </v-card-text>
    </v-card>
  </v-container>
</template>

<script>

import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";
import ListSpouses from "@/components/affiliate/ListSpouses"
import ListAffiliates from "@/components/affiliate/ListAffiliates"

export default {
  name: "MainList",
  components: {
    GlobalBreadCrumb,
    ListSpouses,
    ListAffiliates
  },
  data: () => ({
    tab:1,
  }),
  methods: {
    clearAll() {
      this.$nuxt.$emit('clear_all', this.tab) // aca podemos enviarle que componente emitio
    },
    tabClicked: function(e) {
      this.tab = parseInt(e.currentTarget.id);
    }
  },
};
</script>


