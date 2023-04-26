import moment from "moment";
export function formatPrice(value) {
  if (!value && value !== 0) return 0;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
export function formatDate(date) {
  if (date) {
    return moment(date, "DD/MM/YYYY").format("DD/MM/YYYY");
  }
  return "";
}
