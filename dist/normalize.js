"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = normalize;
function normalizeRelationships(relationships) {
    const result = {};
    for (const key of Object.keys(relationships)) {
        const rel = relationships[key];
        const normalized = {};
        if (rel.data !== undefined) {
            if (Array.isArray(rel.data)) {
                normalized.data = rel.data.map(r => ({ id: r.id, type: r.type }));
            }
            else if (rel.data === null) {
                normalized.data = null;
            }
            else {
                normalized.data = { id: rel.data.id, type: rel.data.type };
            }
        }
        if (rel.links)
            normalized.links = rel.links;
        if (rel.meta)
            normalized.meta = rel.meta;
        result[key] = normalized;
    }
    return result;
}
function processResources(resources, output) {
    const list = Array.isArray(resources) ? resources : [resources];
    for (const resource of list) {
        const { id, type } = resource;
        if (!output[type])
            output[type] = {};
        const entry = { id, type };
        if (resource.attributes !== undefined) {
            entry.attributes = resource.attributes;
        }
        if (resource.relationships) {
            entry.relationships = normalizeRelationships(resource.relationships);
        }
        if (resource.links)
            entry.links = resource.links;
        if (resource.meta)
            entry.meta = resource.meta;
        output[type][id] = output[type][id]
            ? Object.assign(Object.assign({}, output[type][id]), entry) : entry;
    }
}
function normalize(response) {
    const result = {};
    if (response.data) {
        processResources(response.data, result);
    }
    if (response.included) {
        processResources(response.included, result);
    }
    return result;
}
