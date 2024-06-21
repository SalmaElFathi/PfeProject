import { useState } from 'react';
import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { HiPlus } from 'react-icons/hi2';
import { Window, Selected } from '../../../themes/index';
import { useDataContext } from '../../../contexts';
import { OneToOneChatDisplay, CreateOneToOneChatDisplay } from '../../index';

function OneToOneChatList() {

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);

  const { myDetails, oneToOneChatList, friendList } = useDataContext();

  const filteredChats = oneToOneChatList.filter(chat => {
    const username = chat.user.username.toLowerCase();
    return username.startsWith(searchQuery.toLowerCase());
  });

  const handleNewChatClick = () => {
    setShowNewChat(true);
  }

  const handleNewChatClickClose = () => {
    setShowNewChat(false);
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Paper sx={{ height: '100%', minWidth: '22rem', width: '22rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', justifyContent: '', alignItems: 'center', backgroundColor: Window.secondary }} >
      <Stack sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h1' fontSize={'2rem'} fontWeight={'bold'}> Chats </Typography>
        {/* <IconButton onClick={handleNewChatClick} fontSize={'2rem'}> <HiPlus /> </IconButton> */}
      </Stack>

      {/* <Stack>
        <Dialog open={showNewChat} onClose={handleNewChatClickClose}>
          <DialogTitle> <Typography>Create New Chat</Typography> </DialogTitle>
          <DialogContent>
            <Stack sx={{ width: '100%', display: 'flex', gap: '1rem', overflow: 'auto', scrollbarWidth: 'none' }}>
              {
                friendList.filter(friend => friend.status === 'accepted' && !oneToOneChatList.some(chat => chat.user_id_1 === friend.user._id || chat.user_id_2 === friend.user._id)).length === 0 ?
                  (
                    <Box style={{ height: '5rem', width: '20rem', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' }}>
                      <Typography>No friends to start a chat with</Typography>
                    </Box>
                  ) :
                  (
                    friendList.filter(friend => friend.status === 'accepted' && !oneToOneChatList.some(chat => chat.user_id_1 === friend.user._id || chat.user_id_2 === friend.user._id)).map((friend, index) =>
                    (
                      <CreateOneToOneChatDisplay key={index} friendId={friend._id} userId={friend.user._id} fullName={friend.user.full_name} username={friend.user.username} profilePhoto={friend.user.profile_photo} />
                    ))
                  )
              }
            </Stack>
          </DialogContent>
        </Dialog>
      </Stack> */}

      <Stack sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
        <TextField size='small' type='text' sx={{
          width: '100%', borderRadius: '1rem', '& input::placeholder': { color: '#709ce6', opacity: '100%' }, backgroundColor: '#eaf2fe', '& .MuiOutlinedInput-root': { borderRadius: '1rem' },
        }} placeholder='Search Chat By Username' value={searchQuery} onChange={handleSearchChange} />
      </Stack>
      <Stack sx={{ width: '100%', display: 'flex', gap: '1rem', overflow: 'auto', scrollbarWidth: 'none' }}>
        {
          filteredChats.map((data, index) => (
            <OneToOneChatDisplay key={index} chatId={data._id} userId={data.user._id} username={data.user.username} fullName={data.user.full_name} messageCount={data.messageCount} lastMessage={data.messages[data.messages.length - 1].message} lastMessageTime={data.messages[data.messages.length - 1].messageTime} profilePhoto={data.user.profile_photo} />
          ))
        }
        {
          filteredChats.length === 0 &&
          (
            <Box style={{ height: '5rem', width: '20rem', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' }}>
              <Typography>No Chats</Typography>
            </Box>
          )
        }
      </Stack>
    </Paper>
  );
}

export default OneToOneChatList;
