import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Config } from "./config";
import { ProductTableOps } from "./operations/product-table-ops";
import { AppSyncEvent } from "./utils/types";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { TaxonomyTableOps } from "./operations/taxonomy-table-ops";

export class Builder {
    constructor(private event: AppSyncEvent, private config: Config) {

    }
    build() {

        const dynamoDbClient = new DynamoDBClient({
            region: this.config.awsRegion
        })
        const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)
        const productTableOps = new ProductTableOps(this.event.arguments, documentClient, this.config.productTableName);
        const taxonomyTableOps = new TaxonomyTableOps(this.event.arguments, documentClient, this.config.taxonomyTableName, this.config.taxonomyTableGSIName);
        return {
            productTableOps,
            taxonomyTableOps,
            fieldName: this.event.info.fieldName
        }
    }
}