import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({ open: false }),
  actions: {
    switcher() {
      this.open = !this.open;
    },
    screenWidthChecker(width) {
      width >= 1024 ? (this.open = true) : (this.open = false);
    },
  },
});
