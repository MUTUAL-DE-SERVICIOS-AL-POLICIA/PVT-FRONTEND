<template>
  <div>
  <v-data-table
    dense
    :headers="headers"
    :items="contribution_list"
    :options.sync="options"
    :loading="loading_table"
    :server-items-length="total_contributions"
    :key="refresh_table"
  >
    <template v-slot:[`header.con_re`]="{ header }">
      <span :class="searching.con_re ? 'primary--text' : ''">{{
        header.text
      }}</span>
    </template>
     <template v-slot:[`header.year`]="{ header }">
      <span :class="searching.year ? 'primary--text' : ''">{{
        header.text
      }}</span>
    </template>
    <template v-slot:[`header.month`]="{ header }">
      <span :class="searching.month ? 'primary--text' : ''">{{
        header.text
      }}</span>
    </template>
    <template slot="body.prepend">
      <tr>
        <td>
          <v-select
            dense
            :items="items"
            item-text = "name"
            item-value = "value"
            v-model = "searching.con_re"
            @change = "searchTimeOut()"
            spellcheck = "false"
            close-on-click
          ></v-select>
        </td>
        <td>
          <v-text-field
            placeholder="Año"
            spellcheck="false"
            class="filter-text"
            v-model="searching.year"
            @keyup="searchTimeOut()"
          ></v-text-field>
        </td>
        <td>
          <v-text-field
            placeholder="Mes"
            spellcheck="false"
            class="filter-text"
            v-model="searching.month"
            @keyup="searchTimeOut()"
          ></v-text-field>
        </td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td>
          <v-text-field
            placeholder="Desglose"
            spellcheck="false"
            class="filter-text"
            v-model="searching.breakdown"
            @keyup="searchTimeOut()"
          ></v-text-field>
        </td>
      </tr>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="item.can_deleted && permissionSimpleSelected.includes('delete-contribution')"
            icon small
            v-on="on"
            @click="dialogDelete(item.con_re_id)"
            color="error">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Eliminar contribución</span>
      </v-tooltip>
    </template>
  </v-data-table>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">Esta seguro de eliminar el registro?</v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialog=false">Cerrar</v-btn>
        <v-btn color="success" text @click="deleteItem()"
          >Confirmar</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
</template>

<script>
export default {
  name: "ListContributionDetailActive",
  components: {},
  affiliate: {
    type: Object,
    require: true,
  },
  data: () => ({
    searching: {
      con_re:"",
      year: "",
      month: "",
      breakdown:""
    },
    items: [
        {
          name: "CON",
          value: 'CON',
        },{
          name: "RE",
          value: 'RE',
        },{
          name: "TODOS",
          value: '',
        },
      ],
    options: {
      page: 1,
      itemsPerPage: 8,
      sortBy: ["month_year"],
      sortDesc: [true],
    },
    total_contributions: 0,
    loading_table: false,
    active: true,
    contribution_list: [],
    headers: [
      {
        text: "Tipo",
        value: "con_re",
        input: "",
        class: ["table", "white--text"],
        width: "5%",
        sortable: false,
      },{
        text: "Año",
        value: "year",
        input: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },{
        text: "Mes",
        value: "month",
        input: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },{
        text: "Sueldo",
        value: "base_wage",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },{
        text: "Antigüedad",
        value: "seniority_bonus",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },{
        text: "Ganado",
        value: "gain",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },{
        text: "Cotizable",
        value: "quotable",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },{
        text: "F.R.",
        value: "retirement_fund",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },{
        text: "C.M.",
        value: "mortuary_quota",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },{
        text: "Aporte",
        value: "total",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },{
        text: "Desg.",
        value: "breakdown_name",
        class: ["table", "white--text"],
        width: "20%",
        sortable: false,
      },{
        text: "Acciones",
        value: "actions",
        class: ["table", "white--text"],
        width: "20%",
        sortable: false,
      },
    ],
    dialog: false,
    delete_id: null,
    refresh_table:0
  }),

  watch: {
    options: function (newVal, oldVal) {
      if (
        newVal.page != oldVal.page ||
        newVal.itemsPerPage != oldVal.itemsPerPage ||
        newVal.sortBy != oldVal.sortBy ||
        newVal.sortDesc != oldVal.sortDesc
      ) {
        this.getSearchActiveAffiliateContribution();
      }
    },
    searching: {
      deep: true,
      handler(val) {
        this.options.page = 1;
      },
    },
    refresh_table: function (newVal, oldVal) {
      if(newVal != oldVal)
        this.getSearchActiveAffiliateContribution()
    }
  },

  computed: {
    //permisos del selector global por rol
    permissionSimpleSelected () {
      return this.$store.getters.permissionSimpleSelected
    },
  },

  mounted() {
    this.getSearchActiveAffiliateContribution();
  },
  methods: {
    async getSearchActiveAffiliateContribution() {
      try {
        this.loading_table = true;
        let res = await this.$axios.get(
          `/contribution/search_active_affiliate_contribution`, undefined, {
            params: {
              affiliate_id: this.$route.params.id,
              con_re: this.searching.con_re,
              year: this.searching.year,
              month: this.searching.month,
              breakdown:this.searching.breakdown,
              contributionable_type: this.searching.contributionable_type,
              page: this.options.page,
              per_page: this.options.itemsPerPage,
              sortBy: this.options.sortBy,
              sortDesc: this.options.sortDesc,
            }
          }
        );
        this.contribution_list = res.data;
        this.total_contributions = res.total;
        this.options.page = res.current_page;
        this.options.itemsPerPage = parseInt(res.per_page);
        this.loading_table = false;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading_table = false;
      }
    },
    searchTimeOut() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.getSearchActiveAffiliateContribution()
      }, 800);
    },
    dialogDelete(item){
      this.dialog= true
      this.delete_id=item
    },
    async deleteItem(){
      try {
        let res = await this.$axios.delete(`/contribution/contribution/${this.delete_id}`)
        this.dialog = false
        this.refresh_table ++
        if(!res.error){
          this.$toast.success(res.message)
        }else{
          this.$toast.error(res.message)
        }
      } catch (e) {
        this.dialog = false
        console.log(e)
      }
    }
  },
};
</script>
<style scoped>
.filter-text {
  font-size: 12px;
  height: 2px;
  margin: 0 0 40px 0;
  padding: 0;
  width: 100%;
}
</style>
