import { DeleteCommand, DynamoDBDocumentClient, QueryCommand, ScanCommand, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

type Taxonomy = {
    TaxonomyId?: string,
    Name?: string,
    Description?: string,
    ParentId?: string,
    Type?: string
}

export class TaxonomyTableOps {
    constructor(private taxonomy: Taxonomy, private dynamoDb: DynamoDBDocumentClient, private tableName: string, private gsiName: string) {

    }


    async getTaxonomy() {
        /**
         * Fetch the taxonomy from db using keys {}
         * 
         * @returns The fetched keys or null
         */
        try {
            const command = new GetCommand({
                TableName: this.tableName,
                Key: { ...this.taxonomy }
            });
            const results = await this.dynamoDb.send(command);
            return results.Item || null
        } catch (error) {
            console.error('error ', error)
            return null
        }

    }

    async createTaxonomy() {
        /**
         * Create the taxonomy in db using keys {}
         * 
         * @returns The modified taxonomy
         */
        try {
            const modifiedTaxonomy = {
                TaxonomyId: randomUUID(),
                ...this.taxonomy,
            }
            const command = new PutCommand({
                TableName: this.tableName,
                Item: modifiedTaxonomy
            });
            await this.dynamoDb.send(command);
            return modifiedTaxonomy || null
        } catch (error) {
            console.error('error ', error)
            return null
        }

    }

    async updateTaxonomy() {
        /**
         * Update the taxonomy in db using keys {}
         * 
         * @returns The modified taxonomy attributes
         */
        try {

            const command = new UpdateCommand({
                TableName: this.tableName,
                Key: { TaxonomyId: this.taxonomy.TaxonomyId },
                UpdateExpression: 'SET #name=  :name, #description= :description,#parentId= :parentId,#type= :type',
                ExpressionAttributeNames: {
                    '#name': 'Name',
                    '#description': 'Description',
                    '#parentId': 'ParentId',
                    '#type': 'Type',
                },
                ExpressionAttributeValues: {
                    ':name': this.taxonomy.Name,
                    ':description': this.taxonomy.Description,
                    ':parentId': this.taxonomy.ParentId,
                    ':type': this.taxonomy.Type
                },
                ReturnValues: 'ALL_NEW'
            });
            const response = await this.dynamoDb.send(command);
            return response.Attributes || null
        } catch (error) {
            console.error('error ', error)
            return null
        }

    }

    async deleteTaxonomy() {
        /**
         * delete the taxonomy in db using keys {}
         * 
         * @returns {boolean} if deleted boolean
         */
        try {

            const command = new DeleteCommand({
                TableName: this.tableName,
                Key: { TaxonomyId: this.taxonomy.TaxonomyId }
            });
            await this.dynamoDb.send(command);
            return true || null
        } catch (error) {
            console.error('error ', error)
            return null
        }

    }

    async listTaxonomies() {
        /**
         * List the taxonomys in db
         * 
         * @returns list of taxonomys
         */
        try {

            const command = new ScanCommand({
                TableName: this.tableName
            });
            const response = await this.dynamoDb.send(command);
            return response || []
        } catch (error) {
            console.error('error ', error)
            return []
        }

    }

    async getTaxonomiesByParent() {
        try {

            const command = new QueryCommand({
                TableName: this.tableName,
                IndexName: this.gsiName,
                KeyConditionExpression: 'ParentID= :parentID',
                ExpressionAttributeValues: {
                    ':parentID': this.taxonomy.ParentId
                },
                ScanIndexForward: true
            });
            const response = await this.dynamoDb.send(command)
            return response || []
        } catch (error) {
            console.error('error ', error)
            return null
        }

    }
}