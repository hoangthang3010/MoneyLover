import Vue from "vue";
import moment from "moment";
const price = Vue.filter("price", function(value) {
  if (!value && value !== 0) return 0;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

const formatDate = Vue.filter("formatDate", function(date) {
  if (date) {
    return moment(date, "DD/MM/YYYY").format("DD/MM/YYYY");
  }
  return "";
});

export default {
  price,
  formatDate,
};
