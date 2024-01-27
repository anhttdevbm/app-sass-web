import { Endpoint } from "api";
import { saleClientInstance } from "api/client";
import { useMutation } from "react-query";

export const budgetUploadFile = (files: FileList) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
  }
  const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
        'X-Amz-Credential': 'admin%2F20230619%2Fus-east-1%2Fs3%2Faws4_request',
        'X-Amz-Date': '20230619T171337Z',
        'X-Amz-Expires': '3600',
        'X-Amz-SignedHeaders': 'host',
        'X-Amz-Signature': 'f00fdbc8458d3536a24facdb0c2b58aa3c9f613be77a78cbcaba46f224f7fa46'
      }
  };

  return saleClientInstance.put(Endpoint.BUDGET_EXPENSE_CREATE, );
};

export const useBudgetExpenseAdd = () => {
  return useMutation({
    mutationFn: budgetUploadFile,
  });
};