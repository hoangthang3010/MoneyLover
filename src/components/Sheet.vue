<template>
  <div class="container-fluid">
    <div class="row">
      <main role="main" class="col-md-12 ml-sm-auto col-lg-12 pt-3 px-4">
        <div
          class="d-flex justify-content-between align-items-center flex-wrap flex-md-nowrap align-items-center pb-2 mb-2"
        >
          <h2 class="mb-0">Cost of living</h2>
          <h2 class="mb-0">Total all: {{ totalAll | price }}</h2>
          <div class="btn-toolbar mb-2 mb-md-0">
            <a
              href="https://docs.google.com/spreadsheets/d/1PETTwrEd_wt_12w_9MizACZ9dwW0oXr2J3EHmxlA3SM/edit?usp=sharing"
              class="btn btn-sm btn-outline-secondary"
              target="_blank"
            >
              View Google Sheet
            </a>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-end mb-2">
          <a-button v-if="!isAddNew" @click="isAddNew = !isAddNew"
            >Add New Button</a-button
          >

          <Add v-if="isAddNew" @addRow="addRow" />
        </div>
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span v-if="!!selectDate[0]">
            Total details: {{ totalAllDetail | price }}
          </span>
          <span v-else></span>
          <a-range-picker v-model="selectDate" />
        </div>
        <div>
          <a-table
            :columns="columns"
            :data-source="costOfLivingtList"
            bordered
            @change="pagination"
          >
            <template
              v-for="col in ['active', 'content', 'date', 'price']"
              :slot="col"
              slot-scope="text, record, index"
            >
              <div :key="col">
                <div v-if="editingKey === index">
                  <div v-if="col === 'active'">
                    <a-select
                      default-value=""
                      v-model="record.active"
                      @change="(e) => handleChange(activeValue, index, col)"
                    >
                      <a-select-option
                        v-for="item in options"
                        :key="item"
                        :value="item"
                      >
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </div>

                  <a-date-picker
                    v-else-if="col === 'date'"
                    class="w-100"
                    v-model="dateValue"
                    :format="['DD/MM/YYYY', 'DD/MM/YY']"
                    @change="(e) => handleChange(dateValue, index, col)"
                  />

                  <a-input
                    v-else
                    style="margin: -5px 0"
                    :value="text"
                    @change="(e) => handleChange(e.target.value, index, col)"
                  />
                </div>
                <template v-else> {{ text }}</template>
              </div>
            </template>
            <template slot="operation" slot-scope="text, record, index">
              <div class="editable-row-operations">
                <span v-if="editingKey === index">
                  <a @click="() => save(index)">Save</a>
                  <a-popconfirm
                    title="Sure to cancel?"
                    @confirm="() => cancel(index)"
                  >
                    <a>Cancel</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a :disabled="editingKey !== ''" @click="() => edit(index)"
                    >Edit</a
                  >
                  <a-popconfirm
                    title="Sure to cancel?"
                    @confirm="() => deleteRow(index)"
                  >
                    <a :disabled="editingKey !== ''">Delete</a>
                  </a-popconfirm>
                </span>
              </div>
            </template>
          </a-table>
        </div>
        <!-- <div class="table-responsive">
          <table class="table table-striped ">
            <thead>
              <tr>
                <th>Active</th>
                <th>Contents</th>
                <th>Date</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              <Row v-bind:key="row.id" v-for="row in rows" v-bind:row="row" />
            </tbody>
          </table>
        </div> -->
      </main>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: "Active",
    dataIndex: "active",
    width: "15%",
    scopedSlots: { customRender: "active" },
  },
  {
    title: "Content",
    dataIndex: "content",
    width: "40%",
    scopedSlots: { customRender: "content" },
  },
  {
    title: "Price",
    dataIndex: "price",
    width: "20%",
    scopedSlots: { customRender: "price" },
  },
  {
    title: "Date",
    dataIndex: "date",
    scopedSlots: { customRender: "date" },
  },
  {
    title: "Operation",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("@/client_secret.json");
import Add from "../views/Add.vue";
import moment from "moment";
import { formatPrice, formatDate } from "../../ultils/helper";
export default {
  name: "Sheet",
  props: ["sheet"],
  components: {
    Add,
  },
  data() {
    return {
      columns,
      editingKey: "",
      rows: [],
      loading: true,
      isAddNew: false,
      selectDate: [],
      options: [],
      activeValue: "",
      dateValue: "",
      paginationData: {
        current: 1,
        pageSize: 10,
      },
    };
  },
  computed: {
    totalAll() {
      return this.rows.reduce((accumulator, curr) => {
        return (
          accumulator + +curr.price.replaceAll(".", "").replaceAll(",", "")
        );
      }, 0);
    },
    totalAllDetail() {
      return this.costOfLivingtList.reduce((accumulator, curr) => {
        return (
          accumulator + +curr.price.replaceAll(".", "").replaceAll(",", "")
        );
      }, 0);
    },
    costOfLivingtList() {
      let startDate = new Date(moment(this.selectDate[0], "DD/MM/YYYY"));
      let endDate = new Date(moment(this.selectDate[1], "DD/MM/YYYY"));
      startDate = new Date(
        moment(
          `${startDate.getDate()}\
          ${startDate.getMonth() + 1}\
          ${startDate.getFullYear()}`,
          "DD/MM/YYYY"
        )
      );
      endDate = new Date(
        moment(
          `${endDate.getDate()}\
          ${endDate.getMonth() + 1}\
          ${endDate.getFullYear()}`,
          "DD/MM/YYYY"
        )
      );
      return this.selectDate[0]
        ? this.rows.filter((item) => {
            const a = new Date(moment(item.date, "DD/MM/YYYY"));
            return a >= startDate && a <= endDate;
          })
        : this.rows;
    },
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    addRow() {
      this.isAddNew = !this.isAddNew;
      this.accessSpreadSheet();
    },
    async getActiveList() {
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
    async accessSpreadSheet() {
      const doc = new GoogleSpreadsheet(
        "1PETTwrEd_wt_12w_9MizACZ9dwW0oXr2J3EHmxlA3SM"
      );
      await doc.useServiceAccountAuth(creds);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      const rows = await sheet.getRows({
        offset: 0,
      });

      // await sheet.loadCells("A1:E10"); // loads range of cells into local cache - DOES NOT RETURN THE CELLS
      // console.log(sheet.cellStats); // total cells, loaded, how many non-empty
      // const a1 = sheet.getCell(0, 0); // access cells using a zero-based index
      // const c6 = sheet.getCellByA1("C6"); // or A1 style notation
      // console.log(a1, c6);
      this.rows = rows;
      this.cacheData = rows.map((item) => ({ ...item }));
    },
    handleChange(value, key, column) {
      const newData = [...this.rows];
      const target = newData.find((item, i) => key === i);
      if (target) {
        if (column === "date") {
          this.dateValue = formatDate(value);
        }
        target[column] = value;
        this.rows = newData;
      }
    },
    edit(key) {
      const newData = [...this.rows];
      const target = newData.find((item, i) => key === i);
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.activeValue = newData[key].active;
        this.dateValue = moment(newData[key].date, "DD/MM/YYYY");
        this.rows = newData;
      }
    },
    async save(key) {
      const newData = [...this.rows];
      const newCacheData = [...this.cacheData];
      const target = newData.find((item, i) => key === i);
      const targetCache = newCacheData.find((item, i) => key === i);
      if (target && targetCache) {
        delete target.editable;
        newData[key].date = moment(this.dateValue).format("DD/MM/YYYY");
        this.rows = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = "";

      const doc = new GoogleSpreadsheet(
        "1PETTwrEd_wt_12w_9MizACZ9dwW0oXr2J3EHmxlA3SM"
      );
      await doc.useServiceAccountAuth(creds);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      const rows = await sheet.getRows();
      Object.keys(newData[key]).forEach((item) => {
        if (item === "date") rows[key][item] = formatDate(newData[key][item]);
        if (item === "price")
          rows[key][item] = formatPrice(newData[key][item].replaceAll(".", ""));
        rows[key][item] = newData[key][item];
      });
      await rows[key].save();
      this.accessSpreadSheet();
    },
    cancel(key) {
      const newData = [...this.rows];
      const target = newData.find((item) => key === item.key);
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.find((item) => key === item.key)
        );
        delete target.editable;
        this.rows = newData;
      }
    },
    async deleteRow(key) {
      const doc = new GoogleSpreadsheet(
        "1PETTwrEd_wt_12w_9MizACZ9dwW0oXr2J3EHmxlA3SM"
      );
      await doc.useServiceAccountAuth(creds);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      const rows = await sheet.getRows({
        offset: 0,
      });
      const newData = [...this.rows].filter(
        (item, i) => (this.paginationData.current - 1) * 10 + key !== i
      );
      this.rows = newData;
      await rows[(this.paginationData.current - 1) * 10 + key].delete();
      this.accessSpreadSheet();
    },
  },
  created() {
    this.accessSpreadSheet();
    this.getActiveList();
  },
};
</script>

<style scoped></style>
