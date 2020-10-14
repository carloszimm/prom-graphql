const fetch = require('node-fetch'),
  { omit, transform } = require('lodash'),
  formurlencoded = require('form-urlencoded').default;

function handleJsonResponse(json) {
  if (json.data) {
    let resultType = json.data.resultType;
    switch (resultType) {
      case 'matrix':
      case 'vector':
        json.data.result.map(val => {
          val.metric = {
            name: val.metric.__name__,
            labels: transform(omit(val.metric, '__name__'), (acc, vl, k) => {
              acc.push({ key: k, value: vl });
            }, [])
          };

          if (resultType === 'vector') {
            val.value = {
              time: val.value[0],
              value: val.value[1]
            };
          } else { // matrix
            val.values.map((vl) => ({
              time: vl[0],
              value: vl[1]
            }));
          }
          return val;
        });
        break;
      default: // scalar or string
        json.data.result = {
          time: json.data.result[0],
          value: json.data.result[1]
        };
    }
  }

  return json;
}

class PromGraphql {
  constructor(url) {
    this.endpoint = `${url}/api/v1`;
  }

  async query(args) {
    let url = this.endpoint + '/query';

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formurlencoded(args, {ignorenull : true})
    });

    let json = await response.json();

    return handleJsonResponse(json);
  }

  async query_range(args) {
    let url = this.endpoint + '/query_range';

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formurlencoded(args, {ignorenull : true})
    });

    let json = await response.json();

    return handleJsonResponse(json);
  }
}

module.exports = PromGraphql;