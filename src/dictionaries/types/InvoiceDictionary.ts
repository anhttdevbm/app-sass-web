export type InvoiceDictionary = {
  seo: {
    title: string;
  };
  head: {
    title: string;
    key: string;
  };
  list: {
    table: {
      date: string;
      invoice: string;
      budget: string;
      status: string;
      dueDate: string;
      amount: string;
      balanceDue: string;
    };
  };
};
