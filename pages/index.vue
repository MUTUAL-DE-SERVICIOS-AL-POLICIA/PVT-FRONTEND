<template>
  <div id="background-page">
    <v-container md="2" not-gutters align-center justify-center>
      <v-row class="mt-7" wrap justify="center" mt="10px">
        <v-col lg="8" md="8 " sm="8">
          <v-row  style="height: 848px">
            <v-img
              gradient="to top right , rgba(25,32,72,.7), #0AADB3"
              height="848px"
              :src="require('@/assets/images/muserpol.jpg')"
            >
              <v-row justify="center" align="center" style="height: 848px">
                <v-col class="text-center" lg="6" md="12" sm="12">
                    <h1 class="textPrimary--text" id="letra">
                      BIENVENIDOS A LA PLATAFORMA VIRTUAL DE TRAMITES
                    </h1>
                </v-col>
              </v-row>
            </v-img>
          </v-row>
        </v-col>

        <v-col class="background" lg="4" md="4" sm="4">
          <v-row justify="center" style="height: 848px">
            <v-col
              class="mt-5"
              align-self="center"
              lg="11"
              md="11"
              sm="11"
              style="min"
            >
              <v-img
                height="max"
                width="max"
                :src="require('@/assets/images/logo.png')"
              >
              </v-img>
            </v-col>
            <v-col lg="11" md="11" sm="11">
              <Login />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import Login from "@/components/auth/Login.vue";
export default {
  name: "PageLogin",
  components: {
    Login,
  },
};
</script>
<style>
#background-page {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  width: auto;
  height: auto;
  background: -webkit-gradient(
    linear,
    left top,
    right bottom,
    color-stop(0%, #385f73),
    color-stop(100%, #0aadb3)
  ); /* Chrome,Safari4+ */
  /* aumentarle filtro filtro 
  z-index: 1;
	opacity: 0.7; */
}
#image {
  z-index: 1;
  opacity: 0.7;
  -webkit-filter: blur(2px);
}

#letra {
  text-shadow: 2px 2px 2px #385f73;
}

#border {
  border-radius: 40%;
}
</style>