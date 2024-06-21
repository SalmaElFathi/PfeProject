import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {

    const [selectedSection, setSelectedSection] = useState(1);
    const [selectedSectionWindow, setSelectedSectionWindow] = useState(null);
    const [selectedSubSectionWindow, setSubSelectedSectionWindow] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedGroupChat, setSelectedGroupChat] = useState(null);
    const [selectedUserProfile, setSelectedUserProfile] = useState(null);

    const [oneToOneChatList, setOneToOneChatList] = useState([]);
    const [oneToOneMessages, setOneToOneMessages] = useState([]);
    const [groupChatList, setGroupChatList] = useState([]);
    const [myDetails, setMyDetails] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [server, setServer] = useState();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('accessToken');
            const userId = localStorage.getItem('userId');
            const socket = io('http://localhost:8000', {
                extraHeaders: {
                    "token": token,
                    "userId": userId
                },
                withCredentials: true,
            });

            setServer(socket);

            socket.on('connect', () => {
                console.log('Client connected With Id : ' + socket.id);
            });
            socket.on('getNotifications', (notifications) => {
                setNotifications(notifications);
            });
            socket.on('myDetails', (user) => {
                setMyDetails(user);
            })
            socket.on('userDetails', (user) => {
                setUserDetails(user);
            })
            socket.on('friendList', (friendList) => {
                setFriendList(friendList);
            })
            socket.on('getSearchedUsers', (searchedUsers) => {
                setSearchList(searchedUsers);
            });
            socket.on('oneToOneChatList', (oneToOneChatList) => {
                setOneToOneChatList(oneToOneChatList);
            });
            socket.on('oneToOneMessages', (oneToOneMessages) => {
                setOneToOneMessages(oneToOneMessages);
            });

            socket.on('groupChatList', (groupChatList) => {
                setGroupChatList(groupChatList);
            });

            socket.on('onlineUser', (onlineUser) => {
                setOnlineUsers(prevOnlineUsers => {
                    if (prevOnlineUsers.length === 0) {
                        return [onlineUser];
                    } else {
                        if (!prevOnlineUsers.includes(onlineUser)) {
                            return [...prevOnlineUsers, onlineUser];
                        } else {
                            return prevOnlineUsers;
                        }
                    }
                });
            });

            socket.on('offlineUser', (offlineUser) => {
                setOnlineUsers(prevOnlineUsers => prevOnlineUsers.filter(user => user !== offlineUser));
            });

            window.addEventListener('beforeunload', () => {
                socket.disconnect();
            });
        };
        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ selectedSection, setSelectedSection, selectedSectionWindow, setSelectedSectionWindow, selectedSubSectionWindow, setSubSelectedSectionWindow, selectedUserProfile, setSelectedUserProfile, selectedChat, setSelectedChat, selectedGroupChat, setSelectedGroupChat, oneToOneChatList, oneToOneMessages, setOneToOneMessages, groupChatList, friendList, setFriendList, myDetails, setMyDetails, searchList, setSearchList, onlineUsers, userDetails, server, notifications }}>
            {children}
        </DataContext.Provider>
    );
};
