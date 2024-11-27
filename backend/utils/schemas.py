# Define the JSON schema for code analysis
CODE_ANALYSIS_SCHEMA = {
    "type": "object",
    "properties": {
        "overall_score": {
            "type": "number",
            "description": "Overall code quality score out of 10"
        },
        "code_quality": {
            "type": "number",
            "description": "Code readability and maintainability score out of 10"
        },
        "performance": {
            "type": "number",
            "description": "Code performance and efficiency score out of 10"
        },
        "suggestions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": ["improvement", "warning", "error"]
                    },
                    "message": {
                        "type": "string",
                        "description": "Detailed suggestion message"
                    }
                },
                "required": ["type", "message"]
            }
        },
        "improved_code": {
            "type": "string",
            "description": "Suggested improved version of the code"
        }
    },
    "required": ["overall_score", "code_quality", "performance", "suggestions"]
} 