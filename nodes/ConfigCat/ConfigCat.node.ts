import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

const configcat = require('configcat-node');

export class ConfigCat implements INodeType {
    description: INodeTypeDescription = {
        // basic node details will go here
        displayName: 'configcat',
        name: 'configcat',
        icon: 'file:configcat.svg',
        group: ['transform'],
        version: 1,
        description: 'configcat feature flags',
        defaults: {
            name: 'configcat',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'configCatSdk',
                required: true,
            },
        ],
        properties: [
            // resources and operations will go here
            {
                displayName: 'Feature Flag',
                name: 'featureFlag',
                type: 'string',
                default: '',
                required: true,
                description: 'Feature flag name',
            },
            {
                displayName: 'SDK Key',
                name: 'sdkKey',
                type: 'string',
                default: '',
                required: true,
                description: 'Feature flag name',
            },
            // TODO add user identification
        ],
    };
    // The execute method will go here
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const returnData = [];
        const featureFlag = this.getNodeParameter('featureFlag', 0) as string;
        const featureFlagDefault = true;
        const configCatClient = configcat.getClient('#YOUR-SDK-KEY#');
        const value = await configCatClient.getValueAsync(
            featureFlag,
            featureFlagDefault,
        );
        returnData.push(value);
        configCatClient.dispose();

        return [this.helpers.returnJsonArray(returnData)];
    }
}
