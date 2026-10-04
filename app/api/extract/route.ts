import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { pool } from "@/lib/db";
export const maxDuration = 60;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
];

export async function POST(req: Request) {
  try {
    const { accountName, source, text, files } = await req.json();
    const attachments: { name: string; mimeType: string; data: string }[] = files || [];

    const prompt = `You are an assistant for a business team. Read this ${source || "meeting"} information and extract the key details.
The information may be typed text and/or attached files (photos of handwritten notes or whiteboards, screenshots, PDFs, or audio recordings). Read or listen to everything provided.
Return ONLY JSON in exactly this shape:
{
  "summary": "2-3 sentence summary",
  "decisions": ["..."],
  "risks": ["..."],
  "needs": ["customer needs or interests, e.g. payroll integration"],
  "commitments": [{"task": "...", "owner": "person or team", "due": "date or 'unspecified'"}],
  "extracted_text": "a short plain-text version of what the attached files said, or empty if there are no files"
}

TYPED TEXT:
${text || "(none)"}`;

    const parts: any[] = [{ text: prompt }];
    for (const f of attachments) {
      parts.push({ inlineData: { mimeType: f.mimeType, data: f.data } });
    }

    let res: any = null;
    let lastErr: any = null;
    for (const model of MODELS) {
      try {
        console.log("Trying model:", model);
        res = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts }],
          config: { responseMimeType: "application/json" },
        });
        console.log("Worked with:", model);
        break;
      } catch (err: any) {
        console.log("Failed:", model, String(err.message).slice(0, 150));
        lastErr = err;
      }
    }
    if (!res) throw lastErr;

    const data = JSON.parse(res.text ?? "{}");

    const acc = await pool.query(
      `INSERT INTO accounts(name) VALUES($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
      [accountName]
    );
    const accountId = acc.rows[0].id;

    const fileNote = attachments.length
      ? `\n[Attached: ${attachments.map((f) => f.name).join(", ")}]\n${data.extracted_text || ""}`
      : "";

    const inter = await pool.query(
      `INSERT INTO interactions(account_id, source, raw_text, summary, decisions, risks, needs)
       VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [
        accountId,
        source,
        (text || "") + fileNote,
        data.summary,
        JSON.stringify(data.decisions || []),
        JSON.stringify(data.risks || []),
        JSON.stringify(data.needs || []),
      ]
    );

    for (const c of data.commitments || []) {
      await pool.query(
        `INSERT INTO commitments(account_id, interaction_id, task, owner, due)
         VALUES($1,$2,$3,$4,$5)`,
        [accountId, inter.rows[0].id, c.task, c.owner, c.due]
      );
    }

    return NextResponse.json({ ok: true, data, accountId });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}