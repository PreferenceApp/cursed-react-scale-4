// ============================================================
// Scoring Constants
// ============================================================

export const PLACEMENT_POINTS = {
  1: 15,
  2: 10,
  3: 8,
  4: 6,
  5: 3,
  6: 2,
  7: 1,
  8: 0,
};

export const DAMAGE_PER_POINT = 2000;

// ============================================================
// Basic Helpers
// ============================================================

export function sumValues(object = {}) {
  return Object.values(object).reduce(
    (total, value) => {
      return total + Number(value || 0);
    },
    0
  );
}

// ============================================================
// Names
// ============================================================

export function getPlayerNames(
  totals = {},
  playerId
) {
  return (
    totals?.names?.players?.[
      String(playerId)
    ] || {}
  );
}

export function getTeamNames(
  totals = {},
  teamId
) {
  return (
    totals?.names?.teams?.[
      String(teamId)
    ] || {}
  );
}

export function getPrimaryName(
  names = {}
) {
  const entries =
    Object.entries(names);

  if (!entries.length) {
    return "";
  }

  return entries.reduce(
    (best, current) => {
      return current[1] > best[1]
        ? current
        : best;
    }
  )[0];
}

// ============================================================
// Games
// ============================================================

// Sum of game values.
//
// For:
// - games.all
// - games.players
// - games.playerCharacters
//
// the values are always 1.
//
// For games.characters, values represent
// the number of players using that character
// in each game, so sumValues() returns
// character appearances rather than unique games.

export function getGameCount(
  games = {}
) {
  return sumValues(games);
}

// Number of unique game paths.

export function getUniqueGameCount(
  games = {}
) {
  return Object.keys(
    games || {}
  ).length;
}

// ------------------------------------------------------------
// Player Games
// ------------------------------------------------------------

export function getPlayerGames(
  totals = {},
  playerId
) {
  return (
    totals?.games?.players?.[
      String(playerId)
    ] || {}
  );
}

export function getPlayerGameCount(
  totals = {},
  playerId
) {
  return getUniqueGameCount(
    getPlayerGames(
      totals,
      playerId
    )
  );
}

// ------------------------------------------------------------
// Character Games
// ------------------------------------------------------------

export function getCharacterGames(
  totals = {},
  characterId
) {
  return (
    totals?.games?.characters?.[
      String(characterId)
    ] || {}
  );
}

export function getCharacterGameCount(
  totals = {},
  characterId
) {
  return getUniqueGameCount(
    getCharacterGames(
      totals,
      characterId
    )
  );
}

export function getCharacterAppearanceCount(
  totals = {},
  characterId
) {
  return getGameCount(
    getCharacterGames(
      totals,
      characterId
    )
  );
}

// ------------------------------------------------------------
// Player Character Games
// ------------------------------------------------------------

export function getPlayerCharacterGames(
  totals = {},
  playerId,
  characterId
) {
  return (
    totals
      ?.games
      ?.playerCharacters
      ?.[String(playerId)]
      ?.[String(characterId)]
    || {}
  );
}

export function getPlayerCharacterGameCount(
  totals = {},
  playerId,
  characterId
) {
  return getUniqueGameCount(
    getPlayerCharacterGames(
      totals,
      playerId,
      characterId
    )
  );
}

// ============================================================
// Placement
// ============================================================

// Generic placement breakdown helpers

export function getPlacementCount(
  placementBreakdown = {},
  placement
) {
  return Number(
    placementBreakdown?.[
      String(placement)
    ] || 0
  );
}

export function getWins(
  placementBreakdown = {}
) {
  return getPlacementCount(
    placementBreakdown,
    1
  );
}

export function getTop3(
  placementBreakdown = {}
) {
  return (
    getPlacementCount(
      placementBreakdown,
      1
    ) +
    getPlacementCount(
      placementBreakdown,
      2
    ) +
    getPlacementCount(
      placementBreakdown,
      3
    )
  );
}

