<template>
  <v-data-table
    :headers="headers"
    :items="addresses"
    sort-by="city_address_id"
    class="elevation-1"
    :key="refreshAddressTable"
    hide-default-footer
  >
    <template v-slot:item="props">
      <tr>
        <td>{{ city_name(props.item) }}</td>
        <td>{{ props.item.zone }}</td>
        <td>{{ props.item.street }}</td>
        <td>{{ props.item.number_address }}</td>
        <td>{{ props.item.description }}</td>
        <!-- <td>
          <v-radio-group
            :value="id_street"
            @change="id_street = props.item.id"
            :disabled="!sync_up.editable"
          >
            <v-radio :value="props.item.id"></v-radio>
          </v-radio-group>
        </td>
        <td>
          <v-icon
            small
            color="info"
            class="mr-2"
            :disabled="!sync_up.editable"
            @click="editItem(props.item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            color="error"
            @click="deleteItem(props.item)"
            :disabled="props.item.id === id_street || !sync_up.editable"
          >
            mdi-delete
          </v-icon>
        </td> -->
      </tr>
    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="info"
              dark
              class="mb-2"
              disabled
              v-bind="attrs"
              v-on="on"
            >
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
            <v-card-title class="text-h5">Esta seguro de eliminar el registro?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="closeDelete">Cerrar</v-btn>
              <v-btn color="success" text @click="deleteItemConfirm"
                >Confirmar</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    affiliate: {
      type: Object,
      require: true,
    },
    obj_address: {
      tyoe: Object,
      require: true,
    },
    sync_up: {
      type: Object,
      require: true,
    },
    cancel: {
      type: Boolean,
      require: true,
    },
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Ciudad", align: "left", value: "city_address_id" },
      { text: "Zona", align: "left", value: "zone" },
      { text: "Calle", align: "left", value: "street" },
      { text: "Nro", align: "left", value: "number_address" },
      { text: "Descripción", align: "left", value: "description" },
      //{ text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      city_address_id: null,
      zone: null,
      street: null,
      number_address: null,
      description: null,
    },
    defaultItem: {
      city_address_id: null,
      zone: null,
      street: null,
      number_address: null,
      description: null,
    },
    cities: [],
    editedIndexPerRef: -1,
    id_street: 0,
    addresses: [],
    refreshAddressTable: 0,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva dirección" : "Ediar dirección";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      console.log(val);
    },
    dialogDelete(val) {
      val || this.closeDelete();
      console.log(val);
    },
    id_street(newVal, oldVal) {
      if (newVal != oldVal) {
        this.obj_address.addresses = this.addresses;
        this.obj_address.id_street = this.id_street;
      }
    },
    cancel() {
      if (this.cancel) {
        console.log(this.cancel)
        this.verifyCancelAddress();
      }
    },
    refreshAddressTable(newVal, oldVal){
      if(newVal != oldVal){
      this.getAddress(this.$route.params.id);
      }
    }

  },

  mounted() {
    this.getCities();
    this.getAddress(this.$route.params.id);
  },

  methods: {
    async editItem(item) {
      this.editedIndex = this.addresses.indexOf(item);
      console.log(this.editedIndex);
      this.editedItem = Object.assign({}, item);
      console.log(this.editedItem);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.addresses.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await this.$axios.delete(`/affiliate/address/${this.editedItem.id}`);
      this.addresses.splice(this.editedIndex, 1);
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

    async save() {
      try {
        if (this.editedIndex > -1) {
          console.log(this.editedIndex);
          Object.assign(this.addresses[this.editedIndex], this.editedItem);
          console.log(this.editedItem);
          let res = await this.$axios.patch(`/affiliate/address/${this.editedItem.id}`);
          this.editedItem = res;
          console.log(this.editedItem);
        } else {
          let res1 = await this.$axios.post(`/affiliate/address`, {
            city_address_id: this.editedItem.city_address_id,
            zone: this.editedItem.zone,
            street: this.editedItem.street,
            number_address: this.editedItem.number_address,
            description: this.editedItem.description,
          });
          this.addresses.push(res1);
          console.log(this.editedIndex);
        }
        this.obj_address.addresses = this.addresses;
        this.obj_address.id_street = this.id_street;

        this.close();

      } catch (e) {
        console.log(e);
      }
    },
    async getCities() {
      try {
        this.loading = true;
        let res = await this.$axios.get(`/global/city`);
        this.cities = res;
        console.log(this.cities);
      } catch (e) {
        console.log(e);
      }
    },
    async getAddress(id) {
      try {
        this.loading = true;
        let res = await this.$axios.get(`/affiliate/affiliate/${id}/address`);
        this.addresses = res;
        if (this.addresses.length > 0) {
          // Verificar si existe información de dirección
          // Obtener la dirección activa
          let address = this.addresses.find((item) => item.pivot.validated);
          this.id_street = address.id;
        }
        let res2 = await this.$axios.get(`/affiliate/affiliate/${id}/address`);
        this.obj_address.addresses_aux = res2
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    city_name(item) {
      let city_item = this.cities.find((o) => o.id == item.city_address_id);
      let object_city_item = Object.assign({}, city_item);
      return object_city_item.name;
    },
    async verifyCancelAddress() {
      try {
        if (this.cancel) {
          let address_new = this.obj_address.addresses.map((o) => o.id);
          let address_origin = this.obj_address.addresses_aux.map((o) => o.id);
          console.log(address_new);
          console.log(address_origin);

          for(let i=0;i<address_new.length;i++){
              let element = address_new[i]
              if(address_origin.includes(element)){
                  console.log(`coincide '${element}'`)
              }else{
                console.log(address_new[i])
                await this.$axios.delete(`/affiliate/address/${address_new[i]}`);
                this.getAddress(this.$route.params.id)
              }
          }
          this.refreshAddressTable++
        }
      } catch (e) {
        console.log();
      }
    },
  },
};
</script>

<style>
</style>