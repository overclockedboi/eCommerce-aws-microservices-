export class Config {
    awsRegion: string;
    productTableName: string;
    taxonomyTableName: string;
    taxonomyTableGSIName: string;
    load() {
        this.awsRegion = process.env.REGION ?? '';
        this.productTableName = process.env.PRODUCT_TABLE_NAME ?? 'Products';
        this.taxonomyTableName = process.env.TAXONOMY_TABLE_NAME ?? 'ProductTaxonomyAttributes';
        this.taxonomyTableGSIName = process.env.TAXONOMY_TABLE_GSI_NAME ?? 'ParentIndex';
        return this
    }
}