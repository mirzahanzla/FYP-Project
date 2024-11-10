import Report from '../models/Reports.js';

export const getReport = async (req, res) => {
  const { userName } = req.params;
  console.log("username in backend: ", userName);

  // Trim any leading/trailing spaces from the userName
  const trimmedUserName = userName.trim();

  try {
    // Find the report by either Name or fullName with a case-insensitive search
    const report = await Report.findOne({
      $or: [
        { Name: { $regex: new RegExp('^' + trimmedUserName + '$', 'i') } },
        { fullName: { $regex: new RegExp('^' + trimmedUserName + '$', 'i') } }
      ]
    });

    console.log("Report: ", report);
    
    // If no report is found, send a 404 response
    if (!report) {
      return res.status(404).json({ message: 'Report not found for this user' });
    }

    // Return the report
    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Server error while fetching report' });
  }
};
