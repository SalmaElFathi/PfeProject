import React from 'react';
import { Box, Typography, Paper, Stack, Avatar, IconButton, Divider, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Window, Selected, Font } from '../../../themes/index';
import { useDataContext } from '../../../contexts/index'

function OneToOneMessages({
    chatId,
    messageId,
    message,
    messageTime,
    messageType,
    sender,
    receiver,
}) {

    const { selectedChat } = useDataContext();

    return (
        <Box>
            {
                message == '' ?
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem 1rem', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' }}>
                        <Box>
                            <Typography variant='body2'>Chat Created At {messageTime}</Typography>
                        </Box>
                    </Box>
                    :
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem 1rem', justifyContent: sender ? 'end' : 'start', alignItems: sender ? 'end' : 'start', borderRadius: '15px' }}>
                        <Box sx={{ height: '100%', padding: '0rem 1rem', borderRadius: '4px', wordWrap: 'break-word' }} bgcolor={sender ? Selected.primary : 'white'} color={sender ? Selected.secondary : 'black'}>
                            <Typography>{message}</Typography>
                        </Box>
                        <Box>
                            <Typography variant='body2'>{messageTime}</Typography>
                        </Box>
                    </Box>
            }
        </Box>
    )
}

export default OneToOneMessages;
