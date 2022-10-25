<template>
  <v-data-table
    :headers="headers"
    :items="addresses"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="info" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      dense
                      :items="cities"
                      item-text="name"
                      item-value="id"
                      label="Ciudad"
                      v-model="editedItem.city_address_id"
                      >
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.zone"
                      label="Zona"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.street"
                      label="Calle"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.number_address"
                      label="Nro"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.description"
                      label="Descripción"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="close"> Cancelar </v-btn>
              <v-btn color="success" text @click="save"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Esta seguro de eliminar el registro?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="closeDelete"
                >Cerrar</v-btn
              >
              <v-btn color="success" text @click="deleteItemConfirm"
                >Confirmar</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small color="info" class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small color="error" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props:{
    affiliate:{
      type: Object,
      require: true
    }
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Ciudad", align: "left", value: "city_address_id" },
      { text: "Zona", align: "left", value: "zone"},
      { text: "Calle", align: "left", value: "street" },
      { text: "Nro", align: "left", value: "number_address" },
      { text: "Descripción", align: "left", value: "description" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    address_affiliate: [],
    editedIndex: -1,
    editedItem: {
      city_address_id: "",
      zone: "",
      street: "",
      number_address: "",
      description: ""
    },
    defaultItem: {
      city_address_id: "",
      zone: "",
      street: "",
      number_address: "",
      description: ""
    },
    addresses: [],
    cities:[]
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva dirección" : "Ediar dirección";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      console.log(val)
    },
    dialogDelete(val) {
      val || this.closeDelete();
      console.log(val)
    },
  },

  mounted() {
    this.getAddress(this.$route.params.id);
    this.getCities()
  },

  methods: {

    editItem(item) {
      this.editedIndex = this.address_affiliate.indexOf(item);
      console.log(this.editedIndex)
      this.editedItem = Object.assign({}, item);
      console.log(this.editedItem)
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.address_affiliate.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.address_affiliate.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.address_affiliate[this.editedIndex], this.editedItem);
      } else {
        this.address_affiliate.push(this.editedItem);
      }
      this.close();
    },
    async getAddress(id) {
      try {
        this.loading = true;
        let res = await this.$axios.get(`/affiliate/affiliate/${id}/address`);
        this.addresses = res;
        // if (this.addresses.length > 0) {
         // Verificar si existe información de dirección
          //Seteando el valor del address
          // let address = this.addresses.find((item) => item.pivot.validated);
          // this.id_street = address.id;
        // }
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },

    async getCities() {
      try {
        this.loading = true
        let res = await this.$axios.get(`/global/city`)
        this.cities = res
        console.log(this.cities)
      } catch (e) {
        console.log(e)
      }
    },
  },
};
</script>

<style>
</style>