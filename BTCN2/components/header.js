export default {
  props: {
    darkMode: Boolean,
  },
  methods: {
    toggleDarkMode() {
      this.$emit('dark-mode-changed', !this.darkMode);
    },
  },
  template: 
  `
    <header class="row bg-light p-2 m-1 mt-0 border rounded">
    <div class="col-12 d-flex justify-content-between align-items-center">
      <div class="mssv">21120297</div>
      <h3> Movies info </h3>
      <div class="d-flex flex-column">
        <div class="text-end">21297</div>
        <div class="form-check form-switch mt-4">
          <input
            class="form-check-input p-2"
            type="checkbox"
            role="switch"
            id="mode-checkbox"
            v-model="darkMode"
            @change="toggleDarkMode"
          />
          <label class="form-check-label" for="mode-checkbox">Dark Mode</label>
        </div>
      </div>
    </div>
    </header>
  `
};

  