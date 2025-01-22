import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { float } from "aws-sdk/clients/cloudfront";
import { randomUUID } from "crypto";

type Product = {
    ProductId?: string,
    Name?: string,
    Description?: string,
    Price?: float,
    Category?: string,
    Stock?: number,
    CreatedAt?: string,
    UpdatedAt?: string,
}

export class ProductTableOps {
    constructor(private product: Product, private dynamoDb: DynamoDBDocumentClient, private tableName: string) {

    }


    async getProduct() {
        /**
         * Fetch the product from db using keys {}
         * 
         * @returns The fetched keys or null
         */
        try {
            const command = new GetCommand({
                TableName: this.tableName,
                Key: { ...this.product }
            });
            const results = await this.dynamoDb.send(command);
            return results.Item || null
        } catch (error) {
            console.error('error ', error)
            return null
        }

    }

    async createProduct() {
        /**
         * Create the product in db using keys {}
         * 
         * @returns The modified product
         */
        try {
            const currentDate = new Date().toISOString()
            const modifiedProduct = {
                ProductId: randomUUID(),
                ...this.product,
                CreatedAt: currentDate,
                UpdatedAt: currentDate
            }
            const command = new PutCommand({
                TableName: this.tableName,
                Item: modifiedProduct
            });
            await this.dynamoDb.send(command);
            return modifiedProduct || null
        } catch (error) {
            console.error('error ', error)
            return null
        }

    }

    async updateProduct() {
        /**
         * Update the product in db using keys {}
         * 
         * @returns The modified product attributes
         */
        try {

            const command = new UpdateCommand({
                TableName: this.tableName,
                Key: { ProductId: this.product.ProductId },
                UpdateExpression: 'SET #name=  :name, #description= :description,#price= :price,#category= :category, #stock: stock, #updatedAt= :updatedAt',
                ExpressionAttributeNames: {
                    '#name': 'Name',
                    '#description': 'Description',
                    '#price': 'Price',
                    '#category': 'Category',
                    '#stock': 'Stock',
                    '#updatedAt': 'UpdatedAt'
                },
                ExpressionAttributeValues: {
                    ':name': this.product.Name,
                    ':description': this.product.Description,
                    ':price': this.product.Price,
                    ':category': this.product.Category,
                    ':stock': this.product.Stock,
                    ':updatedAt': this.product.UpdatedAt
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

    async deleteProduct() {
        /**
         * delete the product in db using keys {}
         * 
         * @returns {boolean} if deleted boolean
         */
        try {

            const command = new DeleteCommand({
                TableName: this.tableName,
                Key: { ProductId: this.product.ProductId }
            });
            await this.dynamoDb.send(command);
            return true || null
        } catch (error) {
            console.error('error ', error)
            return null
        }

    }

    async listProducts() {
        /**
         * List the products in db
         * 
         * @returns list of products
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
}