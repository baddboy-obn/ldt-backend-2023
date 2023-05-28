import { compareSentences } from "./compare-sentences";
import { randomUUID } from "crypto";

const excel = require("excel4node");
const fs = require("fs");
const { parse } = require("csv-parse");
const path = require("path");
const xlsx_parse = require("node-xlsx").default;
const { stringify } = require("csv-stringify");

type TAllStats = {
  green: number;
  warning: number;
  error: number;
  unchecked: number;
  cardsCount: number;
};

type TAppointsResult = {
  id: string | number;
  appointData: {
    gender: string;
    birthDate: string;
    patientId: string | number;
    mkbCode: string;
    mkbName: string;
    serviceDate: string;
    doctorJobTitle: string;
  };
  error?: string[];
  result?: {
    average: number;
    max: number;
    min: number;
    list: {
      actualRecommendation: string;
      conjunction: {
        [1]: {
          mcbRecommendation: string;
          score: number;
        };
        [2]: {
          mcbRecommendation: string;
          score: number;
        };
        [3]: {
          mcbRecommendation: string;
          score: number;
        };
      };
    }[];
  };
};

type TDatasetRow = [
  string,
  string,
  number,
  string,
  string,
  string,
  string,
  string
];

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

export const initCheckout = (props: {
  mkbDataPath: string; // База с МКБ
  dataSetPath: string; // Датасет с клиента
  resultCSV: string; // Результат CSV
  resultEXCEL: string; // Результат XLSX
  checkoutData: {
    name: string;
    type: string;
    status: string;
    dateStart: string;
    dateEnd: string;
    responsible: {
      id: string;
      firstName: string;
      lastName: string;
      patronymic: string;
      role: string;
    };
    auditReason: string;
    resultDocs: {
      xl_href: string;
      csv_href: string;
    };
  };
}) =>
  new Promise((resolve) => {
    {
      const writableStream = fs.createWriteStream(props.resultCSV);

      const mkb_data: {
        code: string;
        recommendations: string[];
      }[] = [];

      const workSheetsFromFile = xlsx_parse.parse(props.dataSetPath);

      let allCount = 0;
      let recommendationsNotFoundCount = 0;

      const readMkbData = () => {
        fs.createReadStream(props.mkbDataPath)
          .pipe(parse({ delimiter: "," }))
          .on("data", (r: [string, string]) => {
            const recList = r[1].split("$").filter(Boolean);

            allCount++;

            if (recList.length === 0) {
              recommendationsNotFoundCount++;
            }

            mkb_data.push({
              code: r[0],
              recommendations: recList.length > 0 ? recList : [],
            });
          })
          .on("end", async () => {
            await checkoutResults();
          });
      };

      readMkbData();

      const checkoutResults = () => {
        const result: {
          patientRow: TDatasetRow;
          results?: TAuditResult;
          error?: string[];
        }[] = [];

        let errorsCount = 0;
        let notFoundedCodes: string[] = [];

        const fileData = workSheetsFromFile[0].data;

        const startIndex = 1;

        const jsonResults: TAppointsResult[] = [];

        const jsonStats: TAllStats = {
          green: 0,
          warning: 0,
          error: 0,
          unchecked: 0,
          cardsCount: 0,
        };

        jsonStats.cardsCount = fileData.length - 1;

        for (let i = startIndex; i < fileData.length; i++) {
          const row: TDatasetRow = fileData[i];
          let row_code = row[3];

          const is_more_width =
            row_code.split(".")["I48.0".split(".").length - 1] === "0";

          let foundedMkRow = mkb_data.find((el) => el.code === row_code);

          if (!foundedMkRow && is_more_width) {
            row_code = row_code
              .split(".")
              .filter((el) => Number(el) !== 0)
              .join(".");
            foundedMkRow = mkb_data.find((el) => el.code === row_code);
          }

          if (foundedMkRow && foundedMkRow.recommendations.length > 0) {
            const row_recommendation = row[7]
              .split(/[\r\n;]/g)
              .filter(Boolean)
              .map((el) => el.trim());

            let auditResults: TAuditResult = {
              resultsList: [],
              average: 0,
              min: 101,
              max: -1,
            };

            row_recommendation.forEach((docRecommendation) => {
              let result: TRecommendMeta = {
                [1]: {
                  score: 0,
                  mkbRec: "",
                  actualRec: docRecommendation,
                },
                [2]: {
                  score: 0,
                  mkbRec: "",
                  actualRec: docRecommendation,
                },
                [3]: {
                  score: 0,
                  mkbRec: "",
                  actualRec: docRecommendation,
                },
              };

              foundedMkRow.recommendations.forEach((mkRec) => {
                let similarity = Math.round(
                  compareSentences(docRecommendation, mkRec)
                );

                if (similarity > result[1].score) {
                  result[3] = {
                    ...result[2],
                  };
                  result[2] = {
                    ...result[1],
                  };
                  result[1] = {
                    score: similarity,
                    actualRec: docRecommendation,
                    mkbRec: mkRec,
                  };
                } else if (similarity > result[2].score) {
                  result[3] = {
                    ...result[2],
                  };
                  result[2] = {
                    score: similarity,
                    actualRec: docRecommendation,
                    mkbRec: mkRec,
                  };
                } else if (similarity > result[3].score) {
                  result[3] = {
                    score: similarity,
                    actualRec: docRecommendation,
                    mkbRec: mkRec,
                  };
                }
              });

              let avSum = 0;
              let avCount = 0;

              auditResults.resultsList.forEach((audRes) => {
                if (audRes[1].mkbRec) {
                  avSum += audRes[1].score;
                  avCount++;
                }
                if (audRes[2].mkbRec) {
                  avSum += audRes[2].score;
                  avCount++;
                }
                if (audRes[3].mkbRec) {
                  avSum += audRes[3].score;
                  avCount++;
                }
              });

              if (result[1].mkbRec) {
                avSum += result[1].score;
                avCount++;
              }
              if (result[2].mkbRec) {
                avSum += result[2].score;
                avCount++;
              }
              if (result[3].mkbRec) {
                avSum += result[3].score;
                avCount++;
              }

              const resAverage = Math.ceil(avSum / (avCount ?? 1));

              auditResults = {
                resultsList: [...auditResults.resultsList, result],
                max: Math.max(
                  result[1].score,
                  result[2].score,
                  result[3].score
                ),
                min: Math.min(
                  result[1].score,
                  result[2].score,
                  result[3].score
                ),
                average: resAverage,
              };

              if (resAverage > 90) {
                jsonStats.green++;
              } else if (resAverage > 40) {
                jsonStats.warning++;
              } else {
                jsonStats.error++;
              }
            });

            result.push({
              patientRow: row,
              results: auditResults,
            });
          } else {
            const isNothingToRecommend = !!foundedMkRow;

            if (!isNothingToRecommend) {
              notFoundedCodes = notFoundedCodes.filter((el) => el !== row_code);
              notFoundedCodes.push(row_code);
            }

            errorsCount++;
            result.push({
              patientRow: row,
              error: isNothingToRecommend
                ? ["recommends_not_found"]
                : ["mcb_code_not_found"],
            });
          }
        }

        let resColumns = [];

        for (let i = 1; i <= 3; i++) {
          resColumns.push(
            `От врача ${i}`,
            `Возможное совпадение ${i}.1`,
            `Возможное совпадение ${i}.2`,
            `Возможное совпадение ${i}.3`
          );
        }

        const resultColumns: string[] = [
          "Пол",
          "Дата рождения",
          "id",
          "МКБ",
          "Заболевание",
          "Дата приема",
          "Врач",
          "Рекомендации врача",
          "Ошибка",
          "Средний результат (в %)",
          "Мин. результат (в %)",
          "Макс. результат (в %)",
          ...resColumns,
        ];

        const stringifier = stringify({ header: true, columns: resultColumns });

        stringifier.pipe(writableStream);

        const workbook = new excel.Workbook({
          logLevel: 0,
        });
        const worksheet = workbook.addWorksheet("Результат проверки");

        const headStyle = workbook.createStyle({
          font: {
            color: "#1E40AF",
            size: 12,
            bold: true,
          },
        });

        const dangerStyle = workbook.createStyle({
          font: {
            color: "#EC4899",
          },
        });

        worksheet.cell(1, 1).string("Пол").style(headStyle);
        worksheet.cell(1, 2).string("Дата рождения").style(headStyle);
        worksheet.cell(1, 3).string("id").style(headStyle);
        worksheet.cell(1, 4).string("МКБ").style(headStyle);
        worksheet.cell(1, 5).string("Заболевание").style(headStyle);
        worksheet.cell(1, 6).string("Дата приема").style(headStyle);
        worksheet.cell(1, 7).string("Врач").style(headStyle);
        worksheet.cell(1, 8).string("Рекомендации врача").style(headStyle);
        worksheet.cell(1, 9).string("Ошибка").style(dangerStyle);
        worksheet
          .cell(1, 10)
          .string("Средний результат (в %)")
          .style(headStyle);
        worksheet.cell(1, 11).string("Мин. результат (в %)").style(headStyle);
        worksheet.cell(1, 12).string("Макс. результат (в %)").style(headStyle);

        let i_sec = 0;
        for (let i = 13; i < resColumns.length + 13; i++) {
          worksheet.cell(1, i).string(resColumns[i_sec]).style(headStyle);
          i_sec++;
        }

        result.forEach((res, i) => {
          const jsonResultItem: TAppointsResult = {
            id: randomUUID(),
            appointData: {
              gender: res.patientRow[0],
              birthDate: res.patientRow[1],
              patientId: res.patientRow[2],
              mkbCode: res.patientRow[3],
              mkbName: res.patientRow[4],
              serviceDate: res.patientRow[5],
              doctorJobTitle: res.patientRow[6],
            },
            error: res.error,
            result: res.results
              ? {
                  average: res.results.average,
                  max: res.results.max,
                  min: res.results.min,
                  list: res.results.resultsList.map((el) => ({
                    actualRecommendation: el[1].actualRec,
                    conjunction: {
                      [1]: {
                        mcbRecommendation: el[1].mkbRec,
                        score: el[1].score,
                      },
                      [2]: {
                        mcbRecommendation: el[2].mkbRec,
                        score: el[2].score,
                      },
                      [3]: {
                        mcbRecommendation: el[3].mkbRec,
                        score: el[3].score,
                      },
                    },
                  })),
                }
              : undefined,
          };

          jsonResults.push(jsonResultItem);

          let resultsArray: (string | number)[] = [];

          let haveError = res.error && res.error.length > 0;

          res.results?.resultsList.forEach((auditItem) => {
            let values = Object.values(auditItem).filter((el) => !!el.mkbRec);
            if (values.length > 0) {
              resultsArray.push(values[0].actualRec);
              values.forEach((value) => {
                resultsArray.push(`${value.mkbRec} | ${value.score}`);
              });
            }
          });

          let resultRow = [...res.patientRow, haveError ? res.error : ""];

          if (!haveError) {
            resultRow.push(
              `${Math.round(res.results.average)} %`,
              `${res.results.min} %`,
              `${res.results.max} %`,
              ...resultsArray
            );
          }

          stringifier.write(resultRow);
          worksheet.cell(i + 2, 1).string(resultRow[0]);
          worksheet.cell(i + 2, 2).string(resultRow[1]);
          worksheet.cell(i + 2, 3).number(resultRow[2]);
          worksheet.cell(i + 2, 4).string(resultRow[3]);
          worksheet.cell(i + 2, 5).string(resultRow[4]);
          worksheet.cell(i + 2, 6).string(resultRow[5]);
          worksheet.cell(i + 2, 7).string(resultRow[6]);
          worksheet.cell(i + 2, 8).string(resultRow[7]);
          worksheet
            .cell(i + 2, 9)
            .string(String(resultRow[8]))
            .style({
              font: {
                color: percentToColor(resultRow[8] as string),
              },
            });
          worksheet
            .cell(i + 2, 10)
            .string(String(resultRow[9]) ?? "")
            .style({
              font: {
                color: percentToColor(resultRow[9] as string),
              },
            });
          worksheet
            .cell(i + 2, 11)
            .string(String(resultRow[10]) ?? "")
            .style({
              font: {
                color: percentToColor(resultRow[10] as string),
              },
            });
          worksheet
            .cell(i + 2, 12)
            .string(String(resultRow[11]) ?? "")
            .style({
              font: {
                color: percentToColor(resultRow[11] as string),
              },
            });
          worksheet.cell(i + 2, 13).string(String(resultRow[12]) ?? "");
          worksheet.cell(i + 2, 14).string(String(resultRow[13]) ?? "");
          worksheet.cell(i + 2, 15).string(String(resultRow[15]) ?? "");
        });

        jsonStats.unchecked += errorsCount;

        workbook.write(props.resultEXCEL);

        resolve({
          result: jsonResults,
          allStats: jsonStats,
          resultDocs: props.checkoutData.resultDocs,
          name: props.checkoutData.name,
          type: props.checkoutData.type,
          status: props.checkoutData.status,
          dateStart: props.checkoutData.dateStart,
          dateEnd: props.checkoutData.dateEnd,
          responsible: props.checkoutData.responsible,
          auditReason: props.checkoutData.auditReason,
        });
      };
    }
  });

type TRecommendMeta = Record<
  number,
  {
    score: number;
    mkbRec: string;
    actualRec: string;
  }
>; // Выявляем топ 3 совпадения и формируем на каждое такой объект

type TAuditResult = {
  resultsList: TRecommendMeta[];
  average: number;
  max: number;
  min: number;
};
