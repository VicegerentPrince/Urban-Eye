const Issue = require('../models/Issue');
const User = require('../models/User');

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Private
const createIssue = async (req, res) => {
  try {
    const { title, description, location, category, priority, coordinates } = req.body;

    // Handle file uploads
    const images = [];
    if (req.files) {
      req.files.forEach(file => {
        images.push(`/uploads/${file.filename}`);
      });
    }

    const issue = await Issue.create({
      title,
      description,
      location,
      coordinates,
      category,
      priority,
      reporter: req.user._id,
      images
    });

    res.status(201).json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private
const getIssues = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    const filter = {};

    // Apply filters if provided
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    // If user is a citizen, only show their issues
    if (req.user.userType === 'citizen') {
      filter.reporter = req.user._id;
    }

    const issues = await Issue.find(filter)
      .populate('reporter', 'name email')
      .populate('assignee', 'name email department')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get issue by ID
// @route   GET /api/issues/:id
// @access  Private
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reporter', 'name email')
      .populate('assignee', 'name email department');

    if (issue) {
      // Check if user is authorized to view this issue
      if (req.user.userType === 'citizen' && issue.reporter._id.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to view this issue' });
      }

      res.json(issue);
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update issue
// @route   PUT /api/issues/:id
// @access  Private
const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check if user is authorized to update this issue
    if (req.user.userType === 'citizen' && issue.reporter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this issue' });
    }

    // Update fields
    const { title, description, location, category, priority, status, assignee, coordinates } = req.body;

    if (title) issue.title = title;
    if (description) issue.description = description;
    if (location) issue.location = location;
    if (category) issue.category = category;
    if (priority) issue.priority = priority;
    if (coordinates) issue.coordinates = coordinates;

    // Only officials and admins can update status and assignee
    if (req.user.userType !== 'citizen') {
      if (status) issue.status = status;
      if (assignee) issue.assignee = assignee;
    }

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      issue.images = [...issue.images, ...newImages];
    }

    const updatedIssue = await issue.save();

    res.json(updatedIssue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private/Admin
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Only admin or the reporter can delete an issue
    if (req.user.userType !== 'admin' && issue.reporter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this issue' });
    }

    await issue.deleteOne();
    res.json({ message: 'Issue removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add comment to issue
// @route   POST /api/issues/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const comment = {
      text,
      user: req.user._id
    };

    issue.comments.push(comment);
    await issue.save();

    const updatedIssue = await Issue.findById(req.params.id)
      .populate('comments.user', 'name userType');

    res.status(201).json(updatedIssue.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get issues by location (for map)
// @route   GET /api/issues/map
// @access  Private
const getIssuesByLocation = async (req, res) => {
  try {
    const { lat, lng, radius = 10000 } = req.query; // radius in meters, default 10km

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const issues = await Issue.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    }).select('title location coordinates category priority status');

    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get issue statistics
// @route   GET /api/issues/stats
// @access  Private/Admin
const getIssueStats = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const pendingIssues = await Issue.countDocuments({ status: 'pending' });
    const inProgressIssues = await Issue.countDocuments({ status: 'in-progress' });
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    const activeIssues = await Issue.countDocuments({ status: 'active' });

    const categoryStats = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const priorityStats = await Issue.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      total: totalIssues,
      byStatus: {
        pending: pendingIssues,
        inProgress: inProgressIssues,
        resolved: resolvedIssues,
        active: activeIssues
      },
      byCategory: categoryStats,
      byPriority: priorityStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  addComment,
  getIssuesByLocation,
  getIssueStats
};