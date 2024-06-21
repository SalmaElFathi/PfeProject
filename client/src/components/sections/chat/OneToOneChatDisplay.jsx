import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider, TextField, colors, Button } from '@mui/material';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { Window, Selected, Font } from '../../../themes/index';
import { useDataContext } from '../../../contexts/index';
import { useEffect, useState } from 'react';

function OneToOneChatDisplay({
  index,
  chatId,
  userId,
  fullName,
  username,
  profilePhoto,
  lastMessage,
  messageCount,
  lastMessageTime
}) {

  const { selectedSectionWindow, setSelectedSectionWindow, selectedChat, setSelectedChat, onlineUsers } = useDataContext();

  const handleChatWindowClick = (buttonKey) => {
    setSelectedChat(chatId);
    setSelectedSectionWindow(buttonKey);
  };

  const formatDate = (dateString) => {
    const messageDate = new Date(dateString);
    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - messageDate.getTime();
    const hoursDifference = timeDifference / (1000 * 3600);

    if (hoursDifference < 24) {
      return `${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (hoursDifference < 48) {
      return `Yesterday ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  }

  const maxLength = 10;

  const truncateMessage = (lastMessage) => {
    if (lastMessage.length > maxLength) {
      return lastMessage.substring(0, maxLength) + '...';
    }
    return lastMessage;
  };

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (onlineUsers.includes(userId)) {
      setIsOnline(true)
    }
    else {
      setIsOnline(false);
    }
  }, [onlineUsers]);

  return (
    <IconButton style={{ height: '5rem', width: '100%', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'space-between', alignItems: 'center', backgroundColor: selectedChat === chatId ? Selected.primary : Selected.secondary, borderRadius: '15px' }} onClick={() => handleChatWindowClick(1)}>
      <Stack direction={'row'} spacing={1} position={'relative'}>
        {/* <Avatar src={profilePhoto} sx={{ height: '3.5rem', width: '3.5rem' }}></Avatar>
        {
          isOnline ?
            <>
              <Box sx={{ height: '9px', width: '9px', bgcolor: '#76d45e', borderRadius: '50%', position: 'absolute', top: '2.9rem', left: '2rem' }}></Box>
            </>
            :
            <></>
        }
        <Stack spacing={0.8} alignItems={'start'} textAlign={'start'}>
          <Typography color={Font.primary} fontWeight={'bold'} >{fullName}</Typography>
          <Typography>{truncateMessage(lastMessage)}</Typography>
        </Stack> */}

        <Stack direction={'row'} spacing={1} >
          {/* <IconButton disabled={true}><Avatar src={profilePhoto} sx={{ height: '3.5rem', width: '3.5rem' }}></Avatar></IconButton> */}
          <Avatar src={profilePhoto} sx={{ height: '3.5rem', width: '3.5rem' }}></Avatar>
          <Stack spacing={0.8} justifyContent={'center'} alignItems={'start'}>
            <Typography color={Font.primary} fontWeight={'bold'} >{username}</Typography>
            {
              lastMessage == '' ?
                <Typography sx={{ height: '33%' }}></Typography>
                :
                <Typography>{truncateMessage(lastMessage)}</Typography>
            }
          </Stack>
        </Stack>
      </Stack>
      <Stack spacing={0.8} alignItems={'end'}>
        <Typography>{formatDate(lastMessageTime)}</Typography>
        {
          messageCount !== 0 ?
            <Typography fontSize={'14px'} sx={{ height: '1.6rem', width: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Selected.primary, borderRadius: '50%', color: Selected.secondary }}>
              {messageCount > 9 ? '10+' : messageCount}
            </Typography>
            :
            <Typography fontSize={'14px'} sx={{ height: '1.6rem', width: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
        }
      </Stack>
    </IconButton>
  );
}

export default OneToOneChatDisplay;
