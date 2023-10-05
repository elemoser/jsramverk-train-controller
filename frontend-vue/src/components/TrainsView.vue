<script>
import DelayedTable from './DelayedTable.vue'
import DelayedMap from './DelayedMap.vue'

export default {
  components: {
    DelayedTable,
    DelayedMap
  },
  data() {
    return {
      trainInfo: null
    };
  },
  methods: {
    handleTrainInfo(data) {
      this.trainInfo = data;
    }
  }
}

</script>

<template>
  <div class="container">
    <DelayedTable @train-info="handleTrainInfo" />
    <DelayedMap :trainInfo="trainInfo" />
  </div>
</template>
