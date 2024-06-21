const socketio = require('socket.io');
const mongoose = require('./database/bdd');
const Job = require('./models/job');
const Notifications = require('./models/notifications');
const JobSeeker = require('./models/jobseeker');
const Employer = require('./models/employer');
const { OneToOneChats, OneToOneMessages } = require('./models/index');
const { GetOneToOneChatListWithDetailsFromUserId, GetUserIdFromSocket, GetUserDetailsFromUserId } = require('./services/index');

const { app } = require('./app');

const PORT_NUMBER = 8000;

const server = app.listen(PORT_NUMBER, () => {
    console.log("Server Is Started At Port Number : " + PORT_NUMBER);
});

const io = socketio(server, {
    cors: {
        origin: true,
        allowedHeaders: ['token', 'userId', 'authorization', 'content-type'],
        credentials: true
    }
});

io.on('connect', async (socket) => {

    const userId = socket.handshake.headers.userid;

    if (userId) {

        const user = await GetUserDetailsFromUserId(userId);
        await socket.emit('myDetails', user);

        const oneToOneChatListWithDetails = await GetOneToOneChatListWithDetailsFromUserId(userId);
        await socket.emit('oneToOneChatList', oneToOneChatListWithDetails);

  /*      oneToOneChatListWithDetails.map(async (data, index) => {
            const sockets = await io.fetchSockets();
            sockets.map(async (s, index) => {
                const socket_id = await GetUserIdFromSocket(s);
                if (socket_id == data.user._id) {
                    await s.emit('onlineUser', userId);
                    await socket.emit('onlineUser', data.user._id);
                }
            });
        });*/


        try {
            const jobSeeker = await JobSeeker.findById({ _id: userId });
            if (jobSeeker) {
                const notifications = await Notifications.find({});
                const jobPreferenceNotifications = await Promise.all(notifications.map(async (data) => {
                    const job = await Job.findById({ _id: data.job_id });
                    if (job.industry === jobSeeker.industry && job.subIndustry === jobSeeker.subIndustry) {
                        return job;
                    }
                    return null;
                }));
                const filteredJobPreferenceNotifications = jobPreferenceNotifications.filter(job => job !== null);
                socket.emit('getNotifications', filteredJobPreferenceNotifications);
            }
        } catch (error) {

        }
    }

    socket.on('createOneToOneChat', async (data) => {

        const oneToOneChat_1 = new OneToOneChats({ user_id_1: data.user_id_1, user_id_2: data.user_id_2, createdBy: data.user_id_1, lastMessage: '' });
        await oneToOneChat_1.save();

        const user_1 = new OneToOneMessages({ message: '', messageType: '', messageTime: data.date, chatId: oneToOneChat_1._id, sender: data.user_id_1, receiver: data.user_id_2 });
        await user_1.save();

        const oneToOneChat = await OneToOneChats.findById(oneToOneChat_1._id);
        oneToOneChat.messageCount = 0;
        oneToOneChat.lastMessage = oneToOneChat_1._id.toString();
        await oneToOneChat.save();

        const oneToOneChatListWithDetails = await GetOneToOneChatListWithDetailsFromUserId(userId);
        await socket.emit('oneToOneChatList', oneToOneChatListWithDetails);

        // console.log(oneToOneChatListWithDetails)

        const existingChat = await OneToOneChats.findOne({ user_id_1: data.user_id_2, user_id_2: data.user_id_1, createdBy: data.user_id_2 });

        if (!existingChat) {
            const oneToOneChat_2 = new OneToOneChats({ user_id_1: data.user_id_2, user_id_2: data.user_id_1, createdBy: data.user_id_2, lastMessage: '' });
            await oneToOneChat_2.save();

            const user_2 = new OneToOneMessages({ message: '', messageType: '', messageTime: data.date, chatId: oneToOneChat_2._id, sender: data.user_id_1, receiver: data.user_id_2 });
            await user_2.save();

            const oneToOneChat = await OneToOneChats.findById(oneToOneChat_2._id);
            oneToOneChat.messageCount = 0;
            oneToOneChat.lastMessage = user_2._id.toString();
            await oneToOneChat.save();

            const sockets = await io.fetchSockets();
            sockets.map(async (s, index) => {
                const socket_id = await GetUserIdFromSocket(s);
                if (socket_id == data.user_id_2) {
                    const socket_id = await GetUserIdFromSocket(s);
                    const socket_id_oneToOneChatListWithDetails = await GetOneToOneChatListWithDetailsFromUserId(socket_id);
                    await s.emit('oneToOneChatList', socket_id_oneToOneChatListWithDetails);
                }
            });
            return;
        }

        const user_2 = new OneToOneMessages({ message: '', messageType: '', messageTime: data.date, chatId: existingChat._id, sender: data.user_id_1, receiver: data.user_id_2 });
        await user_2.save();

        const oneToOneChat_2 = await OneToOneChats.findById(existingChat._id);
        oneToOneChat_2.messageCount = ++oneToOneChat_2.messageCount;
        oneToOneChat_2.lastMessage = user_2._id.toString();
        await oneToOneChat_2.save();
        const sockets = await io.fetchSockets();
        sockets.map(async (s, index) => {
            const socket_id = await GetUserIdFromSocket(s);
            if (socket_id == data.user_id_2) {
                const socket_id = await GetUserIdFromSocket(s);
                const socket_id_oneToOneChatListWithDetails = await GetOneToOneChatListWithDetailsFromUserId(socket_id);
                await s.emit('oneToOneChatList', socket_id_oneToOneChatListWithDetails);
            }
        });
    })

    socket.on('sendMessage', async (data) => {

        const user_1 = new OneToOneMessages({ message: data.message, messageType: data.messageType, messageTime: data.messageTime, chatId: data.chatId, sender: data.user_id_1, receiver: data.user_id_2 });
        await user_1.save();

        const oneToOneChat_1 = await OneToOneChats.findById(data.chatId);
        oneToOneChat_1.messageCount = 0;
        oneToOneChat_1.lastMessage = user_1._id.toString();
        await oneToOneChat_1.save();

        const oneToOneChatListWithDetails = await GetOneToOneChatListWithDetailsFromUserId(data.user_id_1);
        await socket.emit('oneToOneChatList', oneToOneChatListWithDetails);

        const existingChat = await OneToOneChats.findOne({ user_id_1: data.user_id_2, user_id_2: data.user_id_1, createdBy: data.user_id_2 });

        if (!existingChat) {
            const oneToOneChat_2 = new OneToOneChats({ user_id_1: data.user_id_2, user_id_2: data.user_id_1, createdBy: data.user_id_2, lastMessage: '' });
            await oneToOneChat_2.save();

            const user_2 = new OneToOneMessages({ message: data.message, messageType: data.messageType, messageTime: data.messageTime, chatId: oneToOneChat_2._id, sender: data.user_id_1, receiver: data.user_id_2 });
            await user_2.save();

            const oneToOneChat = await OneToOneChats.findById(oneToOneChat_2._id);
            oneToOneChat.messageCount = 1;
            oneToOneChat.lastMessage = user_2._id.toString();
            await oneToOneChat.save();
            const sockets = await io.fetchSockets();
            sockets.map(async (s, index) => {
                const socket_id = await GetUserIdFromSocket(s);
                if (socket_id == data.user_id_2) {
                    const socket_id = await GetUserIdFromSocket(s);
                    const socket_id_oneToOneChatListWithDetails = await GetOneToOneChatListWithDetailsFromUserId(socket_id);
                    await s.emit('oneToOneChatList', socket_id_oneToOneChatListWithDetails);
                }
            });
            return;
        }

        const user_2 = new OneToOneMessages({ message: data.message, messageType: data.messageType, messageTime: data.messageTime, chatId: existingChat._id, sender: data.user_id_1, receiver: data.user_id_2 });
        await user_2.save();
        const oneToOneChat_2 = await OneToOneChats.findById(existingChat._id);
        oneToOneChat_2.messageCount = ++oneToOneChat_2.messageCount;
        oneToOneChat_2.lastMessage = user_2._id.toString();
        await oneToOneChat_2.save();
        const sockets = await io.fetchSockets();
        sockets.map(async (s, index) => {
            const socket_id = await GetUserIdFromSocket(s);
            if (socket_id == data.user_id_2) {
                const socket_id = await GetUserIdFromSocket(s);
                const socket_id_oneToOneChatListWithDetails = await GetOneToOneChatListWithDetailsFromUserId(socket_id);
                await s.emit('oneToOneChatList', socket_id_oneToOneChatListWithDetails);
            }
        });
    })

    socket.on('deleteOneToOneChat', async (data) => {
        await OneToOneChats.findByIdAndDelete(data);
        await OneToOneMessages.deleteMany({ chatId: data });
        const oneToOneChatListWithDetails = await GetOneToOneChatListWithDetailsFromUserId(userId);
        await socket.emit('oneToOneChatList', oneToOneChatListWithDetails);
    })

    socket.on('setMessgeCountZero', async (chatId) => {
        const oneToOneChat_1 = await OneToOneChats.findById(chatId);
        oneToOneChat_1.messageCount = 0;
        await oneToOneChat_1.save();

        const oneToOneChatListWithDetails = await GetOneToOneChatListWithDetailsFromUserId(userId);
        await socket.emit('oneToOneChatList', oneToOneChatListWithDetails);
    })

    socket.on('jobPost', async (data) => {
        const job = await Job.create({
            title: data.title,
            description: data.description,
            industry: data.industry,
            subIndustry: data.subIndustry,
            location: data.location,
            fixedSalary: data.fixedSalary,
            salaryFrom: data.salaryFrom,
            salaryTo: data.salaryTo,
            jobPostedOn: data.jobPostedOn,
            postedBy: new mongoose.Types.ObjectId(data.postedBy)
        });
        const notifications = await Notifications.create({
            job_id: job._id
        });

        const sockets = await io.fetchSockets();
        sockets.map(async (s, index) => {
            const id = s.handshake.headers.userid;
            if (id) {
                const jobSeeker = await JobSeeker.findById({ _id: id });
                if (jobSeeker) {
                    const notifications = await Notifications.find({});
                    const jobPreferenceNotifications = await Promise.all(notifications.map(async (data) => {
                        const job = await Job.findById({ _id: data.job_id });
                        if (job.industry === jobSeeker.industry && job.subIndustry === jobSeeker.subIndustry) {
                            return job;
                        }
                        return null;
                    }));
                    const filteredJobPreferenceNotifications = jobPreferenceNotifications.filter(job => job !== null);
                    s.emit('getNotifications', filteredJobPreferenceNotifications);
                }
            }
        });

    });

    socket.on('jobUpdate', async (data) => {

        const job = await Job.findByIdAndUpdate(data._id, data, { new: true });

        const sockets = await io.fetchSockets();
        sockets.map(async (s, index) => {
            const id = s.handshake.headers.userid;
            if (id) {
                const jobSeeker = await JobSeeker.findById({ _id: id });
                if (jobSeeker) {
                    const notifications = await Notifications.find({});
                    const jobPreferenceNotifications = await Promise.all(notifications.map(async (data) => {
                        const job = await Job.findById({ _id: data.job_id });
                        if (job.industry === jobSeeker.industry && job.subIndustry === jobSeeker.subIndustry) {
                            return job;
                        }
                        return null;
                    }));
                    const filteredJobPreferenceNotifications = jobPreferenceNotifications.filter(job => job !== null);
                    s.emit('getNotifications', filteredJobPreferenceNotifications);
                }
            }
        });
    });
    socket.on('jobDelete', async (data) => {

        const job = await Job.findByIdAndDelete(data);
        const notifications = await Notifications.findOneAndDelete({
            job_id: job._id
        });

        const sockets = await io.fetchSockets();
        sockets.map(async (s, index) => {
            const id = s.handshake.headers.userid;
            if (id) {
                const jobSeeker = await JobSeeker.findById({ _id: id });
                if (jobSeeker) {
                    const notifications = await Notifications.find({});
                    const jobPreferenceNotifications = await Promise.all(notifications.map(async (data) => {
                        const job = await Job.findById({ _id: data.job_id });
                        if (job.industry === jobSeeker.industry && job.subIndustry === jobSeeker.subIndustry) {
                            return job;
                        }
                        return null;
                    }));
                    const filteredJobPreferenceNotifications = jobPreferenceNotifications.filter(job => job !== null);
                    s.emit('getNotifications', filteredJobPreferenceNotifications);
                }
            }
        });
    });
});