export function getTop5(
  placementBreakdown = {}
) {
  return (
    getPlacementCount(
      placementBreakdown,
      1
    ) +
    getPlacementCount(
      placementBreakdown,
      2
    ) +
    getPlacementCount(
      placementBreakdown,
      3
    ) +
    getPlacementCount(
      placementBreakdown,
      4
    ) +
    getPlacementCount(
      placementBreakdown,
      5
    )
  );
}

// ============================================================
// Player Placement
// ============================================================

export function getPlayerPlacementBreakdown(
  totals = {},
  playerId
) {
  return (
    totals
      ?.placement
      ?.players
      ?.[String(playerId)]
    || {}
  );
}

export function getPlayerPlacementCount(
  totals = {},
  playerId,
  placement
) {
  return getPlacementCount(
    getPlayerPlacementBreakdown(
      totals,
      playerId
    ),
    placement
  );
}

export function getPlayerWins(
  totals = {},
  playerId
) {
  return getWins(
    getPlayerPlacementBreakdown(
      totals,
      playerId
    )
  );
}

export function getPlayerTop3(
  totals = {},
  playerId
) {
  return getTop3(
    getPlayerPlacementBreakdown(
      totals,
      playerId
    )
  );
}

export function getPlayerTop5(
  totals = {},
  playerId
) {
  return getTop5(
    getPlayerPlacementBreakdown(
      totals,
      playerId
    )
  );
}

// ============================================================
// Character Placement
// ============================================================

export function getCharacterPlacementBreakdown(
  totals = {},
  characterId
) {
  return (
    totals
      ?.placement
      ?.characters
      ?.[String(characterId)]
    || {}
  );
}

export function getCharacterPlacementCount(
  totals = {},
  characterId,
  placement
) {
  return getPlacementCount(
    getCharacterPlacementBreakdown(
      totals,
      characterId
    ),
    placement
  );
}

export function getCharacterWins(
  totals = {},
  characterId
) {
  return getWins(
    getCharacterPlacementBreakdown(
      totals,
      characterId
    )
  );
}

export function getCharacterTop3(
  totals = {},
  characterId
) {
  return getTop3(
    getCharacterPlacementBreakdown(
      totals,
      characterId
    )
  );
}

export function getCharacterTop5(
  totals = {},
  characterId
) {
  return getTop5(
    getCharacterPlacementBreakdown(
      totals,
      characterId
    )
  );
}

// ============================================================
// Player Character Placement
// ============================================================

export function getPlayerCharacterPlacementBreakdown(
  totals = {},
  playerId,
  characterId
) {
  return (
    totals
      ?.placement
      ?.playerCharacters
      ?.[String(playerId)]
      ?.[String(characterId)]
    || {}
  );
}

export function getPlayerCharacterPlacementCount(
  totals = {},
  playerId,
  characterId,
  placement
) {
  return getPlacementCount(
    getPlayerCharacterPlacementBreakdown(
      totals,
      playerId,
      characterId
    ),
    placement
  );
}

export function getPlayerCharacterWins(
  totals = {},
  playerId,
  characterId
) {
  return getWins(
    getPlayerCharacterPlacementBreakdown(
      totals,
      playerId,
      characterId
    )
  );
}

export function getPlayerCharacterTop3(
  totals = {},
  playerId,
  characterId
) {
  return getTop3(
    getPlayerCharacterPlacementBreakdown(
      totals,
      playerId,
      characterId
    )
  );
}

export function getPlayerCharacterTop5(
  totals = {},
  playerId,
  characterId
) {
  return getTop5(
    getPlayerCharacterPlacementBreakdown(
      totals,
      playerId,
      characterId
    )
  );
}

// ============================================================
// Average Placement
// ============================================================

export function getAveragePlacement(
  placementBreakdown = {}
) {
  let totalPlacement = 0;
  let totalPlacements = 0;

  Object.entries(
    placementBreakdown
  ).forEach(
    ([placement, count]) => {
      const p = Number(placement);
      const c = Number(count || 0);

      totalPlacement += p * c;
      totalPlacements += c;
    }
  );

  if (!totalPlacements) {
    return 0;
  }

  return (
    totalPlacement /
    totalPlacements
  );
}

