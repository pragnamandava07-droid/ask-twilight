let cachedVoice: string | null = null;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const key = process.env.ELEVENLABS_API_KEY!;

    // keep it short to save ElevenLabs credits
    let clean = String(text || "").replace(/[*#_`]/g, "");
    if (clean.length > 600) {
      const cut = clean.slice(0, 600);
      const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
      clean = end > 200 ? cut.slice(0, end + 1) : cut;
    }

    if (!cachedVoice) {
      const vres = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": key },
      });
      const vjson = await vres.json();
      cachedVoice = vjson.voices?.[0]?.voice_id ?? null;
    }
    if (!cachedVoice) {
      return new Response(JSON.stringify({ error: "No voice found" }), { status: 500 });
    }

    const ares = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cachedVoice}`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ text: clean, model_id: "eleven_flash_v2_5" }),
    });

    if (!ares.ok) {
      console.log("ElevenLabs error:", (await ares.text()).slice(0, 200));
      return new Response(JSON.stringify({ error: "Voice failed" }), { status: 500 });
    }

    return new Response(await ares.arrayBuffer(), { headers: { "Content-Type": "audio/mpeg" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Voice failed" }), { status: 500 });
  }
}
