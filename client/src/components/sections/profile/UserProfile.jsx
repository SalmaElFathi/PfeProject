import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider, TextField, colors, Button } from '@mui/material';
import { HiOutlineTrash, HiXMark } from 'react-icons/hi2';
import { Window, Selected, Font } from '../../../themes/index';
import { useDataContext } from '../../../contexts/index';
import { useEffect, useState } from 'react';

function UserProfile() {

  const { setSubSelectedSectionWindow, setSelectedUserProfile } = useDataContext();

  const handleCloseSubSectionWindow = () => {
    setSubSelectedSectionWindow(null);
    setSelectedUserProfile(null);
  }
  const { userDetails, server } = useDataContext();

  return (
    <Box style={{ height: '100%', width: '100%', maxWidth: '25rem', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: Window.secondary, borderRadius: '15px' }}>

      <Stack alignItems={'start'}>
        <IconButton onClick={handleCloseSubSectionWindow}>
          <HiXMark />
        </IconButton>
      </Stack>

      <Stack spacing={3} sx={{ width: '100%', alignItems: 'start', justifyContent: 'space-between' }}>
        <Stack sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Avatar sx={{ height: '7rem', width: '7rem' }} src={userDetails.profile_photo} />
        </Stack>
        <Divider orientation='horizontal' sx={{ width: '100%' }} />
        <Stack spacing={3} direction={'row'} sx={{ width: '100%', alignItems: 'start' }}>
          <Typography fontWeight={'bold'}>Full Name :</Typography>
          <Typography fontWeight={'bold'}>{userDetails.full_name}</Typography>
        </Stack>
        <Divider orientation='horizontal' sx={{ width: '100%' }} />
        <Stack spacing={3} direction={'row'} sx={{ width: '100%', alignItems: 'start' }}>
          <Typography fontWeight={'bold'}>Username :</Typography>
          <Typography fontWeight={'bold'}>{userDetails.username}</Typography>
        </Stack>
        <Divider orientation='horizontal' sx={{ width: '100%' }} />
        {/* <Stack spacing={3} direction={'row'} sx={{ width: '100%', alignItems: 'start' }}>
          <Typography fontWeight={'bold'}>Joined At : </Typography>
          <Typography fontWeight={'bold'}>02/11/2001</Typography>
        </Stack>
        <Divider orientation='horizontal' sx={{ width: '100%' }} /> */}
      </Stack>

    </Box>
  );
}

export default UserProfile;
