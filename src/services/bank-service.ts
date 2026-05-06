import { api } from "./api-client";
import type { Bank, AccountDetail } from "../types";

class BankService {
  async getAllBanks(): Promise<Bank[]> {
    const response = await api<Bank[]>("/banks");
    return response;
  }

  async resolveAccount(accountNumber: string, bankCode: string): Promise<AccountDetail> {
    const response = await api<AccountDetail>(`/banks/resolve?account_number=${accountNumber}&bank_code=${bankCode}`);
    return response;
  }
}

export const bankService = new BankService();
