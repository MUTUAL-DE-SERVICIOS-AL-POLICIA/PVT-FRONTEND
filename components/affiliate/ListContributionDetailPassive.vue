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
    :footer-props="{
      showFirstLastPage: true,
      firstIcon: 'mdi-arrow-collapse-left',
      lastIcon: 'mdi-arrow-collapse-right',
      prevIcon: 'mdi-minus',
      nextIcon: 'mdi-plus',
      'items-per-page-text':'Filas por página',
      itemsPerPageOptions: [12, -1]
    }"
  >
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
          <v-text-field
            placeholder="Año"
            spellcheck="false"
            class="filter-text"
            v-model="searching.year"
            @input="getSearchPassiveAffiliateContribution()"
          ></v-text-field>
        </td>
        <td>
          <v-text-field
            placeholder="Mes"
            spellcheck="false"
            class="filter-text"
            v-model="searching.month"
            @input="getSearchPassiveAffiliateContribution()"
          ></v-text-field>
        </td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td>
          <v-select
            dense
            :items="class_rent"
            item-text = "name"
            item-value = "value"
            v-model="searching.affiliate_rent_class"
            @change ="searchTimeOut()"
            spellcheck = "false"
            close-on-click
          ></v-select>
        </td>
        <td>
          <v-select
            dense
            :items="contribution_state"
            item-text = "name"
            item-value = "value"
            v-model="searching.contribution_state_id"
            @change ="searchTimeOut()"
            spellcheck = "false"
            close-on-click
          ></v-select>
        </td>
      </tr>
    </template>
     <template v-slot:[`item.actions`]="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            
            icon
            small
            v-on="on"
            @click="dialogDelete(item.id)"
            color="error"
            :disabled="!(item.can_deleted && permissionSimpleSelected.includes('delete-contribution-passive'))">
            <v-icon v-if="permissionSimpleSelected.includes('delete-contribution-passive')">
              mdi-delete
            </v-icon>
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
  name: "ListContributionDetailPassive",
  components: {},
  affiliate: {
    type: Object,
    require: true,
  },
  data: () => ({
    searching: {
      year: "",
      month: "",
      contributionable_type: "",
      contributionable_type_name: "",
      affiliate_rent_class:"",
      contribution_state_id:""
    },
    options: {
      page: 1,
      itemsPerPage: 8,
      sortBy: ["month_year"],
      sortDesc: [true],
    },
    class_rent: [
      {
        name: "Vejez",
        value: 'VEJEZ',
      },{
        name: "Viudedad",
        value: 'VIUDEDAD',
      },{
        name: "Todos",
        value: '',
      },
    ],
    contribution_state: [
      {
        name: "En proceso",
        value: '1',
      },{
        name: "Pagado",
        value: '2',
      },{
        name: "Devuelto",
        value: '3',
      },{
        name: "Todos",
        value: '',
      },
    ],
    total_contributions: 0,
    loading_table: false,
    active: true,
    contribution_list: [],
    headers: [
      {
        text: "Año",
        value: "year",
        input: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Mes",
        value: "month",
        input: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },
      {
        text: "Renta",
        value: "rent_pension",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },
      {
        text: "Renta Dignidad",
        value: "dignity_rent",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },
      {
        text: "Cotizable",
        value: "rent_pension",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },
      {
        text: "Aporte Auxilio Mortuorio",
        value: "total",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },
      {
        text: "Tipo",
        value: "contributionable_type_name",
        class: ["table", "white--text"],
        width: "15%",
        sortable: false,
      },
      {
        text: "Clase renta",
        value: "affiliate_rent_class",
        class: ["table", "white--text"],
        width: "15%",
        sortable: false,
      },
            {
        text: "Estado",
        value: "contribution_state.description",
        class: ["table", "white--text"],
        width: "15%",
        sortable: false,
      },{
        text: "Acciones",
        value: "actions",
        class: ["table", "white--text"],
        width: "20%",
        sortable: false,
      }
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
        this.getSearchPassiveAffiliateContribution();
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
        this.getSearchPassiveAffiliateContribution()
    }
  },
  mounted() {
    this.getSearchPassiveAffiliateContribution();
  },

    computed: {
    //permisos del selector global por rol
    permissionSimpleSelected () {
      return this.$store.getters.permissionSimpleSelected
    },
  },

  methods: {
    async getSearchPassiveAffiliateContribution() {
      try {
        this.loading_table = true;
        let res = await this.$axios.get(
          `/contribution/search_passive_affiliate_contribution`, undefined, {
          params: {
            affiliate_id: this.$route.params.id,
            year: this.searching.year,
            month: this.searching.month,
            contributionable_type: this.searching.contributionable_type,
            affiliate_rent_class: this.searching.affiliate_rent_class,
            contribution_state_id: this.searching.contribution_state_id,
            page: this.options.page,
            per_page: this.options.itemsPerPage,
            sortBy: this.options.sortBy,
            sortDesc: this.options.sortDesc,
          }
          }
        );
        this.contribution_list = res.data;
        console.log(this.contribution_list);
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
    dialogDelete(item){
      this.dialog= true
      this.delete_id=item
      console.log(this.delete_id)
    },
    async deleteItem(){
      try {
        let res = await this.$axios.delete(`/contribution/contributions_passive/${this.delete_id}`)
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
    },
    searchTimeOut() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.getSearchPassiveAffiliateContribution()
      }, 800);
    },
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
