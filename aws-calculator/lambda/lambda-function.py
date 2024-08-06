import json
import boto3
import os
from datetime import datetime

def extract_prices(data):
    # Initialize a dictionary to store the prices per region
    prices_per_region = {}
    
    # Iterate through each item in the data
    for item in data:
        # Extract relevant information
        product = item['product']
        region = product['attributes']['location']
        sku = product['sku']
        terms = item['terms']['OnDemand']
        region_code = product['attributes']['regionCode']
        
        # Iterate through the terms to get price details
        for term_key, term_value in terms.items():
            for price_key, price_value in term_value['priceDimensions'].items():
                price = price_value['pricePerUnit']
                description = price_value['description']
                
                # Store the price and description in the dictionary
                prices_per_region[region_code] = price
    
    return prices_per_region

def lambda_handler(event, context):
    service_code = 'AmazonCloudWatch'
    pricing_client = boto3.client('pricing', region_name='us-east-1')
    
    # Filters to find CloudWatch Canaries pricing
    filters = [
        {
            "Type": "TERM_MATCH",
            "Field": "serviceCode",
            "Value": service_code
        },
        {
            "Type": "TERM_MATCH",
            "Field": "productFamily",
            "Value": "Canaries"
        }
    ]
    
    # Get the products that match the filters
    response = pricing_client.get_products(
        ServiceCode=service_code,
        Filters=filters,
        FormatVersion='aws_v1',
        MaxResults=100
    )
    
    # Extract the relevant pricing information
    price_list = []
    for price_item in response['PriceList']:
        price_item_json = json.loads(price_item)
        price_list.append(price_item_json)
    
    prices = extract_prices(price_list)
    
    # Save prices to S3
    s3_client = boto3.client('s3')
    bucket_name = os.getenv('s3_bucket') 
    file_name = f'canarycalc/prices.json'
    s3_client.put_object(
        Bucket=bucket_name,
        Key=file_name,
        Body=json.dumps(prices)
    )
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps({'message': 'Prices saved to S3', 'file': file_name})
    }

# If running locally, test the function
if __name__ == "__main__":
    result = lambda_handler({}, {})
    print(result)
