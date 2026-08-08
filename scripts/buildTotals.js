import fs from "fs/promises";
import path from "path";

const ROOT = path.resolve("public/all");


// ============================================================
// Empty Schema
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
// Merge Flat Counts
// ============================================================

const mergeCounts = (
    target = {},
    source = {}
) => {

    for (
        const [id, value]
        of Object.entries(source)
    ) {

        target[id] =
            (target[id] || 0) + value;

    }

};


// ============================================================
// Merge Names
// ============================================================

const mergeNames = (
    target = {},
    source = {}
) => {

    for (
        const [id, names]
        of Object.entries(source)
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
// Merge Nested Stats
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
        of Object.entries(source)
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
// Merge Placement
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
    target = {},
    source = {}
) => {

    mergeNestedStats(
        target.players,
        source.players || {}
    );


    mergeNestedStats(
        target.characters,
        source.characters || {}
    );


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
            of Object.entries(characters)
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
// Merge Games
//
// Game paths are UNIQUE.
//
// Therefore we do NOT add them.
// We simply preserve the path.
//
// ============================================================

const mergeGames = (
    target = {},
    source = {}
) => {

    // --------------------------------------------------------
    // All Games
    // --------------------------------------------------------

    for (
        const gamePath
        of Object.keys(source.all || {})
    ) {

        target.all[gamePath] = true;

    }


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


        for (
            const gamePath
            of Object.keys(games)
        ) {

            target.players[playerId][gamePath] = true;

        }

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


        for (
            const gamePath
            of Object.keys(games)
        ) {

            target.characters[characterId][gamePath] = true;

        }

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
            of Object.entries(characters)
        ) {

            if (
                !target.playerCharacters[playerId][characterId]
            ) {

                target.playerCharacters[playerId][characterId] = {};

            }


            for (
                const gamePath
                of Object.keys(games)
            ) {

                target
                    .playerCharacters[playerId]
                    [characterId]
                    [gamePath] = true;

            }

        }

    }

};


// ============================================================
// Merge Teams
// ============================================================

const mergeTeams = (
    target = {},
    source = {}
) => {

    for (
        const [teamId, team]
        of Object.entries(source)
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
// Merge Totals
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
// Filesystem
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
// Recursive Builder
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
    // Leaf Node
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
    // Parent Node
    // ========================================================

    const merged =
        emptyTotals();


    for (
        const child
        of childFolders
    ) {

        const childTotals =
            await buildFolder(child);


        mergeTotals(
            merged,
            childTotals
        );

    }


    // ========================================================
    // Write Totals
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
// Run
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
