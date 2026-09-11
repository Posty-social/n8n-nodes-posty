import type { INodeProperties } from "n8n-workflow";

/**
 * "Return All" + "Limit" for the API's cursor pagination
 * (`starting_after` request parameter, `has_more` / `next_cursor` in the response).
 */
export function cursorPaginationProperties(
  resource: string,
  operation: string
): INodeProperties[] {
  return [
    {
      displayName: "Return All",
      name: "returnAll",
      type: "boolean",
      default: false,
      description: "Whether to return all results or only up to a given limit",
      displayOptions: {
        show: { resource: [resource], operation: [operation] },
      },
      routing: {
        send: {
          paginate: "={{ $value }}",
        },
        operations: {
          pagination: {
            type: "generic",
            properties: {
              continue: "={{ !!($response.body && $response.body.has_more) }}",
              request: {
                qs: {
                  limit: 100,
                  starting_after:
                    "={{ $response.body && $response.body.next_cursor ? $response.body.next_cursor : undefined }}",
                },
              },
            },
          },
        },
      },
    },
    {
      displayName: "Limit",
      name: "limit",
      type: "number",
      default: 50,
      typeOptions: { minValue: 1, maxValue: 100 },
      description: "Max number of results to return",
      displayOptions: {
        show: {
          resource: [resource],
          operation: [operation],
          returnAll: [false],
        },
      },
      routing: {
        send: { type: "query", property: "limit" },
        output: { maxResults: "={{ $value }}" },
      },
    },
  ];
}
