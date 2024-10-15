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
        displayName: 'ConfigCat',
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
                placeholder: 'configcat-sdk-3/...',
            },
            {
                displayName: 'Default value must reflect the type of feature flag, but can be whatever parse as JSON (false, 4, foo, [1,2,3], etc.)',
                name: 'notice',
                type: 'notice',
                default: '',
            },
            {
                displayName: 'Default',
                name: 'default',
                type: 'json',
                default: 'false',
                description: 'Default value',
            },
            {
                displayName: 'Targeting rules are described here - https://configcat.com/docs/targeting/targeting-overview/',
                name: 'notice',
                type: 'notice',
                default: '',
            },
            {
                displayName: 'User ID',
                name: 'userIdentifier',
                type: 'string',
                description: 'Unique user ID',
                placeholder: '',
                default: '',
            },
            {
                displayName: 'User Email',
                name: 'userEmail',
                type: 'string',
                description: 'User email address',
                placeholder: '',
                default: '',
            },
            {
                displayName: 'User Country',
                name: 'userCountry',
                type: 'string',
                placeholder: '',
                default: '',
            },
        ],
    };
    // The execute method will go here
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const returnData = [];
        const featureFlag = this.getNodeParameter('featureFlag', 0) as string;
        const sdkKey = this.getNodeParameter('sdkKey', 0) as string;
        const featureFlagDefault = this.getNodeParameter('default', 0) as string;
        const userIdentifier = this.getNodeParameter('userIdentifier', 0) as string;
        let userObject = null;

        if (userIdentifier) {
            const userEmail = this.getNodeParameter('userEmail', 0) as string;
            const userCountry = this.getNodeParameter('userCountry', 0) as string;
            userObject = new configcat.User(
                userIdentifier,
                userEmail,
                userCountry,
            );
        }

        const configCatClient = configcat.getClient(sdkKey);
        const value = await configCatClient.getValueAsync(
            featureFlag,
            JSON.parse(featureFlagDefault),
            userObject,
        );
        let newItem: INodeExecutionData = {
            json: {},
        };
        newItem.json[featureFlag] = value;
        returnData.push(newItem);
        configCatClient.dispose();

        return [returnData];
    }
}
