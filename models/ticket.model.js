const db = require("./root.model");
const addTicketInfor = async (ticket) => {
  const docRef = await db.collection("ticket").add(ticket);
  return docRef.id;
};
const createTicketPayment = async (ticketPayment) => {
  try {
    const docRef = await db.collection("ticketPayment").add(ticketPayment);
    return docRef.id;
  } catch (error) {
    console.log("Error creating ticket payment:", error);
    throw error;
  }
};


module.exports = {
  addTicketInfor,
  createTicketPayment,
};
