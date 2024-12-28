from flask import Flask, request, jsonify
import pandas as pd
from sqlalchemy import create_engine
import ta
import numpy as np

app = Flask(__name__)

engine = create_engine('postgresql://postgres:postgres@localhost:5433/DIANS')

@app.route('/analyze-stock', methods=['GET'])
def analyze_stock():
    stock_code = request.args.get('code')
    limit = request.args.get('limit')
    if not stock_code:
        return jsonify({"error": "Stock code is required"}), 400

    query = f"SELECT * FROM stock_data WHERE code = '{stock_code}' ORDER BY datum DESC LIMIT {limit}"
    data = pd.read_sql(query, engine)

    if data.empty:
        return jsonify({"error": "No data found for the stock code"}), 404

    data['datum'] = pd.to_datetime(data['datum'])
    data['posledna_transakcija'] = pd.to_numeric(
        data['posledna_transakcija']
        .str.replace('.', '', regex=False) 
        .str.replace(',', '.', regex=False),
        errors='coerce'
    )

    data['high'] = data['posledna_transakcija'] * 1.05
    data['low'] = data['posledna_transakcija'] * 0.95 

    data['RSI'] = ta.momentum.RSIIndicator(close=data['posledna_transakcija'], window=14).rsi()
    data['MACD'] = ta.trend.MACD(close=data['posledna_transakcija']).macd()
    data['CCI'] = ta.trend.CCIIndicator(high=data['high'], low=data['low'], close=data['posledna_transakcija'], window=20).cci()

    data['SMA_10'] = data['posledna_transakcija'].rolling(window=10).mean()
    data['EMA_10'] = data['posledna_transakcija'].ewm(span=10, adjust=False).mean()
    data['WMA_10'] = ta.trend.WMAIndicator(close=data['posledna_transakcija'], window=10).wma()
    data['EMA_20'] = ta.trend.EMAIndicator(close=data['posledna_transakcija'], window=20).ema_indicator()

    data['EMA_10'] = data['EMA_10'].apply(lambda x: 0 if np.isnan(x) else x)
    data['EMA_20'] = data['EMA_20'].apply(lambda x: 0 if np.isnan(x) else x)
    data['MACD'] = data['MACD'].apply(lambda x: 0 if np.isnan(x) else x)
    data['SMA_10'] = data['SMA_10'].apply(lambda x: 0 if np.isnan(x) else x)
    data['WMA_10'] = data['WMA_10'].apply(lambda x: 0 if np.isnan(x) else x)
    data['RSI'] = data['RSI'].apply(lambda x: 0 if np.isnan(x) else x)
    data['CCI'] = data['CCI'].apply(lambda x: 0 if np.isnan(x) else x)

    ema1 = data['posledna_transakcija'].ewm(span=10, adjust=False).mean()
    ema2 = ema1.ewm(span=10, adjust=False).mean()
    ema3 = ema2.ewm(span=10, adjust=False).mean()
    data['TEMA'] = (3 * ema1) - (3 * ema2) + ema3

    numeric_cols = ['posledna_transakcija', 'RSI', 'MACD', 'CCI', 'SMA_10', 'EMA_10', 'WMA_10', 'EMA_20', 'TEMA']
    data[numeric_cols] = data[numeric_cols].round(2)

    data = data.replace([np.inf, -np.inf], np.nan)
    data = data.where(data.notna(), None)

    def calculate_signal(row):
        if row['RSI'] < 30:
            return 'Buy'
        elif row['RSI'] > 70:
            return 'Sell'

        if row['MACD'] > 0:
            return 'Buy'
        elif row['MACD'] < 0:
            return 'Sell'

        if row['CCI'] < -100:
            return 'Buy'
        elif row['CCI'] > 100:
            return 'Sell'

        if row['SMA_10'] > row['EMA_10']:
            return 'Buy'
        elif row['SMA_10'] < row['EMA_10']:
            return 'Sell'

        return 'Hold'

    data['signal'] = data.apply(calculate_signal, axis=1)

    response = data[['datum', 'posledna_transakcija', 'RSI', 'MACD', 'CCI', 'SMA_10', 'EMA_10', 'WMA_10', 'EMA_20', 'TEMA', 'signal']].to_dict(orient='records')

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)