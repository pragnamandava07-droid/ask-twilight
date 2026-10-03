import { pool } from "@/lib/db";

export async function POST() {
  try {
    const r = await pool.query(`
      SELECT a.name, c.task, c.owner, c.due
      FROM commitments c JOIN accounts a ON a.id = c.account_id
      WHERE c.done = false
      ORDER BY a.name, c.id
    `);

    let text = "Good morning. Here is your Ask Twilight brief. ";
    if (r.rows.length === 0) {
      text += "You have no open commitments. Nice work.";
    } else {
      text += `You have ${r.rows.length} open commitments. `;
      for (const row of r.rows.slice(0, 5)) {
        text += `For ${row.name}: ${row.task}, owned by ${row.owner}, due ${row.due}. `;
      }
      if (r.rows.length > 5) text += "Open the dashboard to see the rest.";
    }

    const key = process.env.ELEVENLABS_API_KEY!;

    // use the first voice available on your account
    const vres = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": key },
    });
    const vjson = await vres.json();
    const voiceId = vjson.voices?.[0]?.voice_id;
    if (!voiceId) {
      return new Response(JSON.stringify({ error: "No ElevenLabs voice found" }), { status: 500 });
    }

    const ares = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ text, model_id: "eleven_multilingual_v2" }),
    });

    if (!ares.ok) {
      const msg = await ares.text();
      console.log("ElevenLabs error:", msg.slice(0, 200));
      return new Response(JSON.stringify({ error: "Voice failed" }), { status: 500 });
    }

    const audio = await ares.arrayBuffer();
    return new Response(audio, { headers: { "Content-Type": "audio/mpeg" } });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Voice failed" }), { status: 500 });
  }
}
