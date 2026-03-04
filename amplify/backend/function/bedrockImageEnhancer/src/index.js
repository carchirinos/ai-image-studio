const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: 'us-west-2' });

exports.handler = async (event) => {
    console.log('Event received:', JSON.stringify(event, null, 2));

    try {
        let imageBase64, taskType, prompt, maskPrompt;

        if (event.body) {
            const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
            imageBase64 = body.imageBase64;
            taskType    = body.taskType || 'BACKGROUND_REMOVAL';
            prompt      = body.prompt || '';
            maskPrompt  = body.maskPrompt || prompt;
        } else {
            throw new Error('No body provided');
        }

        if (!imageBase64) throw new Error('imageBase64 is required');

        console.log('Task type:', taskType);

        let resultBase64;

        if (taskType === 'BACKGROUND_REMOVAL') {

            const requestBody = {
                taskType: 'BACKGROUND_REMOVAL',
                backgroundRemovalParams: {
                    image: imageBase64
                }
            };

            const command = new InvokeModelCommand({
                modelId: 'amazon.titan-image-generator-v2:0',
                contentType: 'application/json',
                accept: 'application/json',
                body: JSON.stringify(requestBody)
            });

            const response = await client.send(command);
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            resultBase64 = responseBody.images[0];

        } else if (taskType === 'IMAGE_VARIATION') {

            const requestBody = {
                taskType: 'IMAGE_VARIATION',
                imageVariationParams: {
                    images: [imageBase64],
                    text: prompt,
                    similarityStrength: 0.6
                },
                imageGenerationConfig: {
                    numberOfImages: 1,
                    height: 512,
                    width: 512,
                    cfgScale: 8.0
                }
            };

            const command = new InvokeModelCommand({
                modelId: 'amazon.titan-image-generator-v2:0',
                contentType: 'application/json',
                accept: 'application/json',
                body: JSON.stringify(requestBody)
            });

            const response = await client.send(command);
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            resultBase64 = responseBody.images[0];

        } else if (taskType === 'INPAINTING') {

            const requestBody = {
                taskType: 'INPAINTING',
                inPaintingParams: {
                    image: imageBase64,
                    text: prompt,
                    maskPrompt: maskPrompt
                },
                imageGenerationConfig: {
                    numberOfImages: 1,
                    height: 512,
                    width: 512,
                    cfgScale: 8.0
                }
            };

            const command = new InvokeModelCommand({
                modelId: 'amazon.titan-image-generator-v2:0',
                contentType: 'application/json',
                accept: 'application/json',
                body: JSON.stringify(requestBody)
            });

            const response = await client.send(command);
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            resultBase64 = responseBody.images[0];

}  else if (taskType === 'AI_TRANSFORMATION') {

    const requestBody = {
        taskType: 'IMAGE_VARIATION',
        imageVariationParams: {
            images: [imageBase64],
            text: prompt,
            similarityStrength: 0.3
        },
        imageGenerationConfig: {
            numberOfImages: 1,
            height: 512,
            width: 512,
            cfgScale: 8.0
        }
    };

    const command = new InvokeModelCommand({
        modelId: 'amazon.titan-image-generator-v2:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(requestBody)
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    resultBase64 = responseBody.images[0];
} else {
            throw new Error('Invalid taskType: ' + taskType);
        }

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