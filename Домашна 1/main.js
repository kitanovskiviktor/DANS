import * as cheerio from "cheerio";
import axios from "axios";
import fs from "fs";

const url = `https://www.mse.mk/mk/stats/symbolhistory/grdn`;


async function fetchIssuers() {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const options = $('select[name="Code"] option');

  let issuers = [];
  options.each((index, element) => {
    const optionText = $(element).text().trim();
    if (!/\d/.test(optionText)) {
      issuers.push(optionText);
    }
  });

  return issuers;
}


async function checkLastDataDate(code) {

  if (!fs.existsSync("data.json")) {
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

    const issuerData = data.find((item) => item.code === code);
    if (issuerData && issuerData.data.length > 0) {
      const lastDate = issuerData.data[issuerData.data.length - 1].datum;
      return lastDate;
    }
  } catch (error) {
    console.error("Error reading JSON data:", error);
    return null;
  }

  return null;
}

async function fetchMissingData(code, startDate, endDate) {
  const response = await axios.post(url, {
    fromDate: startDate,
    ToDate: endDate,
    Code: code,
  });

  const $ = cheerio.load(response.data);

  if ($(".no-results").length > 0) {
    console.log($(".no-results"));
    return;
  }

  const data = [];
  const rows = $("tr");

  rows.each((i, row) => {
    const columns = $(row).find("td");

    if (columns.length) {
      const rowData = {};
      const keys = [
        "datum",
        "poslednaTransakcija",
        "max",
        "min",
        "avg",
        "prom",
        "kolicina",
        "prometBEST",
        "vkupenPromet",
      ];
      columns.each((j, column) => {
        rowData[`${keys[j]}`] = $(column).text().trim();
      });
      data.push(rowData);
    }
  });

  return data;
}

function storeData(code, newData) {
  let existingData = [];

  if (fs.existsSync("data.json")) {
    try {
      existingData = JSON.parse(fs.readFileSync("data.json", "utf-8"));
    } catch (error) {
      console.error("Error reading JSON data for storing:", error);
    }
  }

  const issuerIndex = existingData.findIndex((item) => item.code === code);
  if (issuerIndex !== -1) {
    existingData[issuerIndex].data =
      existingData[issuerIndex].data.concat(newData);
  } else {
    existingData.push({
      code: code,
      data: newData,
    });
  }

  fs.writeFileSync("data.json", JSON.stringify(existingData, null, 2));
}

async function main() {
  const issuers = await fetchIssuers();
  for (const code of issuers) {
    const lastDate = await checkLastDataDate(code);
    const currentYear = new Date().getFullYear();
    const startYear = lastDate ? new Date(lastDate).getFullYear() + 1 : 2014;
    const endYear = currentYear;

    for (let year = startYear; year <= endYear; year++) {
      const startDate = `01.01.${year}`;
      const endDate = `31.12.${year}`;

      const newData = await fetchMissingData(code, startDate, endDate);

      if (newData && newData.length > 0) {
        storeData(code, newData);
      }
    }
  }
}

main();