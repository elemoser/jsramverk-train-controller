<template>
  <div class="delayed">
    <h1>Försenade Tåg</h1>
    <div class="delayed-trains" v-if="delayedTrains">
      <div v-for="trains in delayedTrains" :key="trains" @click.self="renderTicketView(trains)">
        <div class="train-number">
          {{ trains.OperationalTrainNumber }}
        </div>
        <div class="current-station">
          <div>{{ trains.LocationSignature }}</div>
          <div v-if="trains.FromLocation && trains.ToLocation">
            {{ trains.FromLocation[0].LocationName }} -> {{ trains.ToLocation[0].LocationName }}
          </div>
          <div v-else></div>
        </div>
        <div class="delay">{{ trains.delayInMin }} minuter</div>
        <div>
          <button style="padding: 0.6em;" @click="renderSingleMarker(trains.OperationalTrainNumber)">&#9906;</button>
        </div>
      </div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
// Store is used to store train-data when clicking a delayed train
import store from '../store/store'
const graphqlURL = import.meta.env.VITE_GRAPHQL_URL
// Define data needed from backend
const queryDelayed = `{
  delayed {
    AdvertisedTimeAtLocation
    EstimatedTimeAtLocation
    OperationalTrainNumber
    LocationSignature
    FromLocation {
      LocationName
    }
    ToLocation {
      LocationName
    }
  }
}`

export default {
  data() {
    return {
      delayedTrains: null,
      delays: null
    }
  },
  created() {
      try {
        // Fetch data via graphql
        fetch(`${graphqlURL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query: queryDelayed })
        })
        .then(response => response.json())
        .then(data => {
          // Store received data in component variable
          this.delayedTrains = data.data.delayed
          store.delays = this.delayedTrains
          const numberOfDelays = Object.entries(this.delayedTrains).length
          for (let i = 0; i < numberOfDelays; i++) {
            const date1 = new Date(this.delayedTrains[i].AdvertisedTimeAtLocation)
            const date2 = new Date(this.delayedTrains[i].EstimatedTimeAtLocation)
            // Calculate delay in minutes
            const differenceInMilliseconds = Math.abs(date1 - date2)
            const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60))
            // Add delay to object
            this.delayedTrains[i].delayInMin = differenceInMinutes
          }
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  methods: {
    renderTicketView(trainObject) {
      // Save train in store, then change route.
      store.train = trainObject
      this.$router.push('/tickets')
    },
    renderSingleMarker(trainNumber) {
      // console.log(trainNumber)
      this.$emit('train-info', trainNumber)
    }
  }
}
</script>
