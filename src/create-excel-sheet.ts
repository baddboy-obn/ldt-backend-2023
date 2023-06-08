const excel = require("excel4node");

function percentToColor(percent?: string) {
  if (!percent || !percent.split) {
    return undefined;
  }

  const num = Number(percent.split(" ")[0]);

  if (num > 90) {
    return "#34D399";
  } else if (num > 40) {
    return "#FCD34D";
  } else {
    return "#EC4899";
  }
}

export function CreateExcelSheet(
  this: {
    workbook: any;
    worksheet: any;
    fillByRow: (row: (string | number | string[])[], index: number) => void;
  },
  resColumns: any[]
) {
  this.workbook = new excel.Workbook({
    logLevel: 0,
  });

  this.worksheet = this.workbook.addWorksheet("Результат проверки");

  const headStyle = this.workbook.createStyle({
    font: {
      color: "#1E40AF",
      size: 12,
      bold: true,
    },
  });

  const dangerStyle = this.workbook.createStyle({
    font: {
      color: "#EC4899",
    },
  });

  this.worksheet.cell(1, 1).string("Пол").style(headStyle);
  this.worksheet.cell(1, 2).string("Дата рождения").style(headStyle);
  this.worksheet.cell(1, 3).string("id").style(headStyle);
  this.worksheet.cell(1, 4).string("МКБ").style(headStyle);
  this.worksheet.cell(1, 5).string("Заболевание").style(headStyle);
  this.worksheet.cell(1, 6).string("Дата приема").style(headStyle);
  this.worksheet.cell(1, 7).string("Врач").style(headStyle);
  this.worksheet.cell(1, 8).string("Рекомендации врача").style(headStyle);
  this.worksheet.cell(1, 9).string("Ошибка").style(dangerStyle);
  this.worksheet.cell(1, 10).string("Средний результат (в %)").style(headStyle);
  this.worksheet.cell(1, 11).string("Мин. результат (в %)").style(headStyle);
  this.worksheet.cell(1, 12).string("Макс. результат (в %)").style(headStyle);

  let i_sec = 0;
  for (let i = 13; i < resColumns.length + 13; i++) {
    this.worksheet.cell(1, i).string(resColumns[i_sec]).style(headStyle);
    i_sec++;
  }

  this.fillByRow = function (
    row: (string | number | string[])[],
    index: number
  ) {
    this.worksheet.cell(index + 2, 1).string(row[0]);
    this.worksheet.cell(index + 2, 2).string(row[1]);
    this.worksheet.cell(index + 2, 3).number(row[2]);
    this.worksheet.cell(index + 2, 4).string(row[3]);
    this.worksheet.cell(index + 2, 5).string(row[4]);
    this.worksheet.cell(index + 2, 6).string(row[5]);
    this.worksheet.cell(index + 2, 7).string(row[6]);
    this.worksheet.cell(index + 2, 8).string(row[7]);
    this.worksheet
      .cell(index + 2, 9)
      .string(String(row[8]))
      .style({
        font: {
          color: percentToColor(row[8] as string),
        },
      });
    this.worksheet
      .cell(index + 2, 10)
      .string(String(row[9]) ?? "")
      .style({
        font: {
          color: percentToColor(row[9] as string),
        },
      });
    this.worksheet
      .cell(index + 2, 11)
      .string(String(row[10]) ?? "")
      .style({
        font: {
          color: percentToColor(row[10] as string),
        },
      });
    this.worksheet
      .cell(index + 2, 12)
      .string(String(row[11]) ?? "")
      .style({
        font: {
          color: percentToColor(row[11] as string),
        },
      });
    this.worksheet.cell(index + 2, 13).string(String(row[12]) ?? "");
    this.worksheet.cell(index + 2, 14).string(String(row[13]) ?? "");
    this.worksheet.cell(index + 2, 15).string(String(row[15]) ?? "");
  };
}
