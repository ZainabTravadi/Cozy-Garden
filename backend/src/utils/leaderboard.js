export function toLeaderboardEntry(user, rank, currentUserId) {
  return {
    username: user.username,
    level: user.level,
    experiencePoints: user.experiencePoints,
    rank,
    currentUser: user._id.equals(currentUserId),
  };
}