export function getPlayerAveragePlacement(
  totals = {},
  playerId
) {
  return getAveragePlacement(
    getPlayerPlacementBreakdown(
      totals,
      playerId
    )
  );
}

export function getCharacterAveragePlacement(
  totals = {},
  characterId
) {
  return getAveragePlacement(
    getCharacterPlacementBreakdown(
      totals,
      characterId
    )
  );
}

export function getPlayerCharacterAveragePlacement(
  totals = {},
  playerId,
  characterId
) {
  return getAveragePlacement(
    getPlayerCharacterPlacementBreakdown(
      totals,
      playerId,
      characterId
    )
  );
}

// ============================================================
// Placement Points
// ============================================================

export function getPlacementPoints(
  placementBreakdown = {}
) {
  return Object.entries(
    placementBreakdown
  ).reduce(
    (total, [placement, count]) => {
      const points =
        PLACEMENT_POINTS[
          Number(placement)
        ] || 0;

      return (
        total +
        points *
          Number(count || 0)
      );
    },
    0
  );
}

export function getPlayerPlacementPoints(
  totals = {},
  playerId
) {
  return getPlacementPoints(
    getPlayerPlacementBreakdown(
      totals,
      playerId
    )
  );
}

export function getCharacterPlacementPoints(
  totals = {},
  characterId
) {
  return getPlacementPoints(
    getCharacterPlacementBreakdown(
      totals,
      characterId
    )
  );
}

export function getPlayerCharacterPlacementPoints(
  totals = {},
  playerId,
  characterId
) {
  return getPlacementPoints(
    getPlayerCharacterPlacementBreakdown(
      totals,
      playerId,
      characterId
    )
  );
}

// ============================================================
// Knockouts
// ============================================================

// ------------------------------------------------------------
// Player Knockouts
// ------------------------------------------------------------

export function getPlayerKnockouts(
  totals = {},
  playerId
) {
  return Number(
    totals
      ?.knockouts
      ?.players
      ?.[String(playerId)]
    || 0
  );
}

// ------------------------------------------------------------
// Character Knockouts
// ------------------------------------------------------------

export function getCharacterKnockouts(
  totals = {},
  characterId
) {
  return Number(
    totals
      ?.knockouts
      ?.characters
      ?.[String(characterId)]
    || 0
  );
}

// ------------------------------------------------------------
// Player Character Knockouts
// ------------------------------------------------------------

export function getPlayerCharacterKnockouts(
  totals = {},
  playerId,
  characterId
) {
  return Number(
    totals
      ?.knockouts
      ?.playerCharacters
      ?.[String(playerId)]
      ?.[String(characterId)]
    || 0
  );
}

// ------------------------------------------------------------
// Knockout Points
// ------------------------------------------------------------

export function getKnockoutPoints(
  knockouts = 0
) {
  return Number(
    knockouts || 0
  );
}

export function getPlayerKnockoutPoints(
  totals = {},
  playerId
) {
  return getKnockoutPoints(
    getPlayerKnockouts(
      totals,
      playerId
    )
  );
}

export function getCharacterKnockoutPoints(
  totals = {},
  characterId
) {
  return getKnockoutPoints(
    getCharacterKnockouts(
      totals,
      characterId
    )
  );
}

export function getPlayerCharacterKnockoutPoints(
  totals = {},
  playerId,
  characterId
) {
  return getKnockoutPoints(
    getPlayerCharacterKnockouts(
      totals,
      playerId,
      characterId
    )
  );
}

// ============================================================
// Damage
// ============================================================

// ------------------------------------------------------------
// Player Damage
// ------------------------------------------------------------

