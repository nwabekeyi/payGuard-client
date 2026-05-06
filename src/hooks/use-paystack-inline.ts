import { useState, useCallback } from "react";
import { api } from "../services/api-client";

export interface InitPaymentResponse {
  accessCode: string;
  reference: string;
  email: string;
  amount: string;
  currency: string;
  callbackUrl?: string;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string;

function loadPaystack(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve();

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack"));

    document.body.appendChild(script);
  });
}

export function usePaystackInline<T = any>(
  escrowId?: string,
  onPaymentSuccess?: (data?: T | { error?: string }) => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCheckout = useCallback(
    async (payload: InitPaymentResponse, escrowIdOrRef: string | null, isNewEscrow: boolean) => {
      try {
        await loadPaystack();

        console.log("Opening Paystack checkout with payload:", payload);

        const handler = window.PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: payload.email,
          amount: Number(payload.amount),
          ref: payload.reference,
          callback: (response: any) => {
            if (isNewEscrow) {
              // New escrow flow: use verify-and-create endpoint
              const savedData = localStorage.getItem("pending_escrow_data");
              const savedAmount = localStorage.getItem("pending_payment_amount");
              
              if (!savedData || !savedAmount) {
                setError("Escrow data missing. Please try again.");
                setLoading(false);
                onPaymentSuccess?.({ error: "Escrow data missing" });
                return;
              }

              api<any>("/escrows/verify-and-create", {
                method: "POST",
                body: JSON.stringify({
                  txnRef: response.reference,
                  amount: parseInt(savedAmount),
                  escrowData: JSON.parse(savedData),
                }),
              })
              .then((result) => {
                if (result?.error || result?.status === "failed") {
                  throw new Error(result?.error || result?.message || "Verification failed");
                }
                localStorage.removeItem("pending_escrow_data");
                localStorage.removeItem("pending_payment_amount");
                setLoading(false);
                onPaymentSuccess?.(result);
              })
              .catch((err: any) => {
                setError(err?.message || "Verification failed");
                setLoading(false);
                onPaymentSuccess?.({ error: err?.message });
              });
            } else {
              // Existing escrow flow: use verify endpoint with UUID
              if (!escrowIdOrRef) {
                setError("Escrow ID missing");
                setLoading(false);
                onPaymentSuccess?.({ error: "Escrow ID missing" });
                return;
              }
              api<any>(`/payments/verify/${escrowIdOrRef}`, {
                method: "POST",
                body: JSON.stringify({
                  txnRef: response.reference,
                  amount: Number(payload.amount),
                }),
              })
              .then((result) => {
                if (result?.error || result?.status === "failed") {
                  throw new Error(result?.error || result?.message || "Verification failed");
                }
                setLoading(false);
                onPaymentSuccess?.(result);
              })
              .catch((err: any) => {
                setError(err?.message || "Verification failed");
                setLoading(false);
                onPaymentSuccess?.({ error: err?.message });
              });
            }
          },
          onClose: () => {
            setLoading(false);
            setError("Payment cancelled");
          },
        });

        handler.openIframe();
      } catch (err: any) {
        console.error("Failed to open Paystack popup:", err);
        setError(err.message || "Payment failed");
        setLoading(false);
        onPaymentSuccess?.({ error: err.message || "Payment failed" });
      }
    },
    [onPaymentSuccess]
  );

  const initiatePayment = useCallback(
    async (targetId?: string) => {
      const finalId = targetId || escrowId;
      if (!finalId) return;

      setLoading(true);
      setError(null);

      try {
        const payload = await api<InitPaymentResponse>(
          `/payments/init/${finalId}`
        );

         openCheckout(payload, finalId, false);
      } catch {
        setError("Failed to initiate payment");
        setLoading(false);
      }
    },
    [escrowId, openCheckout]
  );

  const initiateNewPayment = useCallback(
    async (escrowData: unknown) => {
      setLoading(true);
      setError(null);

      try {
        const payload = await api<InitPaymentResponse>(
          "/payments/init-new",
          {
            method: "POST",
            body: JSON.stringify(escrowData),
          }
        );

        // Store escrow data and base amount for verification (amount is in naira)
        localStorage.setItem("pending_escrow_data", JSON.stringify(escrowData));
        const baseAmount = (escrowData as any)?.amount;
        if (baseAmount) {
          localStorage.setItem("pending_payment_amount", baseAmount.toString());
        }

        openCheckout(payload, null, true);
      } catch {
        setError("Failed to initiate payment");
        setLoading(false);
      }
    },
    [openCheckout]
  );

  return {
    initiatePayment,
    initiateNewPayment,
    loading,
    error,
  };
}