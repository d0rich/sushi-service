<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item to="/register" v-if="!isAuth">
          <v-list-item-action>
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content v-text="'Регистрация'"/>
        </v-list-item>
        <login-modal v-if="!isAuth">
          <v-list-item link >
            <v-list-item-action>
              <v-icon>mdi-login</v-icon>
            </v-list-item-action>
            <v-list-item-content v-text="'Вход'"/>
          </v-list-item>
        </login-modal>

        <v-list-item link v-if="isAuth" @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content v-text="'Выход'"/>
        </v-list-item>

        <v-list-item to="/personal" v-if="isAuth">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="user" />
            <v-list-item-subtitle v-text="userType" />
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          :exact="item.exact"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/orders" router exact v-if="$store.getters['auth/isAuth']" >
          <v-list-item-action>
            <v-badge :content="$store.state.orders.events" :value="$store.state.orders.events">
              <v-icon>mdi-format-list-bulleted-square</v-icon>
            </v-badge>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'Заказы'" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/cart" router exact >
          <v-list-item-action>
            <v-badge color="red"
                     :content="`+${$store.state.cart.events}`" :value="$store.state.cart.events">
              <v-badge bottom :content="$store.getters['cart/positionsCount']"
                       :value="$store.getters['cart/positionsCount']">
              <v-icon>mdi-cart</v-icon>
              </v-badge>
            </v-badge>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'Корзина'" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      dark
      color="primary"
      app
    >
      <v-btn icon @click.stop="drawer = !drawer">
        <v-badge light bordered :content="$store.state.orders.events" :value="$store.state.orders.events">
          <v-icon>
            mdi-menu
          </v-icon>
        </v-badge>
      </v-btn>
      <v-spacer />
      <img :src="imgSrc" alt="logo" style="height: 80%">
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon to="/cart" class="ma-2">
        <v-badge color="red" bordered light
                 :content="`+${$store.state.cart.events}`" :value="$store.state.cart.events">
          <v-badge bottom :content="$store.getters['cart/positionsCount']"
                   :value="$store.getters['cart/positionsCount']">
              <v-icon>mdi-cart</v-icon>
          </v-badge>
        </v-badge>
      </v-btn>


    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import LoginModal from "~/components/auth/LoginModal";
import logo from '~/static/sushi.svg'
export default {
  components: {LoginModal},
  data () {
    return {
      clipped: false,
      imgSrc: logo,
      drawer: false,
      fixed: true,
      items: [
        {
          icon: 'mdi-home',
          title: 'Главная',
          to: '/',
          exact: true
        },
        {
          icon: 'mdi-silverware',
          title: 'Меню',
          to: '/menu',
          exact: false
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Суши от Надюши'
    }
  },
  computed:{
    ...mapGetters({
      userType: "auth/authUserType",
      isAuth: "auth/isAuth"
    }),
    user(){
      return this.$store.state.auth.login
    }
  },
  methods: {
    ...mapActions({
      authByToken: "auth/authByToken",
      logout: "auth/logout"
    })
  },
  async created(){
    if (process.browser){
      const token = localStorage.getItem('token')
      if (token) await this.authByToken(token)
      this.$store.commit("cart/cartFromLocalStorage")
      this.$store.dispatch("orders/startListen")
    }
  },
  async fetch(){

  }
}
</script>

