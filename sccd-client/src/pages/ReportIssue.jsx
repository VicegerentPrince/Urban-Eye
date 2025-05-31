import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ReportIssue() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'infrastructure',
    priority: 'medium',
    images: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, you would upload the form data to your API
    console.log('Submitting issue:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        navigate('/citizen');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center my-6 text-blue-600">Report an Issue</h1>
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
          <p>Your issue has been reported successfully!</p>
          <p className="text-sm">Redirecting to dashboard...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Issue Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief title of the issue"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="infrastructure">Infrastructure</option>
              <option value="sanitation">Sanitation</option>
              <option value="water">Water Supply</option>
              <option value="electricity">Electricity</option>
              <option value="public_safety">Public Safety</option>
              <option value="disaster">Disaster</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-gray-700 font-medium mb-2">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Address or location description"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description of the issue"
              required
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="images" className="block text-gray-700 font-medium mb-2">Upload Images (Optional)</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
              multiple
            />
            <p className="text-sm text-gray-500 mt-1">You can upload multiple images to help describe the issue</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate('/citizen')}
              className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ReportIssue;