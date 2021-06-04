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
        <v-list-item v-if="isAuth">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="user" />
            <v-list-item-subtitle v-text="userType" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
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
export default {
  components: {LoginModal},
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: true,
      items: [
        {
          icon: 'mdi-home',
          title: 'Главная',
          to: '/'
        },
        {
          icon: 'mdi-silverware',
          title: 'Меню',
          to: '/menu'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
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
    }
  },
  async fetch(){

  }
}
</script>
