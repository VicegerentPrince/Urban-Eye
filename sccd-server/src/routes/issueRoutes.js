const express = require('express');
const router = express.Router();
const { 
  createIssue, 
  getIssues, 
  getIssueById, 
  updateIssue, 
  deleteIssue, 
  addComment, 
  getIssuesByLocation, 
  getIssueStats 
} = require('../controllers/issueController');
const { protect, admin, official } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/map', getIssuesByLocation);

// Protected routes
router.route('/')
  .post(protect, upload.array('images', 5), createIssue)
  .get(protect, getIssues);

router.get('/stats', protect, admin, getIssueStats);

router.route('/:id')
  .get(protect, getIssueById)
  .put(protect, upload.array('images', 5), updateIssue)
  .delete(protect, deleteIssue);

router.post('/:id/comments', protect, addComment);

module.exports = router;