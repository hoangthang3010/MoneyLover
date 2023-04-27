<template>
  <div id="app">
    <div id="nav">
      <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
        <router-link
          class="navbar-brand col-sm-3 col-md-2 mr-0"
          to="/"
          style="color: gray"
          >Thắng ♥ Nhài</router-link
        >
        <!-- <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search"> -->
        <ul class="navbar-nav px-3">
          <li class="nav-item text-nowrap">
            <router-link
              class="nav-link"
              to="/receive-gift"
              v-if="$route.path !== '/receive-gift'"
              >Click to receive the gift</router-link
            >
          </li>
        </ul>
      </nav>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return { show: true };
  },
};
</script>

<style>
.container {
  max-width: 960px;
}

.border-top {
  border-top: 1px solid #e5e5e5;
}
.border-bottom {
  border-bottom: 1px solid #e5e5e5;
}
.border-top-gray {
  border-top-color: #adb5bd;
}

.box-shadow {
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.05);
}

.lh-condensed {
  line-height: 1.25;
}

.ant-popover-inner-content {
  padding: 10px !important;
}
.ant-table-wrapper .ant-pagination.ant-table-pagination {
  position: sticky;
  top: 0;
  right: 0;
}
@media only screen and (max-width: 576px) {
  .mt-ms-1 {
    margin-top: 1rem;
  }
}
</style>
