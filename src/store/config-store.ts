import { create } from "zustand";
import { api } from "../services/api-client";

interface EscrowConfig {
    currency: string;
    inspectionPeriodDays: number;
    autoRelease: boolean;
    disputeWindowHours: number;
    requireProofOfDelivery: boolean;
    milestoneEnabled: boolean;
    amountMin: number;
    amountMax: number;
    feePercent: number;
    currencies: string[];
}

interface ConfigState {
    config: EscrowConfig | null;
    isLoading: boolean;
    error: string | null;
    fetchConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set) => ({
    config: null,
    isLoading: false,
    error: null,
    fetchConfig: async () => {
        try {
            set({ isLoading: true, error: null });
            const config = await api<EscrowConfig>("/config/escrow");
            set({ config, isLoading: false });
        } catch (e) {
            const message = e instanceof Error ? e.message : "Failed to load config";
            set({ error: message, isLoading: false });
        }
    },
}));
