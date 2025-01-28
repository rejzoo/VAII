import { ServerData } from "@/types/types";

export async function GET() {
    const apiUrlEu = "https://api.worldoftanks.eu/wgn/servers/info/?application_id=67ea591cc3a72e6e7aa43d66b852a3cd";
    const apiUrlNa = "https://api.worldoftanks.com/wgn/servers/info/?application_id=67ea591cc3a72e6e7aa43d66b852a3cd";
    const apiUrlAsia = "https://api.worldoftanks.asia/wgn/servers/info/?application_id=67ea591cc3a72e6e7aa43d66b852a3cd";

    try {
        const [euResponse, naResponse, asiaResponse] = await Promise.all([
            fetch(apiUrlEu),
            fetch(apiUrlNa),
            fetch(apiUrlAsia),
        ]);

        if (!euResponse.ok) throw new Error(`EU API failed: ${euResponse.statusText}`);
        if (!naResponse.ok) throw new Error(`NA API failed: ${naResponse.statusText}`);
        if (!asiaResponse.ok) throw new Error(`ASIA API failed: ${asiaResponse.statusText}`);

        const [euData, naData, asiaData] = await Promise.all([
            euResponse.json(),
            naResponse.json(),
            asiaResponse.json(),
        ]);

        const euWotData = euData.data.wot.map((server: ServerData) => ({
            server: server.server,
            players_online: server.players_online,
            region: "EU",
        }));

        [euWotData[0], euWotData[1]] = [euWotData[1], euWotData[0]];

        const naWotData = naData.data.wot.map((server: ServerData) => ({
            server: server.server,
            players_online: server.players_online,
            region: "NA",
        }));

        [naWotData[0], naWotData[1]] = [naWotData[1], naWotData[0]];


        const asiaWotData = asiaData.data.wot.map((server: ServerData) => ({
            server: server.server,
            players_online: server.players_online,
            region: "ASIA",
        }));

        const serversData = [...euWotData, ...naWotData, ...asiaWotData];

        console.log(serversData);

        return new Response(JSON.stringify(serversData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching WoT data:", error.message);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        } else {
            console.error("Unexpected error:", error);
            return new Response(JSON.stringify({ error: "An unexpected error occurred." }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
}