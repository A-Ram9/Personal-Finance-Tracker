from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
import requests  # Added for communicating privately with your local Ollama engine

app = Flask(__name__)
CORS(app)

SECRET_KEY = "cyber_ultramarine_secret_key_change_in_production"

def get_db_connection():
    conn = sqlite3.connect('finance.db')
    conn.row_factory = sqlite3.Row
    return conn

# Database Initialization
def init_db():
    conn = get_db_connection()
    # Create Users table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    # Create Transactions table with user mapping
    conn.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            type TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# JWT Authentication Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            # Expected format: "Bearer <token>"
            if "Bearer " in token:
                token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user_id = data['user_id']
        except Exception as e:
            return jsonify({'error': 'Token is invalid or expired!'}), 401
        return f(current_user_id, *args, **kwargs)
    return decorated

# Authentication Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Missing credentials'}), 400
        
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    
    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 400
    finally:
        conn.close()
        
    return jsonify({'status': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()
    
    if user and check_password_hash(user['password'], password):
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        return jsonify({'token': token, 'username': user['username']}), 200
        
    return jsonify({'error': 'Invalid username or password'}), 401

# Scoped Transaction Routes
@app.route('/transactions', methods=['GET'])
@token_required
def get_transactions(current_user_id):
    conn = get_db_connection()
    transactions = conn.execute('SELECT * FROM transactions WHERE user_id = ?', (current_user_id,)).fetchall()
    conn.close()
    return jsonify([dict(row) for row in transactions])

@app.route('/transactions', methods=['POST'])
@token_required
def add_transaction(current_user_id):
    data = request.json
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO transactions (user_id, date, category, amount, type) VALUES (?, ?, ?, ?, ?)',
        (current_user_id, data['date'], data['category'], float(data['amount']), data['type'])
    )
    conn.commit()
    conn.close()
    return jsonify({"status": "success"}), 201

@app.route('/transactions/<int:id>', methods=['PUT'])
@token_required
def update_transaction(current_user_id, id):
    data = request.json
    conn = get_db_connection()
    transaction = conn.execute('SELECT * FROM transactions WHERE id = ? AND user_id = ?', (id, current_user_id)).fetchone()
    if transaction is None:
        conn.close()
        return jsonify({"error": "Transaction not found"}), 404

    conn.execute(
        'UPDATE transactions SET date = ?, category = ?, amount = ?, type = ? WHERE id = ? AND user_id = ?',
        (
            data.get('date', transaction['date']),
            data.get('category', transaction['category']),
            float(data.get('amount', transaction['amount'])),
            data.get('type', transaction['type']),
            id,
            current_user_id
        )
    )
    conn.commit()
    conn.close()
    return jsonify({"status": "updated"}), 200

@app.route('/transactions/<int:id>', methods=['DELETE'])
@token_required
def delete_transaction(current_user_id, id):
    conn = get_db_connection()
    transaction = conn.execute('SELECT * FROM transactions WHERE id = ? AND user_id = ?', (id, current_user_id)).fetchone()
    if transaction is None:
        conn.close()
        return jsonify({"error": "Transaction not found"}), 404

    conn.execute('DELETE FROM transactions WHERE id = ? AND user_id = ?', (id, current_user_id))
    conn.commit()
    conn.close()
    return jsonify({"status": "deleted"}), 200

# ==========================================
# NEW: FinGan Premium Local AI Assistant Route
# ==========================================
@app.route('/api/fingan/chat', methods=['POST'])
@token_required
def fingan_chat(current_user_id):
    data = request.json
    user_message = data.get('message', '')

    # 1. Fetch only this logged-in user's transaction history directly from SQLite securely
    conn = get_db_connection()
    transactions = conn.execute('SELECT date, category, amount, type FROM transactions WHERE user_id = ?', (current_user_id,)).fetchall()
    conn.close()

    # 2. Stringify the transaction data into a readable summary for the AI prompt context
    ledger_summary = ""
    for row in transactions:
        ledger_summary += f"- {row['date']}: {row['type'].upper()} of INR {row['amount']} under Category: {row['category']}\n"
    
    if not ledger_summary:
        ledger_summary = "No transactions recorded in the system ledger yet."

    # 3. Inject strict financial-only rules and system instructions
    system_prompt = f"""
You are FinGan, a highly advanced, completely private AI Financial Intelligence Advisor built into this tracking software. 
Your goal is to answer personal finance questions, evaluate the user's ledger spending patterns, and provide structural optimization strategies.

CRITICAL GUARDRAIL RULES:
- You are ONLY allowed to discuss financial subjects (e.g., budgets, investments, capital layout, macroeconomics, savings strategy, or ledger transactions).
- If the user asks about ANY unrelated general topic (such as coding, pop culture, sports, cooking, general jokes, history, or science), you must decline to answer. Politely state that your computational models are strictly limited to financial analytics to ensure complete system fidelity.
- Never mention OpenAI, ChatGPT, or external cloud networks. You run locally and privately.

Here is the user's authentic, live transaction data context for your analytical review:
{ledger_summary}
"""

    # 4. Package payload parameters for the local Ollama daemon service
    ollama_url = "http://localhost:11434/api/generate"
    payload = {
        "model": "llama3",
        "prompt": f"{system_prompt}\n\nUser Question: {user_message}\nFinGan Response:",
        "stream": False
    }

    try:
        # Send local loopback network request (100% off-grid)
        response = requests.post(ollama_url, json=payload, timeout=60)
        response_json = response.json()
        return jsonify({"response": response_json.get("response", "FinGan engine failed to articulate structural output.")})
    except Exception as e:
        print(f"Local AI Link Malfunction: {str(e)}")
        return jsonify({"error": "FinGan core is optimizing or offline. Ensure Ollama service is active on localhost."}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)