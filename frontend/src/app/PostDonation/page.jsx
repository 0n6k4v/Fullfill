"use client";

import PostDonationComponent from "@/pages/PostDonation/page";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PostDonationPage() {
  return (
    <ProtectedRoute>
      <PostDonationComponent />
    </ProtectedRoute>
  );
}