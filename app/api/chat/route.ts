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

    const prompt = `You are Ask Twilight, an assistant that helps business teams recall what they know about their customers.
Answer the question using ONLY the data below. Be concise and specific, and mention account names and dates when relevant.
If the data doesn't contain the answer, say so. Today's date is ${new Date().toDateString()}.
   ${spoken ? "Answer in 2 to 3 short, natural spoken sentences with no bullet points or markdown, as if talking to a colleague." : ""}
DATA:
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