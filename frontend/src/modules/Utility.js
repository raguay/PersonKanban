export default {
  getUserStyle: function(styles, currentUser) {
    return styles.find(item => item.userID === currentUser);
  },
  getKanbanUserInfo: function(Kanban,userName) {
    return Kanban.users.find(user => user.name === userName);
  },
  getUserBoards: function(Kanban, userID) {
    return Kanban.Spaces.find( space => space.userID === userID).boards;
  }
}
