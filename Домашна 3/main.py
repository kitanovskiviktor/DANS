import aiohttp
import asyncio
import requests
from bs4 import BeautifulSoup
import psycopg2
from psycopg2 import sql
import os
from datetime import datetime


DB_HOST = 'localhost'
DB_NAME = 'DIANS'
DB_USER = 'postgres'
DB_PASSWORD = 'postgres'

URL = "https://www.mse.mk/mk/stats/symbolhistory/grdn"
SEM_LIMIT = 20 

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        port=5433
    )

def create_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    create_table_query = """
    CREATE TABLE IF NOT EXISTS stock_data (
        code VARCHAR(50),
        datum VARCHAR(50),
        posledna_transakcija VARCHAR(50),
        max VARCHAR(50),
        min VARCHAR(50),
        avg VARCHAR(50),
        prom VARCHAR(50),
        kolicina INT,
        promet_best VARCHAR(50),
        vkupen_promet FLOAT
    );
    """
    cursor.execute(create_table_query)
    conn.commit()
    cursor.close()
    conn.close()



def insert_data(code, new_data):
    conn = get_db_connection()
    cursor = conn.cursor()

    for entry in new_data:
        
        def convert_to_float(value):
            if value:
                value = value.replace(".", "")
                if "," in value:
                    value = value.replace(",", ".")
                return float(value)
            return None


        def convert_to_int(value):
                       if value:
                           
                           value = value.replace(".", "")
                           try:
                               return int(value)
                           except ValueError:
                               return None  
                       return None


        cursor.execute(
            """
            INSERT INTO stock_data (code, datum, posledna_transakcija, max, min, avg, prom, kolicina, promet_best, vkupen_promet)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """,
            (
                code,
                datetime.strptime(entry["datum"], "%d.%m.%Y"),
                entry["poslednaTransakcija"],
                convert_to_float(entry["max"]),
                convert_to_float(entry["min"]),
                convert_to_float(entry["avg"]),
                entry["prom"],
                convert_to_int(entry["kolicina"]),
                entry["prometBEST"],
                convert_to_float(entry["vkupenPromet"]),
            )
        )

    conn.commit()
    cursor.close()
    conn.close()



def fetch_issuers_sync():
    response = requests.get(URL)
    soup = BeautifulSoup(response.content, "html.parser")
    options = soup.select('select[name="Code"] option')

    issuers = [opt.text.strip() for opt in options if not any(char.isdigit() for char in opt.text.strip())]
    return issuers


async def fetch_missing_data(session, code, start_date, end_date):
    payload = {
        "fromDate": start_date,
        "ToDate": end_date,
        "Code": code,
    }

    async with session.post(URL, data=payload) as response:
        html = await response.text()
        soup = BeautifulSoup(html, "html.parser")

        if soup.select_one(".no-results"):
            return []

        data = []
        rows = soup.find_all("tr")
        keys = [
            "datum",
            "poslednaTransakcija",
            "max",
            "min",
            "avg",
            "prom",
            "kolicina",
            "prometBEST",
            "vkupenPromet",
        ]

        for row in rows:
            columns = row.find_all("td")
            if columns:
                row_data = {keys[i]: col.text.strip() for i, col in enumerate(columns)}
                data.append(row_data)

        return data

async def process_issuer(sem, session, code):
    async with sem:
        last_date = check_last_data_date(code)

        current_year = datetime.now().year

        start_year = last_date.year + 1 if last_date else 2014

        for year in range(start_year, current_year + 1):
            start_date = f"01.01.{year}"
            end_date = f"31.12.{year}"

            new_data = await fetch_missing_data(session, code, start_date, end_date)
            if new_data:
                insert_data(code, new_data)



def check_last_data_date(code):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT MAX(datum) FROM stock_data WHERE code = %s;", (code,))
    last_date = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    if last_date:
        return datetime.strptime(last_date, "%Y-%m-%d %H:%M:%S")
    return None



async def main():
    create_table() 
    issuers = fetch_issuers_sync()
    sem = asyncio.Semaphore(SEM_LIMIT)

    async with aiohttp.ClientSession() as session:
        tasks = [process_issuer(sem, session, code) for code in issuers]
        await asyncio.gather(*tasks)

    print("Data fetching process completed!")

if __name__ == "__main__":
    asyncio.run(main())