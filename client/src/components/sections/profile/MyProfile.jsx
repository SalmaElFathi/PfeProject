import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Input, Paper, Stack, Avatar, Button, IconButton, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { HiPlus, HiOutlinePencilSquare } from 'react-icons/hi2';
import { Window, Selected } from '../../../themes/index';
import { useDataContext } from '../../../contexts';
import axios from 'axios';
import { Server } from '../../../config';

function MyProfile() {

  const navigate = useNavigate();
  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/signin')
  }

  const { myDetails, server } = useDataContext();

  const fileInputRef = useRef(null);

  const [displayProfilePhoto, setDisplayProfilePhoto] = useState('');
  const [encodedProfilePhoto, setEncodedProfilePhoto] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isEmailError, setIsEmailError] = useState(false);
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setDisplayProfilePhoto(myDetails.profile_photo);
    setEncodedProfilePhoto(myDetails.profile_photo)
    setFullName(myDetails.full_name);
    setEmail(myDetails.email);
    setUsername(myDetails.username);
  }, [myDetails])

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/jpeg') {

      const imageUrl = URL.createObjectURL(file);
      setDisplayProfilePhoto(imageUrl);

      const reader = new FileReader();

      reader.onload = (e) => {
        const imageData = e.target.result;
        setEncodedProfilePhoto(imageData);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleProfilePhoto = (event) => {
    fileInputRef.current.click();
  };

  const handleFullName = (event) => {
    setFullName(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
    setEmailError('');
    setIsEmailError(false);
  };

  const handleUsername = (event) => {
    setUsername(event.target.value);
    setUsernameError('');
    setIsUsernameError(false);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
    setIsPasswordError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username.includes(' ')) {
      setUsernameError('Invalid Username');
      setIsUsernameError(true);
      return;
    }

    if (/[A-Z]/.test(username)) {
      setUsernameError('Username cannot contain capital letters');
      setIsUsernameError(true);
      return;
    }

    if (email.includes(' ') || !email.includes('@gmail.com')) {
      setEmailError('Invalid Email');
      setIsEmailError(true);
      return;
    }

    try {
      const response = await axios.post(Server.authURL+"/updateProfile", {
        full_name: fullName,
        email: email,
        username: username,
        password: password,
        profile_photo: encodedProfilePhoto,
        userId: myDetails._id
      }, {
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (response.status == 201) {
        setFullName('');
        setEmail('');
        setUsername('');
        setPassword('');
        setDisplayProfilePhoto('');
        setEncodedProfilePhoto('');

        setUsernameError('');
        setIsUsernameError(false);
        setEmailError('');
        setIsEmailError(false);

        setMessage(response.data.message);
        setShowUpdateProfile(false);
        await server.emit('getMyDetails', myDetails._id);
        return;
      }
    } catch (error) {
      if (error.response.data.error === 'username') {
        setUsernameError(error.response.data.message)
        setIsUsernameError(true);

        setEmailError('');
        setIsEmailError(false);

      } else if (error.response.data.error === 'email') {
        setEmailError(error.response.data.message)
        setIsEmailError(true);

        setUsernameError('');
        setIsUsernameError(false);
      }
    }

  };

  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  const handleUpdateClick = () => {
    setShowUpdateProfile(true);
  }

  const handleUpdateClose = () => {
    setShowUpdateProfile(false);
  }

  return (
    <Paper sx={{ height: '100%', minWidth: '22rem', width: '22rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', justifyContent: '', alignItems: 'center', backgroundColor: Window.secondary }} >
      <Stack sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h1' fontSize={'2rem'} fontWeight={'bold'}> Profile </Typography>
        <IconButton onClick={handleUpdateClick}><HiOutlinePencilSquare /></IconButton>
      </Stack>

      <Dialog open={showUpdateProfile} onClose={handleUpdateClose}>
        <DialogTitle> <Typography>Update Profile</Typography> </DialogTitle>
        <DialogContent>
          <form action="" onSubmit={handleSubmit}>
            <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center', alignItems: 'center' }} >
              <Box>
                <IconButton onClick={handleProfilePhoto}>
                  <Avatar alt="Profile Photo" src={displayProfilePhoto} sx={{ height: '5rem', width: '5rem' }} />
                  <Input inputRef={fileInputRef} type="file" inputProps={{ accept: '.jpg' }} style={{ display: 'none' }} onChange={handleFileInputChange} />
                </IconButton>
              </Box>
              <TextField sx={{ width: '100%' }} type='text' required value={fullName} placeholder='Full Name' onChange={handleFullName} />
              <TextField sx={{ width: '100%' }} type='text' required value={email} placeholder='Email' error={isEmailError} helperText={emailError} onChange={handleEmail} />
              <TextField sx={{ width: '100%' }} type='text' required value={username} placeholder='Username' error={isUsernameError} helperText={usernameError} onChange={handleUsername} />
              <TextField sx={{ width: '100%' }} type='text' required value={password} placeholder='Password' error={isPasswordError} helperText={passwordError} onChange={handlePassword} />
              <Button type='submit' variant='contained' sx={{ width: '100%' }} >Submit</Button>
            </Paper>
          </form>
        </DialogContent>
      </Dialog>

      <Stack sx={{ height: '100%', justifyContent: 'space-between' }} >
        <Stack spacing={3} sx={{ width: '100%', alignItems: 'start', justifyContent: 'space-between' }}>
          <Stack sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Avatar sx={{ height: '7rem', width: '7rem' }} src={myDetails.profile_photo} />
          </Stack>

          <Divider orientation='horizontal' sx={{ width: '100%' }} />
          <Stack spacing={3} direction={'row'} sx={{ width: '100%', alignItems: 'start' }}>
            <Typography fontWeight={'bold'}>Full Name :</Typography>
            <Typography fontWeight={'bold'}>{myDetails.full_name}</Typography>
          </Stack>
          <Divider orientation='horizontal' sx={{ width: '100%' }} />
          <Stack spacing={3} direction={'row'} sx={{ width: '100%', alignItems: 'start' }}>
            <Typography fontWeight={'bold'}>Username :</Typography>
            <Typography fontWeight={'bold'}>{myDetails.username}</Typography>
          </Stack>
          <Divider orientation='horizontal' sx={{ width: '100%' }} />
          <Stack spacing={3} direction={'row'} sx={{ width: '100%', alignItems: 'start' }}>
            <Typography fontWeight={'bold'}>Email :</Typography>
            <Typography fontWeight={'bold'}>{myDetails.email}</Typography>
          </Stack>
          <Divider orientation='horizontal' sx={{ width: '100%' }} />
          <Stack spacing={3} direction={'row'} sx={{ width: '100%', alignItems: 'start' }}>
            <Typography fontWeight={'bold'}>Password :</Typography>
            <Typography fontWeight={'bold'}>***************</Typography>
          </Stack>
          <Divider orientation='horizontal' sx={{ width: '100%' }} />

        </Stack>
        <Stack>
          <Button variant='contained' onClick={handleLogout}>Logout</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default MyProfile;
