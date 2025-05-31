import { useState, useEffect } from 'react';

function MapView() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch data from your API
    // This is mock data
    const mockIssues = [
      { id: 1, title: 'Broken Street Light', location: 'Main St & 5th Ave', category: 'infrastructure', priority: 'medium', status: 'pending' },
      { id: 2, title: 'Water Leakage', location: 'Park Road, Near City Mall', category: 'water', priority: 'high', status: 'in-progress' },
      { id: 3, title: 'Garbage Collection', location: 'Residential Area B, Block 4', category: 'sanitation', priority: 'low', status: 'resolved' },
      { id: 4, title: 'Flood Warning', location: 'Riverside Community', category: 'disaster', priority: 'emergency', status: 'active' },
    ];
    
    setTimeout(() => {
      setIssues(mockIssues);
      setLoading(false);
    }, 1000);
  }, []);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'in-progress': return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">In Progress</span>;
      case 'resolved': return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Resolved</span>;
      case 'active': return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Active</span>;
      default: return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">Issue Map</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Map Placeholder - In a real app, you would integrate Google Maps or Leaflet */}
        <div className="flex-1 bg-gray-200 rounded-lg h-[500px] flex items-center justify-center">
          {loading ? (
            <p className="text-gray-600">Loading map data...</p>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Map View Placeholder</p>
              <p className="text-sm text-gray-500">(In a real implementation, integrate with Google Maps or Leaflet)</p>
              
              {/* Map markers representation */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {issues.map(issue => (
                  <button 
                    key={issue.id}
                    onClick={() => handleIssueClick(issue)}
                    className={`w-4 h-4 rounded-full ${getPriorityColor(issue.priority)} hover:ring-2 hover:ring-offset-2 hover:ring-blue-500`}
                    title={issue.title}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Issue List */}
        <div className="md:w-96 bg-white rounded-lg shadow-md p-4 h-[500px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Reported Issues</h2>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-600">Loading issues...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map(issue => (
                <div 
                  key={issue.id} 
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedIssue?.id === issue.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleIssueClick(issue)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{issue.title}</h3>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(issue.priority)}`} title={`Priority: ${issue.priority}`} />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{issue.location}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{issue.category}</span>
                    {getStatusBadge(issue.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Selected Issue Details */}
      {selectedIssue && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{selectedIssue.title}</h2>
            <div className="flex items-center">
              <span className="mr-2">Priority:</span>
              <div className={`w-4 h-4 rounded-full ${getPriorityColor(selectedIssue.priority)}`} />
            </div>
          </div>
          <p className="text-gray-600 mt-2"><strong>Location:</strong> {selectedIssue.location}</p>
          <div className="flex gap-4 mt-4">
            <div>
              <span className="text-gray-600">Category:</span>
              <span className="ml-2 px-3 py-1 bg-gray-100 rounded-full">{selectedIssue.category}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2">{getStatusBadge(selectedIssue.status)}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Update Status</button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">View Details</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;