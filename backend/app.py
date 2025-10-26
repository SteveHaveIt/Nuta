from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import subprocess
import os
import signal
import atexit

app = Flask(__name__, static_folder='public')
CORS(app)

# Start Node.js server as subprocess
node_process = None

def start_node_server():
    global node_process
    node_process = subprocess.Popen(
        ['node', 'src/server.js'],
        cwd=os.path.dirname(os.path.abspath(__file__)),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    print(f"Node.js server started with PID: {node_process.pid}")

def stop_node_server():
    global node_process
    if node_process:
        os.kill(node_process.pid, signal.SIGTERM)
        node_process.wait()
        print("Node.js server stopped")

# Start Node server when Flask starts
start_node_server()
atexit.register(stop_node_server)

@app.route('/')
def index():
    return jsonify({
        'message': 'Nuta E-commerce API',
        'version': '1.0.0',
        'endpoints': {
            'products': '/api/products',
            'orders': '/api/orders',
            'auth': '/api/auth',
            'admin': '/admin'
        }
    })

@app.route('/admin')
@app.route('/admin/')
def admin_dashboard():
    return send_from_directory('public/admin', 'index.html')

# Health check
@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
