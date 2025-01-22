This microservice will be used in the AWS Amplify hosted eCommerce application. This application should support high traffic & high performance. This assignment assumes that the candidate has an AWS account set up. Prerequisites: Product Data Model in DynamoDB Table Name: Products 

ProductId : Unique identifier for each product. 
Name : Name of the product. 
Description : A detailed description of the product. 
Price : The price of the product. 
Category : Category to which the product belongs. 
Stock : Inventory count. 
CreatedAt : Timestamp when the product was added. 
UpdatedAt : Timestamp of the last update to the product. 


Primary Key: Partition Key: ProductId Table Name: ProductTaxonomyAttributes 
TaxonomyId : A unique identifier for each category or tag. 
Name : The name of the category or tag. 
Description : A brief description of the category or tag. 
ParentId : An identifier linking to the parent category for hierarchical structures. For top-level categories, this could be null or a specific value like "root". 
Type : Distinguishes between different types of taxonomy, such as 'category' or 'tag'. 

Primary Key: Partition Key: TaxonomyId Secondary Indexes: Global Secondary Index - ParentIndex: Partition Key: ParentId Sort Key: Name Tasks Microservice Development Develop a microservice using Node.js to manage product information such as creating, retrieving, updating, and deleting products. Ensure interaction with DynamoDB database for storage. Make assumptions to include the input & output Integration with AWS Lambda & AWS AppSync AWS Lambda Integration: Package Node.js application into AWS Lambda functions. Configure Lambda functions to handle requests and connect with DynamoDB. AWS AppSync Integration: Set up an AWS AppSync GraphQL API for the frontend to interact with the backend services seamlessly. Deployment strategy Configure AWS CodePipeline to automate the build, test, and deployment processes. Use AWS CodeBuild to execute build specifications and run tests every time the code is updated in the repository. Deliverables Source Code Repositories: Provide URLs to the GitHub repositories for each service Diagrams are welcome. Keep explanations clear and concise. Submission (email back screen recording videos either as attachments or as video links, this app does not allow screen recordings) Please submit your response in a single PDF document that includes a code repository link A short video demo Clearly label each section and ensure explanations are well-defined and concise.