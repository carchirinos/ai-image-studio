const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: 'us-west-2' });

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: JSON.stringify({}) };
    }

    try {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { messages, systemPrompt } = body;

        if (!messages || messages.length === 0) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Messages are required' }) };
        }

        const requestBody = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 1024,
            system: systemPrompt || "You are a helpful AI assistant for AI Image Studio Pro. Help users with image generation, enhancement, recognition, and text extraction.",
            messages: messages
        };

        const command = new InvokeModelCommand({
            modelId: "anthropic.claude-3-haiku-20240307-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(requestBody)
        });

        const response = await client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: responseBody.content[0].text,
                usage: responseBody.usage
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: error.message, type: error.name })
        };
    }
};
