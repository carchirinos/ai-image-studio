const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: 'us-west-2' });

exports.handler = async (event) => {
    console.log('Event received:', JSON.stringify(event, null, 2));

    try {
        let imageBase64, taskType, prompt;

        if (event.body) {
            const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
            imageBase64 = body.imageBase64;
            taskType    = body.taskType || 'BACKGROUND_REMOVAL';
            prompt      = body.prompt || '';
        } else {
            throw new Error('No body provided');
        }

        if (!imageBase64) throw new Error('imageBase64 is required');

        console.log('Task type:', taskType);

        let requestBody;

        if (taskType === 'BACKGROUND_REMOVAL') {
            requestBody = {
                taskType: 'BACKGROUND_REMOVAL',
                backgroundRemovalParams: {
                    image: imageBase64
                }
            };
        } else if (taskType === 'IMAGE_VARIATION') {
            requestBody = {
                taskType: 'IMAGE_VARIATION',
                imageVariationParams: {
                    images: [imageBase64],
                    text: prompt,
                    similarityStrength: 0.7
                },
                imageGenerationConfig: {
                    numberOfImages: 1,
                    height: 512,
                    width: 512,
                    cfgScale: 8.0
                }
            };
        } else if (taskType === 'INPAINTING') {
            requestBody = {
                taskType: 'INPAINTING',
                inPaintingParams: {
                    image: imageBase64,
                    text: prompt,
                    maskPrompt: prompt
                },
                imageGenerationConfig: {
                    numberOfImages: 1,
                    height: 512,
                    width: 512,
                    cfgScale: 8.0
                }
            };
        } else {
            throw new Error('Invalid taskType: ' + taskType);
        }

        const command = new InvokeModelCommand({
            modelId: 'amazon.titan-image-generator-v2:0',
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify(requestBody)
        });

        console.log('Invoking Bedrock...');
        const response = await client.send(command);

        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const resultBase64 = responseBody.images[0];

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({
                success: true,
                imageBase64: resultBase64,
                taskType: taskType
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};