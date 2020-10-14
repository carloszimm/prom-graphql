const exportSchema = url =>
  `
  type ScalarValue {
    time: Float
    value: Float!
  }

  type StringValue {
    time: Float
    value: String!
  }

  type Label {
    key: String!
    value: String!
  }

  type Metric {
    name : String!
    labels: [Label]
  }

  type Point {
    metric: Metric!
    value: ScalarValue!
  }

  type Series {
    metric: Metric!
    values: [ScalarValue]!
  }

  interface Result {
    resultType: String!
  }

  type Scalar implements Result {
    resultType: String!
    result: ScalarValue
  }

  type String implements Result {
    resultType: String!
    result: StringValue
  }

  type Vector implements Result {
    resultType: String!
    result: [Point]
  }

  type Matrix implements Result {
    resultType: String!
    result: [Series]
  }

  type Response {
    status: String!
    data: Result
    errorType: String
    error: String
    warnings: [String]
  }

  type PromGraphQl {
    query(query: String!, time: String, timeout: String): Response
    query_range(query: String!, start: String!, end: String!, step: String!, timeout: String): Response
  }

  type Query {
    prometheus${url ? '' : '(url: String!)'}: PromGraphQl
  }
`;


module.exports = exportSchema;