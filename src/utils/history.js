// ============================================================
// Build History
// ============================================================

export function buildHistory(games = {}) {
  const seasons = new Set();
  const regions = new Set();
  const events = new Set();

  const tree = {};

  Object.entries(games || {}).forEach(
    ([gamePath, count]) => {
      const parts = gamePath.split("/");

      if (parts.length < 4) {
        return;
      }

      const [
        season,
        region,
        event,
        gameId,
      ] = parts;

      seasons.add(season);
      regions.add(region);
      events.add(event);

      if (!tree[season]) {
        tree[season] = {};
      }

      if (!tree[season][region]) {
        tree[season][region] = {};
      }

      if (!tree[season][region][event]) {
        tree[season][region][event] = [];
      }

      tree[season][region][event].push({
        gameId,
        count: Number(count || 0),
        path: gamePath,
      });
    }
  );

  return {
    seasons: seasons.size,
    regions: regions.size,
    events: events.size,
    tree,
  };
}