<template>
  <div class="old-tickets" id="old-tickets">
    <h2>Befintliga ärenden</h2>
    <div v-if="this.oldTickets">
      <div v-for="ticket in this.oldTickets" :key="ticket">
        <SingleTicket
          :ticket="ticket"
          :localEdit="localEdit"
          @updateTickets="fetchTickets"
          @lockTicket="lockTicket" />
      </div>
    </div>
  </div>
</template>

<script>
import SingleTicket from './SingleTicket.vue'
import io from 'socket.io-client'
const baseURL = import.meta.env.VITE_BASE_URL
const socket = io(baseURL)

export default {
  components: {
    SingleTicket
  },
  data() {
    return {
      oldTickets: [],
      localEdit: {
        ticketId: null
      }
    }
  },
  beforeCreate() {
    socket.emit('request-tickets')

    // Get the tickets when 'ticket' is emitted
    socket.on('tickets', (data) => {
      this.oldTickets = data
    })
  },
  methods: {
    fetchTickets(data) {
      socket.emit('update-tickets', data)
    },
    lockTicket(id) {
      // This is to set the id of ticked editing locally
      this.localEdit.ticketId = id
    }
  }
}
</script>
