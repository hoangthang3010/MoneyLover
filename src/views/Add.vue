<template>
  <div class="container-fluid">
    <div class="row">
      <main role="main" class="col-md-12 ml-sm-auto col-lg-12 pt-3 px-4">
        <div>
          <div
            v-if="showMsg"
            class="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {{ message }}
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="order-md-1 mb-3">
            <a-form @submit.prevent.native="addRow">
              <div class="row justify-content-between align-items-end">
                <div class="col-sm-3">
                  <label for="active">Active</label>
                  <a-select default-value="Du lịch" v-model="active">
                    <div slot="dropdownRender" slot-scope="menu">
                      <v-nodes :vnodes="menu" />
                      <a-divider style="margin: 4px 0;" />
                      <div
                        v-if="addItem"
                        style="padding: 4px 8px; cursor: pointer;"
                        @mousedown="(e) => e.preventDefault()"
                        @click="addItem = !addItem"
                      >
                        <a-icon type="plus" /> Add item
                      </div>
                      <div v-else>
                        <a-input
                          type="text"
                          v-model="addItemValue"
                          @focus="(e) => e.preventDefault()"
                        />
                        <a-button @click="onAddItem">Add</a-button>
                      </div>
                    </div>
                    <a-select-option
                      v-for="item in options"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </div>
                <div class="col-sm-3">
                  <label for="content">Contents</label>
                  <a-input
                    type="text"
                    v-model="content"
                    class="form-control"
                    id="content"
                    required
                  />
                </div>
                <div class="col-sm-3">
                  <label for="date">Date</label>
                  <a-date-picker
                    class="w-100"
                    v-model="date"
                    format="DD/MM/YYYY"
                  />
                </div>
                <div class="col-sm-3">
                  <label for="price">Price</label>
                  <a-input-number
                    type="number"
                    v-model="price"
                    class="form-control w-100"
                    id="price"
                    placeholder="ex: Algiers"
                    required
                  />
                </div>
              </div>
              <div class="mt-1 d-flex justify-content-end">
                <a-button type="primary" html-type="submit" class="mr-2">
                  Submit
                </a-button>
                <a-button @click="onCancelAdd">Cancel</a-button>
                <!-- <a
                    href="https://docs.google.com/spreadsheets/d/1PETTwrEd_wt_12w_9MizACZ9dwW0oXr2J3EHmxlA3SM/edit?usp=sharing"
                    class="btn btn-sm btn-outline-secondary"
                    target="_blank"
                  >
                    View Google Sheet
                  </a> -->
              </div>
            </a-form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("@/client_secret.json");
import moment from "moment";
import { formatPrice } from "../../ultils/helper";
export default {
  name: "AddRow",
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      active: "Du lịch",
      content: "",
      date: "",
      price: "",
      showMsg: false,
      message: "",
      options: [
        // {
        //   value: "eat",
        //   label: "Ăn uống",
        // },
        // {
        //   value: "trip",
        //   label: "Du Lịch",
        // },
        // {
        //   value: "shopping",
        //   label: "Mua sắm",
        // },
        // {
        //   value: "entertainment",
        //   label: "Vui chơi",
        // },
        // {
        //   value: "other",
        //   label: "Dịch vụ khác",
        // },
      ],
      addItem: true,
      addItemValue: "",
    };
  },
  created() {
    this.accessSpreadSheet();
  },
  methods: {
    async accessSpreadSheet() {
      const doc = new GoogleSpreadsheet(
        "1PETTwrEd_wt_12w_9MizACZ9dwW0oXr2J3EHmxlA3SM"
      );
      await doc.useServiceAccountAuth(creds);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[1];
      const rows = await sheet.getRows({
        offset: 0,
      });

      let opt = [];
      rows.map((item) => {
        item.activeList && opt.push(item.activeList);
      });
      this.options = opt;
    },
    async onAddItem() {
      this.addItem = !this.addItem;
      const doc = new GoogleSpreadsheet(
        "1PETTwrEd_wt_12w_9MizACZ9dwW0oXr2J3EHmxlA3SM"
      );
      await doc.useServiceAccountAuth(creds);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[1];
      await sheet.addRow({ activeList: this.addItemValue });
      await this.accessSpreadSheet();
    },
    async addRow() {
      const newRow = {
        active: this.active,
        content: this.content,
        date: moment(this.date).format("DD/MM/YYYY"),
        price: formatPrice(this.price),
        createdDate: "",
      };
      const doc = new GoogleSpreadsheet(
        "1PETTwrEd_wt_12w_9MizACZ9dwW0oXr2J3EHmxlA3SM"
      );
      await doc.useServiceAccountAuth(creds);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      await sheet.addRow(newRow);

      this.message = "New row added !";
      this.showMsg = true;
      this.onCancelAdd();
    },
    onCancelAdd() {
      this.active = "";
      this.content = "";
      this.date = "";
      this.price = "";
      this.$emit("addRow");
    },
  },
};
</script>

<style scoped></style>
