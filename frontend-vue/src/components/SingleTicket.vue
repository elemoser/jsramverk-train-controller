<template>
  <div>
    <div v-if="editing">
      <form @submit.prevent="saveEdit" v-if="codes">
        <span>{{ ticket._id }} - </span>
        <select v-model="newCode">
          <option v-for="code in codes" :key="code" :value="code.Code">
              {{ code.Code }} - {{ code.Level3Description }}
          </option>
        </select>
        <span> - {{ ticket.trainnumber }} - {{ ticket.traindate }}</span>
        <button type="submit">save</button>
        <button @click="unlockTicket">cancel</button>
      </form>
    </div>
    <div v-else>
      <span>{{ ticket._id }} - {{ ticket.code }} - {{ ticket.trainnumber }} - {{ ticket.traindate }}</span>
      <button
        v-if="!locked && !editing"
        @click="editTicket"
        >edit</button>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client"
const baseURL = import.meta.env.VITE_BASE_URL
const graphqlURL = import.meta.env.VITE_GRAPHQL_URL
const socket = io(baseURL)

export default {
    props: [
      'ticket',
      'localEdit'
    ],
    emits: [
      'lockTicket',
      'updateTickets'
    ],
    data() {
      return {
        currentCode: '',
        newCode: '',
        codes: null,
        locked: this.ticket.locked,
        editing: false
      }
    },
    mounted() {
      if (this.locked && this.localEdit.ticketId === this.ticket._id) {
          this.codes = this.$store.codes
          this.editing = true
          this.currentCode = this.ticket.code
          this.newCode = this.ticket.code
      }
      // This is to unlock a ticket if a person leaves the site before saving
      if (this.editing) {
        window.addEventListener('beforeunload', this.unlockTicket);
      }
    },
    methods: {
      editTicket() {
        // If another tick
        if (this.localEdit.ticketId !== this.ticket._id) {
          socket.emit('unlock-ticket', this.localEdit.ticketId)
          this.localEdit.ticketId = null
        }

        if (!this.locked) {
          this.$emit('lockTicket', this.ticket._id)
          socket.emit('lock-ticket', this.ticket._id)
        }
      },
      // TODO Add functionality to delete a ticket
      saveEdit() {
        // Function to save the edit made to a ticket
        if (this.newCode != this.currentCode) {
          const mutationUpdateTicket = `mutation {
          updateTicket (
            _id: "${this.ticket._id}",
            code: "${this.newCode}"
            ){
              _id
              code
            }
          }`

          try {
            // Fetch data via graphql
            fetch(`${graphqlURL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-access-token': this.$store.jwt
            },
            body: JSON.stringify({ query: mutationUpdateTicket })
            })
            .then(response => response.json())
            .then(result => {
              if (result.errors) {
                window.alert(result.errors[0].message)
              }
              socket.emit('update-tickets', result.data.updateTicket)
            })
          } catch (error) {
            console.error('Error fetching data:', error)
          }
        }

        // reset ticket
        this.unlockTicket()
      },
      unlockTicket() {
        this.locked = false
        this.localEdit.ticketId = null
        socket.emit('unlock-ticket', this.ticket._id)
      }
    }
}
</script>

<style scoped>
</style>
