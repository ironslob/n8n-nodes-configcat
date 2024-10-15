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
                placeholder: 'myFeatureName',
            },
            {
                displayName: 'SDK Key',
                name: 'sdkKey',
                type: 'string',
                default: '',
                required: true,
                description: 'Feature flag name',
                placeholder: 'configcat-sdk-1/...',
            },
            // TODO add user identification
            // TODO add defaults
        ],
    };
    // The execute method will go here
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const returnData = [];
        const featureFlag = this.getNodeParameter('featureFlag', 0) as string;
        const sdkKey = this.getNodeParameter('sdkKey', 0) as string;
        const featureFlagDefault = null;
        const configCatClient = configcat.getClient(sdkKey);
        const value = await configCatClient.getValueAsync(
            featureFlag,
            featureFlagDefault,
        );
        let newItem: INodeExecutionData = {
            json: {},
        };
        newItem[featureFlag] = value;
        returnData.push(newItem);
        configCatClient.dispose();

        return [returnData];
    }
}
