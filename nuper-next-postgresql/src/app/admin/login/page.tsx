import { notFound } from "next/navigation"

export default function OldAdminLoginPage() {
    // Hide the old admin login route essentially by returning 404
    notFound();

    // Unreachable
    return null;
}
