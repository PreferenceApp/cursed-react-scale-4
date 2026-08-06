import fs from "fs/promises";
import path from "path";

const ROOT = path.resolve("public/all");

// --------------------------------------------------
// Totals Helpers (copied from DataContext)
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

const deepCopyStats = (item) => ({
    ...item,
    totals: { ...item.totals },
    names: { ...item.names },
    characters: { ...item.characters },
    games: item.games ? [...item.games] : []
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

    target.characters = addNumbers(
        target.characters,
        source.characters
    );

    if (source.games?.length) {

        const games = new Set(
            target.games || []
        );

        for (const game of source.games) {
            games.add(game);
        }

        target.games = Array.from(games);
    }
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
                    ...character.totals
                },
                games: character.games
                    ? [...character.games]
                    : [],
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


        if (character.games?.length) {

            const games = new Set(
                target[id].games || []
            );

            for (const game of character.games) {
                games.add(game);
            }

            target[id].games = Array.from(games);
        }


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

    // EXCLUSION CHECK: Skip this folder entirely if it matches your rule
    // Example rule: Ignore folders starting with "unranked" or "ignore"
    if (folderName.startsWith("unranked")) {
        console.log(`Skipping excluded folder: ${folder}`);
        return emptyTotals(); // Return empty totals so it doesn't break parent merges
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
        Leaf folder:

        Example:
        public/all/season-1/na/event/game-1

        This is the source of truth.
        NEVER rewrite it.
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
        Parent folder:

        Merge children totals
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