// const GetFriendsWithDetailsFromUserId = require('./GetFriendsWithDetailsFromUserId');
// const GetUsersFromUsername = require('./GetUsersFromUsername');
// module.exports = { GetUserIdFromSocket, GetUserDetailsFromUserId, GetFriendsWithDetailsFromUserId, GetUsersFromUsername, GetOneToOneChatListWithDetailsFromUserId, GetGroupChatListWithDetailsFromUserId };

const GetUserIdFromSocket = require('./GetUserIdFromSocket');
const GetUserDetailsFromUserId = require('./GetUserDetailsFromUserId');
const GetOneToOneChatListWithDetailsFromUserId = require('./GetOneToOneChatListWithDetailsFromUserId')

module.exports = { GetUserIdFromSocket, GetUserDetailsFromUserId, GetOneToOneChatListWithDetailsFromUserId };