export function getPlayerDamageRaw(
  totals = {},
  playerId
) {
  return Number(
    totals
      ?.damageRaw
      ?.players
      ?.[String(playerId)]
    || 0
  );
}

// ------------------------------------------------------------
// Character Damage
// ------------------------------------------------------------

export function getCharacterDamageRaw(
  totals = {},
  characterId
) {
  return Number(
    totals
      ?.damageRaw
      ?.characters
      ?.[String(characterId)]
    || 0
  );
}

// ------------------------------------------------------------
// Player Character Damage
// ------------------------------------------------------------

export function getPlayerCharacterDamageRaw(
  totals = {},
  playerId,
  characterId
) {
  return Number(
    totals
      ?.damageRaw
      ?.playerCharacters
      ?.[String(playerId)]
      ?.[String(characterId)]
    || 0
  );
}

// ------------------------------------------------------------
// Damage Points
// ------------------------------------------------------------

export function getDamagePoints(
  damageRaw = 0
) {
  return Math.floor(
    Number(damageRaw || 0) /
      DAMAGE_PER_POINT
  );
}

export function getPlayerDamagePoints(
  totals = {},
  playerId
) {
  return getDamagePoints(
    getPlayerDamageRaw(
      totals,
      playerId
    )
  );
}

export function getCharacterDamagePoints(
  totals = {},
  characterId
) {
  return getDamagePoints(
    getCharacterDamageRaw(
      totals,
      characterId
    )
  );
}

export function getPlayerCharacterDamagePoints(
  totals = {},
  playerId,
  characterId
) {
  return getDamagePoints(
    getPlayerCharacterDamageRaw(
      totals,
      playerId,
      characterId
    )
  );
}

// ============================================================
// Power Rank
// ============================================================

export function getPowerRankPoints(
  placementPoints = 0,
  knockoutPoints = 0,
  damagePoints = 0
) {
  return (
    Number(placementPoints || 0) +
    Number(knockoutPoints || 0) +
    Number(damagePoints || 0)
  );
}

// ------------------------------------------------------------
// Player Power Rank
// ------------------------------------------------------------

export function getPlayerPowerRankPoints(
  totals = {},
  playerId
) {
  return getPowerRankPoints(
    getPlayerPlacementPoints(
      totals,
      playerId
    ),
    getPlayerKnockoutPoints(
      totals,
      playerId
    ),
    getPlayerDamagePoints(
      totals,
      playerId
    )
  );
}

// ------------------------------------------------------------
// Character Power Rank
// ------------------------------------------------------------

export function getCharacterPowerRankPoints(
  totals = {},
  characterId
) {
  return getPowerRankPoints(
    getCharacterPlacementPoints(
      totals,
      characterId
    ),
    getCharacterKnockoutPoints(
      totals,
      characterId
    ),
    getCharacterDamagePoints(
      totals,
      characterId
    )
  );
}

// ------------------------------------------------------------
// Player Character Power Rank
// ------------------------------------------------------------

export function getPlayerCharacterPowerRankPoints(
  totals = {},
  playerId,
  characterId
) {
  return getPowerRankPoints(
    getPlayerCharacterPlacementPoints(
      totals,
      playerId,
      characterId
    ),
    getPlayerCharacterKnockoutPoints(
      totals,
      playerId,
      characterId
    ),
    getPlayerCharacterDamagePoints(
      totals,
      playerId,
      characterId
    )
  );
}

// ============================================================
// Penalty Multiplier
// ============================================================

export function calculatePenaltyMultiplier(
  gamesPlayed = 0
) {
  return Math.min(
    1.00,
    0.10 +
      Number(gamesPlayed || 0) *
        0.05
  );
}

// ============================================================
// Adjusted Power Rank
// ============================================================

export function getAdjustedPowerRank(
  basePowerRank,
  gamesPlayed
) {
  const penaltyMultiplier =
    calculatePenaltyMultiplier(
      gamesPlayed
    );

  return (
    Number(basePowerRank || 0) *
    penaltyMultiplier
  );
}

