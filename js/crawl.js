async function crawlJson(path) {
    const response = await fetch(path, { method: "GET", mode: "cors" });
    const json = await response.json();
    return json;
}

// TODO handle errors
export async function crawlGames(authorName) {
    const authorResponse = await crawlJson(`https://api.ldjam.com/vx/node2/walk/1/users/${encodeURIComponent(authorName)}/games?node`);
    console.log("Author's name:", authorResponse.node[0].name);
    const authorId = authorResponse.node_id;
    const gameIdsResponse = await crawlJson(`https://api.ldjam.com/vx/node/feed/${encodeURIComponent(authorId)}/authors/item/game?limit=1000`);
    const gameIds = gameIdsResponse.feed.map(x => x.id);
    const gamesResponse = await crawlJson(`https://api.ldjam.com/vx/node2/get/${gameIds.map(x => x.toString()).join("+")}`);
    const games = gamesResponse.node;

    const result = games.map(x => ({
        event: parseInt(x.path.split("/")[3], 10),
        name: x.name,
        ratings: {
            overall: x.magic["grade-01-average"],
            fun: x.magic["grade-02-average"],
            innovation: x.magic["grade-03-average"],
            theme: x.magic["grade-04-average"],
            graphics: x.magic["grade-05-average"],
            audio: x.magic["grade-06-average"],
            humor: x.magic["grade-07-average"],
            mood: x.magic["grade-08-average"],
        },
        result: {
            overall: x.magic["grade-01-result"],
            fun: x.magic["grade-02-result"],
            innovation: x.magic["grade-03-result"],
            theme: x.magic["grade-04-result"],
            graphics: x.magic["grade-05-result"],
            audio: x.magic["grade-06-result"],
            humor: x.magic["grade-07-result"],
            mood: x.magic["grade-08-result"],
        }
    }));

    console.log(result);

    return result;
}
