const db = require("./root.model");
const addContact = async (todo) => {
  const docRef = await db.collection("contact").add(todo);
  return docRef.id;
};


module.exports = {
  addContact,
};
