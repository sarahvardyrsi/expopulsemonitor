/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPulseRead = /* GraphQL */ `
  query GetPulseRead($id: ID!) {
    getPulseRead(id: $id) {
      id
      name
      data
      createdAt
      updatedAt
    }
  }
`;
export const listPulseReads = /* GraphQL */ `
  query ListPulseReads(
    $filter: ModelPulseReadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPulseReads(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        data
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
