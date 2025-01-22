import * as lambda from 'aws-cdk-lib/aws-lambda-event-sources'
import { AppSyncEvent } from './utils/types'
import { Builder } from './builder'
import { config } from 'process'
import { Config } from './config'



export async function handler(event: AppSyncEvent) {

    try {

        const config = new Config().load()

        const { fieldName, productTableOps, taxonomyTableOps } = new Builder(event, config).build()
        switch (fieldName) {
            case "getProduct":
                return await productTableOps.getProduct();
            case "createProduct":
                return await productTableOps.createProduct();
            case "deleteProduct":
                return await productTableOps.deleteProduct();
            case "listProducts":
                return await productTableOps.listProducts();
            case "updateProduct":
                return await productTableOps.updateProduct();
            case "getTaxonomy":
                return await taxonomyTableOps.getTaxonomy();
            case "createTaxonomy":
                return await taxonomyTableOps.createTaxonomy();
            case "deleteTaxonomy":
                return await taxonomyTableOps.deleteTaxonomy();
            case "listTaxonomies":
                return await taxonomyTableOps.listTaxonomies();
            case "getTaxonomiesByParent":
                return await taxonomyTableOps.getTaxonomiesByParent();
            case "updateTaxonomy":
                return await taxonomyTableOps.updateTaxonomy();
        }

        return null
    } catch (error) {
        return {
            status: 500
        }
    }
}