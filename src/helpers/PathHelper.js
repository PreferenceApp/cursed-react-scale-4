/**
 * Generates historical breadcrumbs and discovers next available subfolders dynamically
 * for clean URL pathways (e.g., /players/season-1 instead of /players/all/season-1).
 * 
 * @param {string} currentScope - The current subscope path (e.g., "/", "/season-1")
 * @param {object} games - The raw games object from context where keys are database paths
 * @param {string} baseRoute - The current active feature page (e.g., "players", "leaderboard")
 * @returns {object} { breadcrumbs: Array, nextPotentialFolders: Array }
 */
export const getNavigationMeta = (currentScope = "/", games = {}, baseRoute = "leaderboard") => {
  // Normalize and remove "all" if it accidentally sneaks in
  const cleanScope = currentScope.replace(/^\/all/, "").split("/").filter(Boolean).join("/");
  const segments = cleanScope ? cleanScope.split("/") : [];
  
  const cleanBase = `/${baseRoute.replace(/^\//, "").replace(/\/$/, "")}`;

  // --- 1. Build Historical Breadcrumbs (Clean URLs) ---
  let accumulatedPath = "";
  const breadcrumbs = segments.map((segment) => {
    accumulatedPath += `/${segment}`;
    
    const friendlyName = segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      name: friendlyName,
      url: `${cleanBase}${accumulatedPath}`, // No "/all" inserted
    };
  });

  // --- 2. Scan and Find Next Potential Folders ---
  const depth = segments.length;
  const nextSubfolders = new Set();

  Object.keys(games || {}).forEach((rawPath) => {
    const gameSegments = rawPath.split("/").filter(Boolean);

    // Root scope lookup
    if (depth === 0) {
      if (gameSegments.length > 0) {
        nextSubfolders.add(gameSegments[0]);
      }
    } 
    // Nested scope lookup
    else {
      const matchesCurrentScope = segments.every(
        (seg, idx) => gameSegments[idx] === seg
      );

      if (matchesCurrentScope && gameSegments.length > depth) {
        nextSubfolders.add(gameSegments[depth]);
      }
    }
  });

  return {
    breadcrumbs,
    nextPotentialFolders: Array.from(nextSubfolders),
  };
};
