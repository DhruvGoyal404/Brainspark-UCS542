const mongoose = require('mongoose');

// Target collection for the $merge aggregation stage — stores point-in-time leaderboard snapshots.
// Each document represents one user's standing at the time of the last snapshot run.
// The _id is the user's ObjectId so $merge can upsert (merge when matched, insert when new).
const leaderboardSnapshotSchema = new mongoose.Schema({
    _id:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username:    String,
    totalXP:     Number,
    rank:        Number,
    level:       Number,
    snapshotDate:{ type: Date, default: Date.now }
}, { _id: false });

leaderboardSnapshotSchema.index({ snapshotDate: -1 });
leaderboardSnapshotSchema.index({ totalXP: -1 });

module.exports = mongoose.model('LeaderboardSnapshot', leaderboardSnapshotSchema);
