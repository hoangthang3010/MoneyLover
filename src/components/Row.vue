<template>
  <tr>
    <td>{{ row.active }}</td>
    <td>{{ row.content }}</td>
    <td>{{ row.date | formatDate }}</td>
    <td>{{ row.price | price }}</td>
  </tr>
</template>

<script>
export default {
  name: "Row",
  props: ["row"],
};
</script>

<style scoped></style>
