import { describe, it, expect } from 'vitest';
import normalize from '../normalize';

describe('normalize', () => {
  describe('basic data processing', () => {
    it('returns empty object for empty response', () => {
      expect(normalize({})).toEqual({});
    });

    it('returns empty object when data is undefined', () => {
      expect(normalize({ data: undefined })).toEqual({});
    });

    it('normalizes a single resource', () => {
      const response = {
        data: { id: '1', type: 'articles', attributes: { title: 'Hello' } },
      };

      expect(normalize(response)).toEqual({
        articles: {
          '1': { id: '1', type: 'articles', attributes: { title: 'Hello' } },
        },
      });
    });

    it('normalizes an array of resources', () => {
      const response = {
        data: [
          { id: '1', type: 'articles', attributes: { title: 'A' } },
          { id: '2', type: 'articles', attributes: { title: 'B' } },
        ],
      };

      const result = normalize(response);
      expect(result.articles['1'].attributes.title).toBe('A');
      expect(result.articles['2'].attributes.title).toBe('B');
    });

    it('normalizes resources of different types', () => {
      const response = {
        data: [
          { id: '1', type: 'articles', attributes: { title: 'A' } },
          { id: '2', type: 'people', attributes: { name: 'Dan' } },
        ],
      };

      const result = normalize(response);
      expect(result.articles['1']).toBeDefined();
      expect(result.people['2']).toBeDefined();
    });

    it('includes only id and type when optional fields are absent', () => {
      const response = {
        data: { id: '5', type: 'tags' },
      };

      const result = normalize(response);
      expect(result.tags['5']).toEqual({ id: '5', type: 'tags' });
      expect(result.tags['5']).not.toHaveProperty('attributes');
      expect(result.tags['5']).not.toHaveProperty('relationships');
      expect(result.tags['5']).not.toHaveProperty('links');
      expect(result.tags['5']).not.toHaveProperty('meta');
    });
  });

  describe('included resources', () => {
    it('processes included resources into separate type buckets', () => {
      const response = {
        data: { id: '1', type: 'articles', attributes: { title: 'X' } },
        included: [
          { id: '10', type: 'people', attributes: { name: 'Dan' } },
        ],
      };

      const result = normalize(response);
      expect(result.articles['1']).toBeDefined();
      expect(result.people['10'].attributes.name).toBe('Dan');
    });

    it('merges duplicate type+id from data and included', () => {
      const response = {
        data: { id: '1', type: 'articles', attributes: { title: 'X' } },
        included: [
          {
            id: '1',
            type: 'articles',
            relationships: {
              author: { data: { id: '2', type: 'people' } },
            },
          },
        ],
      };

      const result = normalize(response);
      const article = result.articles['1'];
      expect(article.attributes).toBeDefined();
      expect(article.relationships).toBeDefined();
    });

    it('later entry overwrites earlier on conflicting keys', () => {
      const response = {
        data: { id: '1', type: 'articles', attributes: { title: 'Original' } },
        included: [
          { id: '1', type: 'articles', attributes: { title: 'Overwritten' } },
        ],
      };

      const result = normalize(response);
      expect(result.articles['1'].attributes.title).toBe('Overwritten');
    });
  });

  describe('relationships', () => {
    it('normalizes a single-object relationship', () => {
      const response = {
        data: {
          id: '1',
          type: 'articles',
          relationships: {
            author: { data: { id: '2', type: 'people' } },
          },
        },
      };

      const result = normalize(response);
      expect(result.articles['1'].relationships.author.data).toEqual({
        id: '2',
        type: 'people',
      });
    });

    it('normalizes an array relationship', () => {
      const response = {
        data: {
          id: '1',
          type: 'articles',
          relationships: {
            tags: {
              data: [
                { id: '1', type: 'tags' },
                { id: '2', type: 'tags' },
              ],
            },
          },
        },
      };

      const result = normalize(response);
      expect(result.articles['1'].relationships.tags.data).toEqual([
        { id: '1', type: 'tags' },
        { id: '2', type: 'tags' },
      ]);
    });

    it('normalizes a null relationship', () => {
      const response = {
        data: {
          id: '1',
          type: 'articles',
          relationships: {
            author: { data: null },
          },
        },
      };

      const result = normalize(response);
      expect(result.articles['1'].relationships.author.data).toBeNull();
    });

    it('handles relationship with no data key (only links)', () => {
      const response = {
        data: {
          id: '1',
          type: 'articles',
          relationships: {
            author: { links: { related: '/articles/1/author' } },
          },
        },
      };

      const result = normalize(response);
      const authorRel = result.articles['1'].relationships.author;
      expect(authorRel).not.toHaveProperty('data');
      expect(authorRel.links).toEqual({ related: '/articles/1/author' });
    });

    it('preserves relationship links', () => {
      const response = {
        data: {
          id: '1',
          type: 'articles',
          relationships: {
            author: {
              data: { id: '2', type: 'people' },
              links: { self: '/articles/1/relationships/author' },
            },
          },
        },
      };

      const result = normalize(response);
      expect(result.articles['1'].relationships.author.links).toEqual({
        self: '/articles/1/relationships/author',
      });
    });

    it('preserves relationship meta', () => {
      const response = {
        data: {
          id: '1',
          type: 'articles',
          relationships: {
            tags: { data: null, meta: { count: 0 } },
          },
        },
      };

      const result = normalize(response);
      expect(result.articles['1'].relationships.tags.meta).toEqual({ count: 0 });
    });

    it('strips extra fields from relationship data identifiers', () => {
      const response = {
        data: {
          id: '1',
          type: 'articles',
          relationships: {
            author: {
              data: { id: '2', type: 'people', attributes: { name: 'extra' } } as any,
            },
          },
        },
      };

      const result = normalize(response);
      const authorData = result.articles['1'].relationships.author.data;
      expect(authorData).toEqual({ id: '2', type: 'people' });
      expect(authorData).not.toHaveProperty('attributes');
    });
  });

  describe('resource optional fields', () => {
    it('preserves resource-level links', () => {
      const response = {
        data: { id: '1', type: 'articles', links: { self: '/articles/1' } },
      };

      const result = normalize(response);
      expect(result.articles['1'].links).toEqual({ self: '/articles/1' });
    });

    it('preserves resource-level meta', () => {
      const response = {
        data: { id: '1', type: 'articles', meta: { created: true } },
      };

      const result = normalize(response);
      expect(result.articles['1'].meta).toEqual({ created: true });
    });
  });
});
