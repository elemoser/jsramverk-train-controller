<template>
  <div class="ticket-container">
    <!-- 
      Only the if-statment below is needed for rendering components when logged in
      <div v-if="this.$store.jwt" class="ticket"> 
    -->
    <div class="ticket">
      <NewTickets @ticketAdded="fetchOldTickets"/>
    </div>
    <br />
    <OldTickets ref="OldTickets"/>
  </div>
</template>

<script>
import OldTickets from './OldTickets.vue'
import NewTickets from './NewTickets.vue'

export default {
  components: {
    OldTickets,
    NewTickets
  },
  beforeCreate() {
    if (!this.$store.train) {
      // Checks if there is a train in store, if not redirect to '/'
      this.$router.push('/')
    }
  },
  methods: {
    fetchOldTickets(data) {
      // Rerender the oldTicket component by "re-fetching" data from API
      this.$refs.OldTickets.fetchTickets(data)
    }
  }
};
</script>
