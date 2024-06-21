import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Box } from '@mui/material';
import { useDataContext } from '../contexts/index';
import { WelcomeWindow, OneToOneChatList, OneToOneChatWindow, MyProfile, UserProfile } from './index';
// import { IsValidToken } from '../utils/index';
import axios from 'axios';

function Chat() {

    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             if (document.cookie.includes('token')) {
    //                 const isValidTokenResult = await IsValidToken();
    //                 if (!isValidTokenResult) {
    //                     navigate('/signin');
    //                 }
    //             } else {
    //                 navigate('/signin');
    //             }
    //         } catch (error) {
    //             navigate('/signin');
    //         }
    //     };
    //     fetchData();
    // }, []);

    const { selectedSection } = useDataContext();

    const renderSection = () => {
        switch (selectedSection) {
            case 0:
                return <WelcomeWindow />;
            case 1:
                return <OneToOneChatList />;
            case 5:
                return <MyProfile />;
            default:
                return null;
        }
    };

    const { selectedSectionWindow, selectedSubSectionWindow } = useDataContext();

    const renderSectionWindow = () => {
        switch (selectedSectionWindow) {
            case 0:
                return null;
            case 1:
                return <OneToOneChatWindow />;
            default:
                return null;
        }
    };

    const renderSubSectionWindow = () => {
        switch (selectedSubSectionWindow) {
            case 1:
                return <UserProfile />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'row', gap: '0.1rem', justifyContent: 'start', alignItems: 'center' }}>
            {renderSection()}
            {renderSectionWindow()}
            {renderSubSectionWindow()}
        </Box >
    );
}

export default Chat;