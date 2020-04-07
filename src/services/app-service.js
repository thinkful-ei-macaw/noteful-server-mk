const AppService = (table) => {
  return {
    getItems(db) {
      return db
        .from(table)
        .select();
    },
  
    getItemById(db, id) {
      return db
        .from(table)
        .select()
        .where({ id })
        .first();
    },
  
    addItem(db, folder) {
      return db
        .into(table)
        .insert(folder)
        .returning('*')
        .then(rows => rows[0]);
    },
  
    updateItem(db, id, data) {
      return db
        .from(table)
        .where({ id })
        .update(data);
    },
  
    deleteItem(db, id) {
      return db
        .from(table)
        .where({ id })
        .delete();
    }
  };
};

module.exports = AppService;