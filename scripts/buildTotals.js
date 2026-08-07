import fs from "fs/promises";
import path from "path";

const ROOT = path.resolve("public/all");


// --------------------------------------------------
// Empty Schema
// --------------------------------------------------

const emptyStats = () => ({
    placement: 0,
    knockouts: 0,
    damageRaw: 0,
    games: 0
});


const emptyTotals = () => ({
    players: {},
    teams: {},
    characters: {},

    relationships: {
        players: {},
        teams: {},
        characters: {}
    }
});


// --------------------------------------------------
// Helpers
// --------------------------------------------------

const addStats = (target = {}, source = {}) => {

    target.placement =
        (target.placement || 0) +
        (source.placement || 0);


    target.knockouts =
        (target.knockouts || 0) +
        (source.knockouts || 0);


    target.damageRaw =
        (target.damageRaw || 0) +
        (source.damageRaw || 0);


    if (source.games) {

        target.games =
            (target.games || 0) +
            source.games;
    }
};



const mergeCounts = (target = {}, source = {}) => {

    for (const [id, count] of Object.entries(source || {})) {

        target[id] =
            (target[id] || 0) + count;
    }
};



const mergeNames = (target = {}, source = {}) => {

    for (const [name, count] of Object.entries(source || {})) {

        target[name] =
            (target[name] || 0) + count;
    }
};



// --------------------------------------------------
// Players
// --------------------------------------------------

const mergePlayers = (target, source) => {

    for (const [playerId, player] of Object.entries(source || {})) {


        if (!target[playerId]) {

            target[playerId] = {
                names: {},
                stats: emptyStats()
            };
        }


        mergeNames(
            target[playerId].names,
            player.names
        );


        addStats(
            target[playerId].stats,
            player.stats
        );
    }
};



// --------------------------------------------------
// Teams
// --------------------------------------------------

const mergeTeams = (target, source) => {

    for (const [teamId, team] of Object.entries(source || {})) {


        if (!target[teamId]) {

            target[teamId] = {
                names: {},
                stats: emptyStats()
            };
        }


        mergeNames(
            target[teamId].names,
            team.names
        );


        addStats(
            target[teamId].stats,
            team.stats
        );
    }
};



// --------------------------------------------------
// Characters
// --------------------------------------------------

const mergeCharacters = (target, source) => {


    for (const [characterId, character] of Object.entries(source || {})) {


        if (!target[characterId]) {

            target[characterId] = {
                stats: emptyStats(),
                players: {}
            };
        }


        addStats(
            target[characterId].stats,
            character.stats
        );


        mergePlayers(
            target[characterId].players,
            character.players
        );
    }
};



// --------------------------------------------------
// Relationships
// --------------------------------------------------

const mergeRelationships = (target, source = {}) => {


    // Player relationships

    for (const [playerId, player] of Object.entries(
        source.players || {}
    )) {


        if (!target.players[playerId]) {

            target.players[playerId] = {
                teams: {},
                characters: {}
            };
        }


        mergeCounts(
            target.players[playerId].teams,
            player.teams
        );


        mergeCounts(
            target.players[playerId].characters,
            player.characters
        );
    }



    // Team relationships

    for (const [teamId, team] of Object.entries(
        source.teams || {}
    )) {


        if (!target.teams[teamId]) {

            target.teams[teamId] = {
                players: {},
                characters: {},
                charactersCombo: {}
            };
        }


        mergeCounts(
            target.teams[teamId].players,
            team.players
        );


        mergeCounts(
            target.teams[teamId].characters,
            team.characters
        );


        mergeCounts(
            target.teams[teamId].charactersCombo,
            team.charactersCombo
        );
    }



    // Character relationships

    for (const [characterId, character] of Object.entries(
        source.characters || {}
    )) {


        if (!target.characters[characterId]) {

            target.characters[characterId] = {
                players: {},
                teams: {}
            };
        }


        mergeCounts(
            target.characters[characterId].players,
            character.players
        );


        mergeCounts(
            target.characters[characterId].teams,
            character.teams
        );
    }
};



// --------------------------------------------------
// Merge Totals
// --------------------------------------------------

const mergeTotals = (target, source) => {

    mergePlayers(
        target.players,
        source.players
    );


    mergeTeams(
        target.teams,
        source.teams
    );


    mergeCharacters(
        target.characters,
        source.characters
    );


    mergeRelationships(
        target.relationships,
        source.relationships
    );
};



// --------------------------------------------------
// Filesystem
// --------------------------------------------------

async function exists(file) {

    try {

        await fs.access(file);

        return true;

    } catch {

        return false;
    }
}



// --------------------------------------------------
// Recursive Builder
// --------------------------------------------------

async function buildFolder(folder) {


    const folderName = path.basename(folder);


    if (folderName.startsWith("unranked")) {

        console.log(
            `Skipping excluded folder: ${folder}`
        );

        return emptyTotals();
    }



    const entries = await fs.readdir(
        folder,
        {
            withFileTypes: true
        }
    );



    const childFolders = entries
        .filter(entry => entry.isDirectory())
        .map(entry =>
            path.join(folder, entry.name)
        );



    const totalsFile = path.join(
        folder,
        "totals.json"
    );



    // Leaf node

    if (childFolders.length === 0) {


        if (!(await exists(totalsFile))) {

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



    // Parent node

    const merged = emptyTotals();



    for (const child of childFolders) {


        const childTotals =
            await buildFolder(child);


        mergeTotals(
            merged,
            childTotals
        );
    }



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



// --------------------------------------------------
// Run
// --------------------------------------------------

async function main() {

    console.log(
        "Building totals.json files..."
    );


    await buildFolder(ROOT);


    console.log(
        "Finished building totals."
    );
}



main()
    .catch(error => {

        console.error(error);

        process.exit(1);

    });
