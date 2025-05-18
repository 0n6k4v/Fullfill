"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import RequestComponent from "@/pages/RequestItem/page";

export default function RequstItemPage() {
  return (
    <ProtectedRoute>
      <RequestComponent />
    </ProtectedRoute>
  )
}