// ============================================================
// Average Power Rank
// ============================================================

export function getAveragePowerRank(
  powerRankPoints = 0,
  gamesPlayed = 0
) {
  if (!gamesPlayed) {
    return 0;
  }

  return (
    Number(powerRankPoints || 0) /
    Number(gamesPlayed)
  );
}

// ============================================================
// Adjusted Average Power Rank
// ============================================================

export function getAdjustedAveragePowerRank(
  powerRankPoints = 0,
  gamesPlayed = 0
) {
  if (!gamesPlayed) {
    return 0;
  }

  const baseAveragePowerRank =
    getAveragePowerRank(
      powerRankPoints,
      gamesPlayed
    );

  const penaltyMultiplier =
    calculatePenaltyMultiplier(
      gamesPlayed
    );

  return (
    baseAveragePowerRank *
    penaltyMultiplier
  );
}

// ============================================================
// Player Ranking Helpers
// ============================================================

export function getPlayerAveragePowerRank(
  totals = {},
  playerId
) {
  const gamesPlayed =
    getPlayerGameCount(
      totals,
      playerId
    );

  const powerRankPoints =
    getPlayerPowerRankPoints(
      totals,
      playerId
    );

  return getAveragePowerRank(
    powerRankPoints,
    gamesPlayed
  );
}

export function getPlayerAdjustedAveragePowerRank(
  totals = {},
  playerId
) {
  const gamesPlayed =
    getPlayerGameCount(
      totals,
      playerId
    );

  const powerRankPoints =
    getPlayerPowerRankPoints(
      totals,
      playerId
    );

  return getAdjustedAveragePowerRank(
    powerRankPoints,
    gamesPlayed
  );
}

// ============================================================
// Character Ranking Helpers
// ============================================================

export function getCharacterAveragePowerRank(
  totals = {},
  characterId
) {
  const gamesPlayed =
    getCharacterGameCount(
      totals,
      characterId
    );

  const powerRankPoints =
    getCharacterPowerRankPoints(
      totals,
      characterId
    );

  return getAveragePowerRank(
    powerRankPoints,
    gamesPlayed
  );
}

export function getCharacterAdjustedAveragePowerRank(
  totals = {},
  characterId
) {
  const gamesPlayed =
    getCharacterGameCount(
      totals,
      characterId
    );

  const powerRankPoints =
    getCharacterPowerRankPoints(
      totals,
      characterId
    );

  return getAdjustedAveragePowerRank(
    powerRankPoints,
    gamesPlayed
  );
}

// ============================================================
// Player Character Ranking Helpers
// ============================================================

export function getPlayerCharacterAveragePowerRank(
  totals = {},
  playerId,
  characterId
) {
  const gamesPlayed =
    getPlayerCharacterGameCount(
      totals,
      playerId,
      characterId
    );

  const powerRankPoints =
    getPlayerCharacterPowerRankPoints(
      totals,
      playerId,
      characterId
    );

  return getAveragePowerRank(
    powerRankPoints,
    gamesPlayed
  );
}

export function getPlayerCharacterAdjustedAveragePowerRank(
  totals = {},
  playerId,
  characterId
) {
  const gamesPlayed =
    getPlayerCharacterGameCount(
      totals,
      playerId,
      characterId
    );

  const powerRankPoints =
    getPlayerCharacterPowerRankPoints(
      totals,
      playerId,
      characterId
    );

  return getAdjustedAveragePowerRank(
    powerRankPoints,
    gamesPlayed
  );
}

// ============================================================
// Teams
// ============================================================

export function getTeamCharacterCombos(
  totals = {},
  teamId
) {
  return (
    totals
      ?.teams
      ?.[String(teamId)]
      ?.characterCombos
    || {}
  );
}

export function getTeamCharacterComboCount(
  totals = {},
  teamId,
  characterCombo
) {
  return Number(
    getTeamCharacterCombos(
      totals,
      teamId
    )?.[characterCombo]
    || 0
  );
}