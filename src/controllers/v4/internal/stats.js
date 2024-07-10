import createError from 'http-errors';
import Stats from '../../../models/schemas/Stat.js';

// Get Internal Status or statistics
const getStats = async (req, res, next) => {
  const key = req.headers.key;
  // Check for valid access key in headers
  if (!key || key !== process.env.ACCESS_KEY) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
  try {
    const [result] = await Stats.aggregate([
      // Select a random document from the results
      { $sample: { size: 1 } },
      { $project: { __v: 0, _id: 0 } },
    ]);

    if (!result) {
      return next(createError(404, 'Could not find any Stats'));
    }

    res.status(200).json(result);

    await Stats.findOneAndUpdate({ _id: 'systemstats' }, { $inc: { stats: 1 } });
  } catch (error) {
    await Stats.findOneAndUpdate({ _id: 'systemstats' }, { $inc: { failed_requests: 1 } });
    return next(error);
  }
};

export { getStats };
