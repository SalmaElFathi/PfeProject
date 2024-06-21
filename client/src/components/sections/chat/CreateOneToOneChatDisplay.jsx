import React from 'react';
import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider, TextField, colors, Button } from '@mui/material';
import { HiOutlinePlus } from 'react-icons/hi2';
import { Window, Selected, Font } from '../../../themes/index';
import { useDataContext } from '../../../contexts/index';
import { useEffect, useState } from 'react';

function CreateOneToOneChatDisplay({
  index,
  friendId,
  userId,
  fullName,
  username,
  profilePhoto
}) {

  const { myDetails, server } = useDataContext();

  const handleCreateOneToOneChat = async () => {
    await server.emit('createOneToOneChat', { friendId: friendId, user_id_1: myDetails._id, user_id_2: userId, date: new Date().toISOString() });
  }

  return (
    <Box style={{ height: '5rem', width: '20rem', display: 'flex', gap: '1rem', padding: '0rem 0.5rem', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Window.primary, borderRadius: '15px' }}>

      <Stack direction={'row'} spacing={1} >
        <IconButton><Avatar src={profilePhoto} sx={{ height: '3.5rem', width: '3.5rem' }}></Avatar></IconButton>
        <Stack spacing={0.8} justifyContent={'center'} alignItems={'start'}>
          <Typography color={Font.primary} fontWeight={'bold'} >{fullName}</Typography>
          <Typography>{username}</Typography>
        </Stack>
      </Stack>

      <Stack spacing={0.8} alignItems={'end'}>
        <IconButton onClick={handleCreateOneToOneChat}><HiOutlinePlus /></IconButton>
      </Stack>
    </Box>
  );
}

export default CreateOneToOneChatDisplay;
