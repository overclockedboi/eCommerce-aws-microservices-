import * as cdk from 'aws-cdk-lib';
import { AuthorizationType, GraphqlApi, SchemaFile } from 'aws-cdk-lib/aws-appsync';
import { BuildSpec, ComputeType, LinuxArmBuildImage, PipelineProject, Project, Source } from 'aws-cdk-lib/aws-codebuild';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CodeBuildAction, GitHubSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class EcAwsLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productTable = new Table(this, 'ProductsTable', {
      tableName: 'Products',
      partitionKey: { name: 'ProductId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST
    })
    const taxonomyTable = new Table(this, 'ProductTaxonomy', {
      tableName: 'ProductTaxonomyAttributes',
      partitionKey: { name: 'TaxonomyId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST
    })

    taxonomyTable.addGlobalSecondaryIndex(
      {
        indexName: 'ParentIndex',
        partitionKey: { name: 'ParentId', type: AttributeType.STRING },
        sortKey: { name: 'Name', type: AttributeType.STRING },
      }
    )
    const api = new GraphqlApi(this, "ECommApi", {
      name: "ECommApi",
      schema: SchemaFile.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY
        }
      },
      xrayEnabled: true
    })

    const productOpsLambda = new Function(this, 'ProductOpsLambda', {
      functionName: 'ProductOpsHandler',
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('lambda'),
      handler: 'index.handler'
    })

    const lambdaSource = api.addLambdaDataSource('LambdaSource', productOpsLambda);
    lambdaSource.createResolver('GetProduct', {
      typeName: 'Query',
      fieldName: 'getProduct'
    })
    lambdaSource.createResolver('ListProducts', {
      typeName: 'Query',
      fieldName: 'listProducts'
    })
    lambdaSource.createResolver('GetTaxonomy', {
      typeName: 'Query',
      fieldName: 'getTaxonomy'
    })
    lambdaSource.createResolver('ListTaxonomies', {
      typeName: 'Query',
      fieldName: 'listTaxonomies'
    })
    lambdaSource.createResolver('GetTaxonomiesByParent', {
      typeName: 'Query',
      fieldName: 'getTaxonomiesByParent'
    })

    lambdaSource.createResolver('CreateProduct', {
      typeName: 'Mutation',
      fieldName: 'createProduct'
    })
    lambdaSource.createResolver('UpdateProduct', {
      typeName: 'Mutation',
      fieldName: 'updateProduct'
    })
    lambdaSource.createResolver('DeleteProduct', {
      typeName: 'Mutation',
      fieldName: 'deleteProduct'
    })
    lambdaSource.createResolver('CreateTaxonomy', {
      typeName: 'Mutation',
      fieldName: 'createTaxonomy'
    })
    lambdaSource.createResolver('UpdateTaxonomy', {
      typeName: 'Mutation',
      fieldName: 'updateTaxonomy'
    })
    lambdaSource.createResolver('DeleteTaxonomy', {
      typeName: 'Mutation',
      fieldName: 'deleteTaxonomy'
    })

    productTable.grantFullAccess(productOpsLambda);
    taxonomyTable.grantFullAccess(productOpsLambda);

    //codepipline 
    const sourceOutput = new Artifact()
    const pipeline = new Pipeline(this, 'ProductMicroservicePipeline', {
      pipelineName: 'ProductMicroservicePipeline'
    })
    const sourceStage = pipeline.addStage({
      stageName: 'Source',
      actions: [
        new GitHubSourceAction({
          actionName: 'builde_service',
          owner: 'overclockedboi',
          repo: 'eCommerce-aws-microservices-',
          oauthToken: cdk.SecretValue.secretsManager('abcd'),
          output: sourceOutput
        })
      ]
    })

    const buildProject = new Project(
      this,
      'BuildService',
      {
        source: Source.gitHub({
          owner: '',
          repo: '',
          webhook: true
        }),
        environment: {
          buildImage: LinuxArmBuildImage.AMAZON_LINUX_2023_STANDARD_2_0,
          computeType: ComputeType.SMALL
        },
        buildSpec: BuildSpec.fromSourceFilename('buildspec.yml')
      }
    )

    pipeline.addStage({
      stageName: 'buildFinalService',
      actions: [
        new CodeBuildAction({
          actionName: 'Build',
          project: buildProject,
          input: sourceOutput
        })
      ]
    })


  }
}
