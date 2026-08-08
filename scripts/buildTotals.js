import fs from "fs/promises";
import path from "path";

const ROOT = path.resolve("public/all");


// ============================================================
// EMPTY SCHEMA
// ============================================================

const emptyTotals = () => ({

    names: {

        players: {},

        teams: {}

    },

    knockouts: {

        players: {},

        characters: {},

        playerCharacters: {}

    },

    damageRaw: {

        players: {},

        characters: {},

        playerCharacters: {}

    },

    placement: {

        players: {},

        characters: {},

        playerCharacters: {}

    },

    games: {

        all: {},

        players: {},

        characters: {},

        playerCharacters: {}

    },

    teams: {}

});


// ============================================================
// MERGE FLAT COUNTS
// ============================================================

const mergeCounts = (
    target = {},
    source = {}
) => {

    for (
        const [id, value]
        of Object.entries(source || {})
    ) {

        target[id] =
            (target[id] || 0) +
            value;

    }

};


// ============================================================
// MERGE NAMES
// ============================================================

const mergeNames = (
    target = {},
    source = {}
) => {

    for (
        const [id, names]
        of Object.entries(source || {})
    ) {

        if (!target[id]) {

            target[id] = {};

        }


        mergeCounts(
            target[id],
            names
        );

    }

};


// ============================================================
// MERGE NESTED STATS
//
// Example:
//
// playerCharacters:
// {
//     "26": {
//         "3": 10
//     }
// }
//
// ============================================================

const mergeNestedStats = (
    target = {},
    source = {}
) => {

    for (
        const [id, values]
        of Object.entries(source || {})
    ) {

        if (!target[id]) {

            target[id] = {};

        }


        mergeCounts(
            target[id],
            values
        );

    }

};


// ============================================================
// MERGE PLACEMENT
//
// Example:
//
// players:
// {
//     "26": {
//         "1": 3,
//         "2": 1
//     }
// }
//
// ============================================================

const mergePlacement = (
    target,
    source
) => {

    // --------------------------------------------------------
    // Players
    // --------------------------------------------------------

    mergeNestedStats(
        target.players,
        source.players || {}
    );


    // --------------------------------------------------------
    // Characters
    // --------------------------------------------------------

    mergeNestedStats(
        target.characters,
        source.characters || {}
    );


    // --------------------------------------------------------
    // Player + Character
    // --------------------------------------------------------

    for (
        const [playerId, characters]
        of Object.entries(
            source.playerCharacters || {}
        )
    ) {

        if (
            !target.playerCharacters[playerId]
        ) {

            target.playerCharacters[playerId] = {};

        }


        for (
            const [characterId, placements]
            of Object.entries(
                characters || {}
            )
        ) {

            if (
                !target.playerCharacters[playerId][characterId]
            ) {

                target.playerCharacters[playerId][characterId] = {};

            }


            mergeCounts(
                target.playerCharacters[playerId][characterId],
                placements
            );

        }

    }

};


// ============================================================
// MERGE GAMES
//
// IMPORTANT:
//
// Games are now numeric occurrence counts.
//
// Example:
//
// characters:
// {
//     "3": {
//         "season-1/na/event-2/game-1": 2
//     }
// }
//
// This means Character 3 appeared twice in that game.
//
// Therefore we ADD game counts when merging.
// ============================================================

const mergeGames = (
    target,
    source
) => {

    // --------------------------------------------------------
    // All Games
    // --------------------------------------------------------

    mergeCounts(
        target.all,
        source.all || {}
    );


    // --------------------------------------------------------
    // Player Games
    // --------------------------------------------------------

    for (
        const [playerId, games]
        of Object.entries(
            source.players || {}
        )
    ) {

        if (
            !target.players[playerId]
        ) {

            target.players[playerId] = {};

        }


        mergeCounts(
            target.players[playerId],
            games
        );

    }


    // --------------------------------------------------------
    // Character Games
    // --------------------------------------------------------

    for (
        const [characterId, games]
        of Object.entries(
            source.characters || {}
        )
    ) {

        if (
            !target.characters[characterId]
        ) {

            target.characters[characterId] = {};

        }


        mergeCounts(
            target.characters[characterId],
            games
        );

    }


    // --------------------------------------------------------
    // Player + Character Games
    // --------------------------------------------------------

    for (
        const [playerId, characters]
        of Object.entries(
            source.playerCharacters || {}
        )
    ) {

        if (
            !target.playerCharacters[playerId]
        ) {

            target.playerCharacters[playerId] = {};

        }


        for (
            const [characterId, games]
            of Object.entries(
                characters || {}
            )
        ) {

            if (
                !target.playerCharacters[playerId][characterId]
            ) {

                target.playerCharacters[playerId][characterId] = {};

            }


            mergeCounts(
                target
                    .playerCharacters[playerId]
                    [characterId],
                games
            );

        }

    }

};


