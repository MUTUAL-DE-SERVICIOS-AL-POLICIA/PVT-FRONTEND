<template>
  <v-card-text>
    <v-data-table
        dense
        class="inputSearch"
        :headers="headers"
        :items="spouses"
        :options.sync="options"
        :item-class="hovertable"
        :server-items-length="total_spouses"
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
      <template v-slot:[`header.affiliate_id`]="{ header }">
        <span :class="searching.affiliate_id ? 'primary--text' : ''">{{ header.text }}</span>
      </template>
      <template v-slot:[`header.identity_card_spouses`]="{ header }">
        <span :class="searching.identity_card_spouses ? 'primary--text' : ''">{{ header.text }}</span>
      </template>
      <template v-slot:[`header.full_name_spouses`]="{ header }">
        <span :class="searching.full_name_spouses ? 'primary--text' : ''">{{ header.text }}</span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <nuxt-link :to="`PageAffiliate/${item.affiliate_id}`" class="button is-primary">
              <v-btn icon small v-on="on" :to="`PageAffiliate/${item.affiliate_id}`"
                color="success"><v-icon>mdi-account-eye</v-icon>
              </v-btn>
            </nuxt-link>
          </template>
          <span>Ver información afiliado</span>
        </v-tooltip>
      </template>
      <template slot="body.prepend">
        <tr v-if="show_filter">
          <td><v-text-field placeholder="Nup" spellcheck="false" class="filter-text" v-model="searching.id_affiliate"
              @keyup="searchTimeOut()"></v-text-field></td>
          <td><v-text-field placeholder="C.I. Afiliado" spellcheck="false" class="filter-text"
              v-model="searching.identity_card_spouses" @keyup="searchTimeOut()"></v-text-field></td>
          <td><v-text-field placeholder="Nombre Completo" spellcheck="false" class="filter-text"
              v-model="searching.full_name_spouses" @keyup="searchTimeOut()"></v-text-field></td>
          <td><v-text-field disabled class="filter-text"></v-text-field></td>
        </tr>
      </template>
    </v-data-table>
  </v-card-text>
</template>
<script>

import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";
import GlobalLoading from "@/components/common/GlobalLoading.vue";

export default {
  name: "ListSpouses",
  components: {
    GlobalBreadCrumb,
    GlobalLoading,
  },
  data: () => ({
    headers: [
      { text: 'Nup', value: 'affiliate_id', class: ['table', 'white--text'], width: '2%', sortable: false },
      { text: 'CI Cònyuge', value: 'identity_card', class: ['table', 'white--text'], width: '5%', sortable: false },
      { text: 'Nombre Completo Cònyuge', value: 'full_name', class: ['table', 'white--text'], width: '10%', sortable: false },
      { text: 'Acción', value: 'actions', input: '', menu: false, type: "text", class: ['table', 'white--text', 'text-md-center'], sortable: false, width: '1%' },
    ],
    search: '',
    searching: {
      id_affiliate: "",
      identity_card_spouses: "",
      full_name_spouses: "",
    },
    spouses: [],
    options: {
      page: 1,
      itemsPerPage: 12,
      sortDesc: [false],
    },
    total_spouses: 0,
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
        this.getListSpouses()
      }
    },
    searching: {
      deep: true,
      handler(val) {
        this.options.page = 1
      }
    },
  },
  mounted() {
    this.getListSpouses()
  },
  created () {
    this.$nuxt.$on('clear_all', this.clearAll)
  },
  methods: {
    async getListSpouses() {
      this.loading_table = true
      try {
        let res = await this.$axios.get("/affiliate/spouse", undefined, {
          params: {
            id_affiliate: this.searching.id_affiliate,
            identity_card_spouses: this.searching.identity_card_spouses,
            full_name_spouses: this.searching.full_name_spouses,
            page: this.options.page,
            per_page: this.options.itemsPerPage,
            sortDesc: this.options.sortDesc,
          },
        });
        this.spouses = res.payload.spouses.data
        this.total_spouses = res.payload.spouses.total
        this.options.page = res.payload.spouses.current_page
        this.options.itemsPerPage = parseInt(res.payload.spouses.per_page)
        this.loading_table = false
      } catch (e) {
        console.log(e)
        this.loading_table = false
      }
    },
    _show_filter(){
      this.show_filter =! this.show_filter
    },
    hovertable: function(item) {
      return 'row-white'
    },
    clearAll(tab) {
      if(tab == 2) {
        console.log("se ejecuta esposa")
        this.searching.id_affiliate = "",
        this.searching.identity_card_spouses = "",
        this.searching.full_name_spouses = "",
        this.getListSpouses()
      }
    },
    searchTimeOut() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.getListSpouses()
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
.filter-text{
  font-size: 12px;
  height: 2px;
  margin: 0 0 40px 0;
  padding: 0;
  width: 100%;
}

</style>
