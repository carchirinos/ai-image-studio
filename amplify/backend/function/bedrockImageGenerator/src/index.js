// Importar AWS SDK v3
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

// Configurar cliente Bedrock
const client = new BedrockRuntimeClient({
    region: 'us-west-2'
});

exports.handler = async (event) => {
    console.log('Event received:', JSON.stringify(event, null, 2));
    
    try {
        // Extraer el prompt del evento
        let prompt;
        
        if (event.body) {
            const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
            prompt = body.prompt;
        } else if (event.prompt) {
            prompt = event.prompt;
        } else {
            throw new Error('No prompt provided');
        }
        
        if (!prompt) {
            throw new Error('Prompt is required');
        }
        
        console.log('Generating image for prompt:', prompt);
        
        // Configuración para Amazon Titan Image Generator
        const modelId = "amazon.titan-image-generator-v2:0";
        
        const requestBody = {
            "taskType": "TEXT_IMAGE",
            "textToImageParams": {
                "text": prompt
            },
            "imageGenerationConfig": {
                "numberOfImages": 1,
                "height": 512,
                "width": 512,
                "cfgScale": 8.0,
                "seed": Math.floor(Math.random() * 1000000)
            }
        };
        
        const command = new InvokeModelCommand({
            modelId: modelId,
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify(requestBody)
        });
        
        console.log('Invoking Bedrock with command:', JSON.stringify(command.input, null, 2));
        
        // Llamar a Bedrock
        const response = await client.send(command);
        
        console.log('Bedrock response received');
        
        // Procesar la respuesta
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        console.log('Response body:', JSON.stringify(responseBody, null, 2));
        
        // Extraer la imagen base64
        const imageBase64 = responseBody.images[0];
        
        // Respuesta exitosa
        const result = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({
                success: true,
                message: 'Image generated successfully with Amazon Titan',
                imageBase64: imageBase64,
                prompt: prompt,
                model: modelId
            })
        };
        
        console.log('Returning success response');
        return result;
        
    } catch (error) {
        console.error('Error generating image:', error);
        
        // Respuesta de error
        const errorResponse = {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({
                success: false,
                error: error.message,
                details: error.stack,
                type: error.name || 'UnknownError'
            })
        };
        
        return errorResponse;
    }
};
