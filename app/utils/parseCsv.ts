export interface IUploadTemplateCsvDetailData {
  header: string[];
  data: Record<string, string>[];
}

export const parseCSV = (csvContent: string): IUploadTemplateCsvDetailData => {
  const rows = csvContent.split("\n").filter((row) => row.trim() !== "");
  const headers = rows[0].split(",").map((header) => header.trim());
  const data = rows.slice(1).map((row) => {
    const values = row.split(",").map((value) => value.trim());
    return headers.reduce(
      (obj, header, index) => {
        obj[header] = values[index] || "";
        return obj;
      },
      {} as Record<string, string>
    );
  });

  return { header: headers, data };
};
