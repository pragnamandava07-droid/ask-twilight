import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { askGemini } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { question, accountId, spoken } = await req.json();

    const interactions = accountId
      ? await pool.query(
          `SELECT a.name, i.source, i.created_at, i.summary, i.decisions, i.risks, i.needs
           FROM interactions i JOIN accounts a ON a.id = i.account_id
           WHERE i.account_id = $1 ORDER BY i.created_at`,
          [accountId]
        )
      : await pool.query(
          `SELECT a.name, i.source, i.created_at, i.summary, i.decisions, i.risks, i.needs
           FROM interactions i JOIN accounts a ON a.id = i.account_id
           ORDER BY i.created_at`
        );

    const commitments = accountId
      ? await pool.query(
          `SELECT a.name, c.task, c.owner, c.due, c.done
           FROM commitments c JOIN accounts a ON a.id = c.account_id
           WHERE c.account_id = $1`,
          [accountId]
        )
      : await pool.query(
          `SELECT a.name, c.task, c.owner, c.due, c.done
           FROM commitments c JOIN accounts a ON a.id = c.account_id`
        );

    const context = JSON.stringify({
      interactions: interactions.rows,
      commitments: commitments.rows,
    });

    const scope = accountId
      ? "The data below belongs to ONE customer account that the user is currently viewing."
      : "The data below covers all of the team's customer accounts.";

    const spokenRule = spoken
      ? "Answer in 2 to 3 short, natural spoken sentences with no bullet points or markdown, as if talking to a colleague."
      : "";

    const prompt = `You are Ask Twilight, a friendly, knowledgeable assistant for a business team. You can answer any question.
- If the question is about the team's customers, accounts, conversations, risks, needs, or commitments, answer using ONLY the account data below, and be specific with names and dates. If the data doesn't contain the answer, say so. ${scope}
- If the question is about anything else (general knowledge, writing help, advice, explanations, brainstorming), answer it helpfully from your own knowledge. Do not claim it came from the account data, and do not mention the account data unless it is relevant.
- If you are unsure about something, or it needs live information you don't have (like today's news, weather, or prices), say so honestly instead of guessing.
- Keep answers clear and concise. Today's date is ${new Date().toDateString()}.
${spokenRule}

ACCOUNT DATA:
${context}

QUESTION: ${question}`;

    const answer = await askGemini(prompt);
    return NextResponse.json({ ok: true, answer });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "The AI is busy right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}