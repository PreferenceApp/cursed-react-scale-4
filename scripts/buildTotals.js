import fs from "fs/promises";
import path from "path";

const ROOT = path.resolve("public/all");

// --------------------------------------------------
// Totals Helpers
// --------------------------------------------------

const emptyTotals = () => ({
    players: {},
    teams: {},
    characters: {},
});


const addNumbers = (a = {}, b = {}) => {

    const result = { ...a };

    for (const [key, value] of Object.entries(b || {})) {
        result[key] = (result[key] || 0) + value;
    }

    return result;
};


const mergeGames = (a = [], b = []) => {

    const games = new Set(a);

    for (const game of b) {
        games.add(game);
    }

    return [...games];
};


// --------------------------------------------------
// Deep Copy
// --------------------------------------------------

const deepCopyStats = (item = {}) => ({
    ...item,

    totals: {
        ...(item.totals || {})
    },

    names: {
        ...(item.names || {})
    },

    teams: {
        ...(item.teams || {})
    },

    characters: {
        ...(item.characters || {})
    },

    games: item.games
        ? [...item.games]
        : []
});


// --------------------------------------------------
// Merge Operations
// --------------------------------------------------

const mergeStats = (target, source) => {

    target.totals = addNumbers(
        target.totals,
        source.totals
    );


    target.names = addNumbers(
        target.names,
        source.names
    );


    target.teams = addNumbers(
        target.teams,
        source.teams
    );


    target.characters = addNumbers(
        target.characters,
        source.characters
    );


    target.games = mergeGames(
        target.games,
        source.games
    );
};



const mergeCollections = (
    target,
    source,
    mergeFunction
) => {

    for (const [id, item] of Object.entries(source || {})) {

        if (!target[id]) {

            target[id] = deepCopyStats(item);

        } else {

            mergeFunction(
                target[id],
                item
            );
        }
    }
};



const mergeCharacters = (
    target,
    source
) => {

    for (const [id, character] of Object.entries(source || {})) {


        if (!target[id]) {

            target[id] = {
                ...character,

                totals: {
                    ...(character.totals || {})
                },

                games: [
                    ...(character.games || [])
                ],

                players: {}
            };


            mergeCollections(
                target[id].players,
                character.players,
                mergeStats
            );


            continue;
        }



        target[id].totals = addNumbers(
            target[id].totals,
            character.totals
        );


        target[id].games = mergeGames(
            target[id].games,
            character.games
        );


        if (!target[id].players) {
            target[id].players = {};
        }


        mergeCollections(
            target[id].players,
            character.players,
            mergeStats
        );
    }
};



const mergeTotals = (
    target,
    source
) => {

    mergeCollections(
        target.players,
        source.players,
        mergeStats
    );


    mergeCollections(
        target.teams,
        source.teams,
        mergeStats
    );


    mergeCharacters(
        target.characters,
        source.characters
    );
};


// --------------------------------------------------
// Filesystem Helpers
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


    // Ignore excluded folders
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



    /*
        Leaf folder

        Example:
        public/all/season-1/na/event-1/game-1

        This is the source of truth.
    */

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



    /*
        Parent folder

        Merge children
    */

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
