const AWS = require('aws-sdk')

const docClient = new AWS.DynamoDB.DocumentClient()

const groupsTable = process.env.GROUPS_TABLE

exports.handler = async (event) => {
  console.log('Processing event: ', event)

  let limit = getQueryParameter(event, 'limit')
  let nextKey = getQueryParameter(event, 'nextKey')

  const scanParams = {
    TableName: groupsTable
  }

  if (limit != undefined) {
    scanParams['Limit'] = limit
  }
  
  if (nextKey != undefined) {
    scanParams['ExclusiveStartKey'] = JSON.parse(decodeURIComponent(nextKey))
  }
  
  console.log('Scan params: ', scanParams)

  const result = await docClient.scan(scanParams).promise()

  const items = result.Items

  console.log('Result: ', result)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items,
      nextKey: encodeNextKey(result.LastEvaluatedKey)
    })
  }
}

function getQueryParameter(event, name) {
  const queryParams = event.queryStringParameters
  if (!queryParams) {
    return undefined
  }

  return queryParams[name]
}

function encodeNextKey(lastEvaluatedKey) {
  if (!lastEvaluatedKey) {
    return null
  }

  return encodeURIComponent(JSON.stringify(lastEvaluatedKey))
}
