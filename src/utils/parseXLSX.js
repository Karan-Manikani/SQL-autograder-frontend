import * as XLSX from "xlsx";

function readSheetData(selectedFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetData = {};

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const headers = [];
        const range = XLSX.utils.decode_range(worksheet["!ref"]);

        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = { c: C, r: range.s.r };
          const headerCell = XLSX.utils.encode_cell(cellAddress);
          headers.push(worksheet[headerCell].w);
        }

        sheetData[sheetName] = headers;
      });

      resolve(sheetData);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(selectedFile);
  });
}

export default readSheetData;
