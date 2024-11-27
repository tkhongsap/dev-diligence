def get_root_html():
    return """
    <html>
        <head>
            <title>Code Review API</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    background-color: #f5f5f5;
                    border-radius: 8px;
                    padding: 20px;
                    margin-top: 20px;
                }
                code {
                    background-color: #e0e0e0;
                    padding: 2px 4px;
                    border-radius: 4px;
                }
                .endpoints {
                    margin-top: 20px;
                }
                .endpoint {
                    background-color: white;
                    padding: 10px;
                    margin: 10px 0;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            <h1>Code Review API</h1>
            <div class="container">
                <p>✅ Backend is running correctly!</p>
                <p>The following resources are available:</p>
                <div class="endpoints">
                    <div class="endpoint">
                        <strong>API Documentation:</strong> 
                        <a href="/docs">/docs</a> (Swagger UI)
                    </div>
                    <div class="endpoint">
                        <strong>Alternative API Documentation:</strong> 
                        <a href="/redoc">/redoc</a> (ReDoc)
                    </div>
                    <div class="endpoint">
                        <strong>Code Analysis Endpoint:</strong> 
                        <code>POST /analyze-code/</code>
                    </div>
                </div>
            </div>
            <div class="container">
                <h2>Quick Start</h2>
                <p>To analyze code, send a POST request to <code>/analyze-code/</code> with either:</p>
                <ul>
                    <li>A file upload (key: <code>file</code>)</li>
                    <li>Direct code input (key: <code>code</code>)</li>
                </ul>
                <p>The API will return a JSON response with:</p>
                <ul>
                    <li>Overall score</li>
                    <li>Code quality score</li>
                    <li>Performance score</li>
                    <li>Suggestions for improvement</li>
                </ul>
            </div>
        </body>
    </html>
    """ 