type Installment = {
    id: number;
    dueDate: string;
    amount: number;
    paid: boolean;
  };
  
  export function calculateRemaining(installments: Installment[]) {
    return installments
      .filter((i) => !i.paid)
      .reduce((sum, i) => sum + i.amount, 0);
  }
  