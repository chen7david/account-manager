
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, userId: 'US6678366174108', username: 'chen7david', email: 'chen7david@me.com', password:'$2b$12$REmobVeLERSdXDrN0hd09ueDKcsZa0y4eBx2hqjoz/7/iGm.v6tEy', isDisabled: false, isDeveloper: true},
        {id: 2, userId: 'US6985197281057', username: 'maxjia', email: 'chen7david@gmail.com', password:'$2b$12$REmobVeLERSdXDrN0hd09ueDKcsZa0y4eBx2hqjoz/7/iGm.v6tEy', isDisabled: false},
      ]);
    });
};
