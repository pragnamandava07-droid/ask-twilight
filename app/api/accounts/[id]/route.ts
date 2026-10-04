import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const acc = await pool.query("SELECT id, name FROM accounts WHERE id = $1", [id]);
  const interactions = await pool.query(
    `SELECT id, source, summary, decisions, risks, needs, created_at
     FROM interactions WHERE account_id = $1 ORDER BY created_at DESC`,
    [id]
  );
  const commitments = await pool.query(
    `SELECT id, task, owner, due, done
     FROM commitments WHERE account_id = $1 ORDER BY done, id`,
    [id]
  );
  return NextResponse.json({
    account: acc.rows[0],
    interactions: interactions.rows,
    commitments: commitments.rows,
  });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM commitments WHERE account_id = $1", [id]);
    await client.query("DELETE FROM interactions WHERE account_id = $1", [id]);
    await client.query("DELETE FROM accounts WHERE id = $1", [id]);
    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    return NextResponse.json({ ok: false, error: "Could not delete" }, { status: 500 });
  } finally {
    client.release();
  }
}