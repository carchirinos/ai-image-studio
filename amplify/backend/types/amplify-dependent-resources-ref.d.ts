export type AmplifyDependentResourcesAttributes = {
  "api": {
    "enhanceImageApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "imageGeneratorAPI": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "auth": {
    "aiimagestudio661432df": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "bedrockChatbot": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "bedrockImageEnhancer": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "bedrockImageGenerator": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "predictions": {
    "AITextInterpreter": {
      "region": "string",
      "type": "string"
    },
    "imageAnalyzer": {
      "celebrityDetectionEnabled": "string",
      "maxEntities": "string",
      "region": "string"
    }
  },
  "storage": {
    "imageStorage": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}