const ticketModel = require('../models/tickets.js');

async function socketTicketSetup(io) {
    // Function to initialize tickets outside the io.
    let tickets = await ticketModel.getTickets();

    // Setting all tickets to not locked when initializing
    tickets.map(ticket => {
        ticket.locked = false;

        return ticket;
    });

    io.sockets.on('connection', (socket) => {
        // This is used if only needed to get the tickets
        socket.on('request-tickets', () => {
            socket.emit('tickets', tickets);
        });

        // This is used when locking a ticket, setting locked to true for all
        socket.on('lock-ticket', (ticketId) => {
            tickets.map(ticket => {
                if (ticketId == ticket._id.toString()) {
                    ticket.locked = true;
                }
                return "ticket";
            })
            io.emit('tickets', tickets);
        });

        // This is used to unlock a ticket for all
        socket.on('unlock-ticket', (ticketId) => {
            tickets.map(ticket => {
                if (ticketId == ticket._id.toString()) {
                    ticket.locked = false;
                }
                return ticket;
            })
            io.emit('tickets', tickets);
        });

        // This is used for when a ticket is updated or created
        socket.on('update-tickets', async (ticketData) => {
            // Ticketdata is provieded when updating or creating new ticket
            if (ticketData) {
                let found = false;
    
                tickets.map(ticket => {
                    if (ticket._id.toString() === ticketData._id) {
                        found = true;
                        
                        ticket.code = ticketData.code;
                    }
    
                    return ticket;
                })
    
                if (!found) {
                    tickets.push(ticketData);
                }
            }
            io.emit('tickets', tickets);
        })
    })
}

module.exports = socketTicketSetup

