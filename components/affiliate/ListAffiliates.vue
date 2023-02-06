<template>
  <v-card-text>
    <v-data-table 
        dense class="inputSearch"
        :headers="headers"
        :items="affiliates"
        :options.sync="options"
        :item-class="hovertable" 
        :server-items-length="total_affiliates"
        :loading="loading_table"
        :footer-props="{
          showFirstLastPage: true,
          firstIcon: 'mdi-arrow-collapse-left',
          lastIcon: 'mdi-arrow-collapse-right',
          prevIcon: 'mdi-minus',
          nextIcon: 'mdi-plus',
          'items-per-page-text':'Filas por página',
          itemsPerPageOptions: [12, 30, 50, 100]
        }"
      >
      <!--Estilos de busqueda para las cabeceras -->
      <template v-slot:[`header.affiliate_id`]="{ header }">
        <span :class="searching.affiliate_id ? 'primary--text' : ''">{{ header.text }}</span>
      </template>
      <template v-slot:[`header.identity_card_affiliate`]="{ header }">
        <span :class="searching.identity_card_affiliate ? 'primary--text' : ''">{{ header.text }}</span>
      </template>
      <template v-slot:[`header.full_name_affiliate`]="{ header }">
        <span :class="searching.full_name_affiliate ? 'primary--text' : ''">{{ header.text }}</span>
      </template>
      <template v-slot:[`header.registration_affiliate`]="{ header }">
        <span :class="searching.registration_affiliate ? 'primary--text' : ''">{{ header.text }}</span>
      </template>
      <template v-slot:[`header.name_degree`]="{ header }">
        <span :class="searching.name_degree ? 'primary--text' : ''">{{ header.text }}</span>
      </template>
      <template v-slot:[`header.name_affiliate_state`]="{ header }">
        <span :class="searching.name_affiliate_state ? 'primary--text' : ''">{{ header.text }}</span>
      </template>
      <!--Fin de estilos de busqueda-->
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <nuxt-link :to="`PageAffiliate/${item.id_affiliate}`" class="button is-primary">
              <v-btn icon small v-on="on" :to="`PageAffiliate/${item.id_affiliate}`"
                color="success"><v-icon>mdi-account-eye</v-icon>
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
          <td><v-text-field placeholder="Nup" spellcheck="false" class="filter-text" v-model="searching.id_affiliate"
              @keyup="searchTimeOut()"></v-text-field></td>
          <td><v-text-field placeholder="C.I. Afiliado" spellcheck="false" class="filter-text"
              v-model="searching.identity_card_affiliate" @keyup="searchTimeOut()"></v-text-field></td>
          <td><v-text-field placeholder="Nombre Completo" spellcheck="false" class="filter-text"
              v-model="searching.full_name_affiliate" @keyup="searchTimeOut()"></v-text-field></td>
          <td><v-text-field placeholder="Matricula" spellcheck="false" class="filter-text"
              v-model="searching.registration_affiliate" @keyup="searchTimeOut()"></v-text-field></td>
          <td><v-text-field placeholder="Grado" spellcheck="false" class="filter-text" v-model="searching.name_degree"
              @keyup="searchTimeOut()"></v-text-field></td>
          <td><v-text-field placeholder="Estado" spellcheck="false" class="filter-text"
              v-model="searching.name_affiliate_state" @keyup="searchTimeOut()"></v-text-field></td>
          <td><v-text-field disabled class="filter-text"></v-text-field></td>
        </tr>
      </template>
    </v-data-table>
  </v-card-text>
</template>
<script>

import Add from '@/components/affiliate/AdditionalInformation';
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";
import GlobalLoading from "@/components/common/GlobalLoading.vue";

export default {
  name: "ListAffiliates",
  components: {
    GlobalBreadCrumb,
    GlobalLoading,
    Add
  },
  data: () => ({
    // Cabeceras de la tabla
    headers: [
      { text: 'Nup', value: 'id_affiliate', class: ['table', 'white--text'], width: '2%', sortable: false },
      { text: 'CI Afiliado', value: 'identity_card_affiliate', class: ['table', 'white--text'], width: '5%', sortable: false },
      { text: 'Nombre Completo Afiliado', value: 'full_name_affiliate', class: ['table', 'white--text'], width: '10%', sortable: false },
      { text: 'Matrícula', value: 'registration_affiliate', class: ['table', 'white--text'], width: '5%', sortable: false },
      { text: 'Grado', value: 'name_degree', class: ['table', 'white--text'], width: '5%', sortable: false },
      { text: 'Estado', value: 'name_affiliate_state', class: ['table', 'white--text'], width: '5%', sortable: false },
      { text: 'Acción', value: 'actions', input: '', menu: false, type: "text", class: ['table', 'white--text', 'text-md-center'], sortable: false, width: '1%' },
    ],
    search: '',
    searching: {
      id_affiliate: "", // id affiliado
      identity_card_affiliate: "", // ci affiliado
      registration_affiliate: "", // matricula
      full_name_affiliate: "", // nombre completo
      name_degree: "", // grado
      name_affiliate_state: "", //Estado
    },
    affiliates: [],
    options: {
      page: 1,
      itemsPerPage: 12,
      sortDesc: [false],
    },
    total_affiliates: 0,
    loading_table: false,
    show_filter: true,
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
        this.options.page = 1
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
    _show_filter() {
      this.show_filter = !this.show_filter
    },
    hovertable: function (item) {
      return 'row-white'
    },
    clearAll() {
      this.searching.id_affiliate = "",
        this.searching.identity_card_affiliate = "",
        this.searching.full_name_affiliate = "",
        this.searching.registration_affiliate = "",
        this.searching.name_degree = "",
        this.searching.name_affiliate_state = "",
        this.getListAffiliates()
    },
    searchTimeOut() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.getListAffiliates()
      }, 800);
    }
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

.filter-text {
  font-size: 12px;
  height: 2px;
  margin: 0 0 40px 0;
  padding: 0;
  width: 100%;
}
</style>