// ============================================================
// MERGE TEAMS
// ============================================================

const mergeTeams = (
    target = {},
    source = {}
) => {

    for (
        const [teamId, team]
        of Object.entries(source || {})
    ) {

        if (
            !target[teamId]
        ) {

            target[teamId] = {

                characterCombos: {}

            };

        }


        mergeCounts(
            target[teamId].characterCombos,
            team.characterCombos || {}
        );

    }

};


// ============================================================
// MERGE TOTALS
// ============================================================

const mergeTotals = (
    target,
    source
) => {

    // --------------------------------------------------------
    // Names
    // --------------------------------------------------------

    mergeNames(
        target.names.players,
        source.names?.players || {}
    );


    mergeNames(
        target.names.teams,
        source.names?.teams || {}
    );


    // --------------------------------------------------------
    // Knockouts
    // --------------------------------------------------------

    mergeCounts(
        target.knockouts.players,
        source.knockouts?.players || {}
    );


    mergeCounts(
        target.knockouts.characters,
        source.knockouts?.characters || {}
    );


    mergeNestedStats(
        target.knockouts.playerCharacters,
        source.knockouts?.playerCharacters || {}
    );


    // --------------------------------------------------------
    // Damage
    // --------------------------------------------------------

    mergeCounts(
        target.damageRaw.players,
        source.damageRaw?.players || {}
    );


    mergeCounts(
        target.damageRaw.characters,
        source.damageRaw?.characters || {}
    );


    mergeNestedStats(
        target.damageRaw.playerCharacters,
        source.damageRaw?.playerCharacters || {}
    );


    // --------------------------------------------------------
    // Placement
    // --------------------------------------------------------

    mergePlacement(
        target.placement,
        source.placement || {}
    );


    // --------------------------------------------------------
    // Games
    // --------------------------------------------------------

    mergeGames(
        target.games,
        source.games || {}
    );


    // --------------------------------------------------------
    // Teams
    // --------------------------------------------------------

    mergeTeams(
        target.teams,
        source.teams || {}
    );

};


// ============================================================
// FILESYSTEM
// ============================================================

async function exists(file) {

    try {

        await fs.access(file);

        return true;

    } catch {

        return false;

    }

}


// ============================================================
// RECURSIVE BUILDER
// ============================================================

async function buildFolder(folder) {

    const folderName =
        path.basename(folder);


    // --------------------------------------------------------
    // Skip Unranked
    // --------------------------------------------------------

    if (
        folderName.startsWith("unranked")
    ) {

        console.log(
            `Skipping excluded folder: ${folder}`
        );

        return emptyTotals();

    }


    const entries =
        await fs.readdir(
            folder,
            {
                withFileTypes: true
            }
        );


    const childFolders =
        entries
            .filter(
                entry =>
                    entry.isDirectory()
            )
            .map(
                entry =>
                    path.join(
                        folder,
                        entry.name
                    )
            );


    const totalsFile =
        path.join(
            folder,
            "totals.json"
        );


    // ========================================================
    // LEAF NODE
    // ========================================================

    if (
        childFolders.length === 0
    ) {

        if (
            !(await exists(totalsFile))
        ) {

            throw new Error(
                `Missing totals.json in ${folder}`
            );

        }


        return JSON.parse(
            await fs.readFile(
                totalsFile,
                "utf8"
            )
        );

    }


    // ========================================================
    // PARENT NODE
    // ========================================================

    const merged =
        emptyTotals();


    for (
        const child
        of childFolders
    ) {

        const childTotals =
            await buildFolder(
                child
            );


        mergeTotals(
            merged,
            childTotals
        );

    }


    // ========================================================
    // WRITE TOTALS
    // ========================================================

    await fs.writeFile(
        totalsFile,
        JSON.stringify(
            merged,
            null,
            2
        )
    );


    console.log(
        `Generated ${totalsFile}`
    );


    return merged;

}


// ============================================================
// RUN
// ============================================================

async function main() {

    console.log(
        "Building totals.json files..."
    );


    await buildFolder(
        ROOT
    );


    console.log(
        "Finished building totals."
    );

}


main()
    .catch(error => {

        console.error(
            error
        );

        process.exit(1);

    });
