// src/app/admin/[...slug]/page.js
import { notFound, redirect } from "next/navigation";

export default async function CatchAllAdminPage({ params }) {
  const { slug } = await params;
  const path = slug.join("/");

  // You can handle additional routing logic here
  // For now, just redirect to 404
  notFound();
}
