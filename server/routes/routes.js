const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("../middleware/user");
const isAuthentificated = require("../middleware/auth");
const jobController = require("../controllers/jobController");
const applicationController = require("../controllers/applicationController");

//user routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/forgot-password", userController.forgetPassword);
router.post("/reset-password/:id/:token", userController.resetPassword);
router.get("/profile/:_id",multer.single("profilePicture"),userController.getUser);
router.put( "/profile/:_id",multer.fields([{ name: "profilePicture" }, { name: "resume" }]),isAuthentificated,userController.updateUser);
router.get("/getindustry",isAuthentificated,userController.getUserIndustryAndSubIndustry);
router.delete("/delete-account/:_id", userController.deleteAccount);

//job routes
router.post("/job/post", isAuthentificated, jobController.postJob);
router.delete("/job/delete/:id", isAuthentificated, jobController.deleteJob);
router.put("/job/update/:id", isAuthentificated, jobController.updateJob);
router.get("/job/getall", jobController.getAllJobs);
router.get("/job/getmyjobs", isAuthentificated, jobController.getMyJobs);
router.get("/job/:id", jobController.getSingleJob);
router.get('/latest-jobs',jobController.getLastJobs);
router.get('/jobs/search',jobController.searchJob );

//application routes
router.post("/application/post", multer.single("resume"),isAuthentificated,applicationController.postApplication);
router.get( "/application/jobseeker/getall",isAuthentificated,applicationController.jobseekerGetAllApplications);
router.get("/application/employer/getall",isAuthentificated,applicationController.employerGetAllApplications);
router.delete("/application/delete/:id",isAuthentificated,applicationController.jobseekerDeleteApplication);
router.post('/application/accept/:id',isAuthentificated,applicationController.acceptApplication );
router.post('/application/reject/:id',isAuthentificated,applicationController.rejectApplication);

//push notification routes
router.get("/industryAndSubIndustry", isAuthentificated,userController.getUserIndustryAndSubIndustry);
router.post("/subscribe",isAuthentificated,userController.subscribeToNotifications);



  

module.exports = router;
