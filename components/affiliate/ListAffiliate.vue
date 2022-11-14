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
        <v-data-table
          dense
          class="inputSearch"
          :headers="headers"
          :items="affiliates"
          :options.sync="options"
          :item-class="hovertable"
          :server-items-length="total_affiliates"
          :footer-props="{ itemsPerPageOptions: [8, 15, 50,100] }"
          :loading = loading_table
        >
          <!--Estilos de busqueda para las cabeceras -->
          <template v-slot:[`header.identity_card_affiliate`]="{ header }">
            <span :class="searching.identity_card_affiliate? 'primary--text' : ''">{{ header.text }}</span>
          </template>

          <template v-slot:[`header.full_name_affiliate`]="{ header }">
            <span :class="searching.full_name_affiliate? 'primary--text' : ''">{{ header.text }}</span>
          </template>

          <template v-slot:[`header.registration_affiliate`]="{ header }">
            <span :class="searching.registration_affiliate? 'primary--text' : ''">{{ header.text }}</span>
          </template>

          <template v-slot:[`header.name_degree`]="{ header }">
            <span :class="searching.name_degree? 'primary--text' : ''">{{ header.text }}</span>
          </template>

          <template v-slot:[`header.name_affiliate_state`]="{ header }">
            <span :class="searching.name_affiliate_state? 'primary--text' : ''">{{ header.text }}</span>
         </template>
          <!--Fin de estilos de busqueda-->
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip bottom >
                <template v-slot:activator="{ on }">
                   <nuxt-link :to="`PageAffiliate/${item.id_affiliate}`" class="button is-primary">
                    <v-btn
                      icon
                      small
                      v-on="on"
                      :to="`PageAffiliate/${item.id_affiliate}`"
                      color="success"
                      ><v-icon>mdi-account-eye</v-icon>
                    </v-btn>
                  </nuxt-link>
                </template>
                <span>Ver información afiliado</span>
              </v-tooltip>
            </template>



          <!-- Vista de los filtros -->
          <template slot="body.prepend">
            <tr v-if="show_filter">
                <!--<td><v-text-field placeholder="C.I. Afiliado" spellcheck="false" class="filter-text" v-model="searching.identity_card_affiliate" @keydown.enter="getListAffiliates"></v-text-field></td>-->
                <td><v-text-field placeholder="C.I. Afiliado" spellcheck="false" class="filter-text" v-model="searching.identity_card_affiliate" @input="getListAffiliates"></v-text-field></td>
                <td><v-text-field placeholder="Nombre Completo" spellcheck="false" class="filter-text" v-model="searching.full_name_affiliate" @input="getListAffiliates"></v-text-field></td>
                <td><v-text-field placeholder="Matricula" spellcheck="false" class="filter-text" v-model="searching.registration_affiliate" @input="getListAffiliates"></v-text-field></td>
                <td><v-text-field placeholder="Grado" spellcheck="false" class="filter-text" v-model="searching.name_degree" @input="getListAffiliates"></v-text-field></td>
                <td><v-text-field placeholder="Estado" spellcheck="false" class="filter-text" v-model="searching.name_affiliate_state" @input="getListAffiliates"></v-text-field></td>
                <td><v-text-field disabled class="filter-text"></v-text-field></td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>

import Add from '@/components/affiliate/AdditionalInformation';
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";
import GlobalLoading from "@/components/common/GlobalLoading.vue";

export default {
  name: "MainListAffiliate",
  components: {
    GlobalBreadCrumb,
    GlobalLoading,
    Add
  },
  data: () => ({
    // Cabeceras de la tabla
    headers: [
      { text: 'CI Afiliado', value:'identity_card_affiliate', class: ['table', 'white--text'],width: '5%', sortable: false },
      { text: 'Nombre Completo Afiliado', value:'full_name_affiliate', class: ['table', 'white--text'],width: '10%', sortable: false },
      { text: 'Matrícula', value:'registration_affiliate', class: ['table', 'white--text'],width: '5%', sortable: false },
      { text: 'Grado', value:'name_degree', class: ['table', 'white--text'],width: '5%', sortable: false },
      { text: 'Estado', value:'name_affiliate_state', class: ['table', 'white--text'],width: '5%', sortable: false },
      { text: 'Acción',value:'actions',input:'', menu:false, type:"text", class: ['table', 'white--text','text-md-center'], sortable: false, width: '1%'},
    ],
    search: '',
    searching: {
      id_affiliate:"", // id affiliado
      identity_card_affiliate:"", // ci affiliado
      registration_affiliate:"", // matricula
      full_name_affiliate:"", // nombre completo
      name_degree: "", // grado
      name_affiliate_state: "", //Estado
    },
    affiliates: [],
    options: {
      page: 1,
      itemsPerPage: 8,
      sortDesc: [false],
    },
    total_affiliates: 0,
    loading_table: false,
    show_filter:true,
    refresh_table: 0,

  }),
  watch: {
    options: function (newVal, oldVal) {
      if (
        newVal.page != oldVal.page ||
        newVal.itemsPerPage != oldVal.itemsPerPage ||
        newVal.sortDesc != oldVal.sortDesc) {
        this.getListAffiliates()
      }
    },
    searching: {
      deep: true,
      handler(val) {
        this.options.page=1
      }
    },
    // undefined newVal y oldVal

  },
  mounted() {
    this.getListAffiliates()
  },
  methods: {
    async getListAffiliates() {

      this.loading_table = true
      try {
        let res = await this.$axios.get("/affiliate/affiliate", undefined, {
          params: {
            id_affiliate: this.searching.id_affiliate,
            identity_card_affiliate: this.searching.identity_card_affiliate,
            registration_affiliate: this.searching.registration_affiliate,
            name_degree: this.searching.name_degree,
            full_name_affiliate: this.searching.full_name_affiliate,
            name_affiliate_state: this.searching.name_affiliate_state,
            page: this.options.page,
            per_page: this.options.itemsPerPage,
            sortDesc: this.options.sortDesc,
          },
        });
        this.affiliates = res.payload.affiliates.data
        console.log(this.affiliates)
        this.total_affiliates = res.payload.affiliates.total
        /*delete res.data["data"]*/
        this.options.page = res.payload.affiliates.current_page

        this.options.itemsPerPage = parseInt(res.payload.affiliates.per_page)
        this.loading_table = false
      } catch (e) {
        console.log(e)
        this.loading_table = false
      }
    },
    _show_filter(){
       this.show_filter=!this.show_filter
    },
    hovertable: function(item) {
        return 'row-white'
    },
    clearAll() {
      this.searching.identity_card_affiliate= "",
      this.searching.full_name_affiliate= "",
      this.searching.registration_affiliate = "",
      this.searching.name_degree= "",
      this.searching.name_affiliate_state= "",
      this.getListAffiliates()
    },
  },
};
</script>
<style scoped>
.select-year {
  max-width: 100px;
  margin-bottom: -30px;
}
.btn-period.v-btn:not(.v-btn--round).v-size--default {
  min-width: 160px;
  height: 25px;
}
.v-text-field {
  width: 200px;
  padding: 5px;
  margin: 0px;
  font-size: 0.8em;
}
.filter-text{
  font-size: 12px;
  height: 2px;
  margin: 0 0 40px 0;
  padding: 0;
  width: 100%;
}

</style>


