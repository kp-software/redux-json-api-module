interface JsonApiResourceIdentifier {
  id: string;
  type: string;
}

interface JsonApiRelationship {
  data?: JsonApiResourceIdentifier | JsonApiResourceIdentifier[] | null;
  links?: Record<string, any>;
  meta?: Record<string, any>;
}

interface JsonApiResource {
  id: string;
  type: string;
  attributes?: Record<string, any>;
  relationships?: Record<string, JsonApiRelationship>;
  links?: Record<string, any>;
  meta?: Record<string, any>;
}

interface JsonApiResponse {
  data?: JsonApiResource | JsonApiResource[];
  included?: JsonApiResource[];
}

interface NormalizedData {
  [type: string]: {
    [id: string]: any;
  };
}

function normalizeRelationships(
  relationships: Record<string, JsonApiRelationship>
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key of Object.keys(relationships)) {
    const rel = relationships[key];
    const normalized: Record<string, any> = {};

    if (rel.data !== undefined) {
      if (Array.isArray(rel.data)) {
        normalized.data = rel.data.map(r => ({ id: r.id, type: r.type }));
      } else if (rel.data === null) {
        normalized.data = null;
      } else {
        normalized.data = { id: rel.data.id, type: rel.data.type };
      }
    }

    if (rel.links) normalized.links = rel.links;
    if (rel.meta) normalized.meta = rel.meta;

    result[key] = normalized;
  }

  return result;
}

function processResources(
  resources: JsonApiResource | JsonApiResource[],
  output: NormalizedData
): void {
  const list = Array.isArray(resources) ? resources : [resources];

  for (const resource of list) {
    const { id, type } = resource;

    if (!output[type]) output[type] = {};

    const entry: Record<string, any> = { id, type };

    if (resource.attributes !== undefined) {
      entry.attributes = resource.attributes;
    }

    if (resource.relationships) {
      entry.relationships = normalizeRelationships(resource.relationships);
    }

    if (resource.links) entry.links = resource.links;
    if (resource.meta) entry.meta = resource.meta;

    output[type][id] = output[type][id]
      ? { ...output[type][id], ...entry }
      : entry;
  }
}

export default function normalize(response: JsonApiResponse): NormalizedData {
  const result: NormalizedData = {};

  if (response.data) {
    processResources(response.data, result);
  }

  if (response.included) {
    processResources(response.included, result);
  }

  return result;
}
