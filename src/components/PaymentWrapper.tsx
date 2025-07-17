"use client";

import { useEffect, useState } from "react";
import PaymentTable from "./PaymentTable";
import AddPaymentForm from "./AddPaymentForm";

export default function PaymentWrapper() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    const res = await fetch("/api/payments");
    const data = await res.json();
    console.log("📥 Veriler yenilendi:", data);
    setPayments(data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <>
      <AddPaymentForm onAdded={fetchPayments} />
      <PaymentTable data={payments} onUpdated={fetchPayments} />
    </>
  );
}
