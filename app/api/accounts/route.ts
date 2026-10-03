import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const r = await pool.query(`
    SELECT a.id, a.name,
      (SELECT COUNT(*) FROM interactions i WHERE i.account_id = a.id)::int AS interactions,
      (SELECT COUNT(*) FROM commitments c WHERE c.account_id = a.id AND c.done = false)::int AS open_commitments
    FROM accounts a
    ORDER BY a.created_at DESC
  `);
  return NextResponse.json(r.rows);
}