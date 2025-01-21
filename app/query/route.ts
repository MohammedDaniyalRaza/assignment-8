// import { db } from "@vercel/postgres";

// const client = await db.connect();

// async function listInvoices() {
// 	const data = await client.sql`
//     SELECT invoices.amount, customers.name
//        FROM invoices
//        JOIN customers ON invoices.customer_id = customers.id
//        WHERE invoices.amount = 666;
//   `;

// 	return data.rows;
// }

// export async function GET() {
//   return
//   try {
//   	return Response.json(await listInvoices());
//   } catch (error) {
//   	return Response.json({ error }, { status: 500 });
//   }
// }

import { db } from "@vercel/postgres";

async function listInvoices() {
  // Create a new client connection
  const client = await db.connect();
  
  try {
    const data = await client.sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;

    // Return the rows
    return data.rows;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error; // Re-throw error to handle in GET
  } finally {
    client.release(); // Ensure client is released back to the pool
  }
}

export async function GET() {
  try {
    const invoices = await listInvoices();
    return new Response(JSON.stringify(invoices), { status: 200 });
  } catch (error:any) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}
