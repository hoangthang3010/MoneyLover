<template>
  <tr>
    <td>{{ row.active }}</td>
    <td>{{ row.content }}</td>
    <td>{{ row.date }}</td>
    <td>{{ row.price }}</td>
  </tr>
</template>

<script>
export default {
  name: "Row",
  props: ["row"],
};
</script>

<style scoped></style>
