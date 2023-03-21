import axios from "axios";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    message: "",
    statusCode: null,
  }),
  getters: {
    isAuth: (state) => state.user !== null,
  },
  actions: {
    async loginUser(username, password) {
      try {
        const response = await axios.post("login", {
          username: username,
          password: password,
        });
        this.user = response.data;
        this.message = "";
        this.statusCode = response.status;
        return this.statusCode;
      } catch (error) {
        if (error.response) {
          this.statusCode = error.response.status;
          this.message = error.response.data.msg;
          return this.statusCode;
        }
      }
    },
    async logoutUser() {
      await axios.delete("logout");
      this.$reset();
      localStorage.removeItem("auth");
    },
    async getMe() {
      try {
        const response = await axios.get("me");
        this.user = response.data;
        this.message = "";
        this.statusCode = response.status;
      } catch (error) {
        if (error.response) {
          this.$reset();
          localStorage.removeItem("auth");
          this.statusCode = error.response.status;
          this.message = error.response.data.msg;
        }
      }
    },
  },
});
