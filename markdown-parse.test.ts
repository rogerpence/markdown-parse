// sum.test.js
import { expect, test } from 'vitest'
import {parseMarkdownFile, getMarkdownObject} from './markdown-parse.ts';
import { z } from 'zod';

const BlogFrontMatterSchema = z.object({
    title: z.string().min(1, 'Title cannot be empty'),
    description: z.string().min(1, 'Description cannot be empty'),
    tags: z.array(z.string()).min(1, 'At least one tag is required'),
    date_published: z.coerce.date().max(new Date(), 'Date cannot be in the future'),
    date_added: z.coerce.date(),
    date_updated: z.coerce.date(),
    pinned: z.boolean(),
    author: z.string().optional()
  }).strict();
  
type BlogPost = z.infer<typeof BlogFrontMatterSchema>;


test('all values exception optional values', () => {
    const frontMatter = []
    frontMatter.push("title: Demo page for css")
    frontMatter.push("description: Astro notes")
    frontMatter.push("tags:")
    frontMatter.push("  - astro")
    frontMatter.push("  - powershell")
    frontMatter.push("  - cs")
    frontMatter.push("date_published: 2023-04-16")
    frontMatter.push("date_added: 2023-04-16")
    frontMatter.push("date_updated: 2023-04-16")
    frontMatter.push("pinned: false")

    const content : string[] = []
    
    const result = getMarkdownObject<BlogPost>(frontMatter, content, BlogFrontMatterSchema);    

    expect(result.success).toBe(true)
})

test('all values with optoinal value', () => {
    const frontMatter = []
    frontMatter.push("title: Demo page for css")
    frontMatter.push("description: Astro notes")
    frontMatter.push("tags:")
    frontMatter.push("  - astro")
    frontMatter.push("  - powershell")
    frontMatter.push("  - cs")
    frontMatter.push("date_published: 2023-04-16")
    frontMatter.push("date_added: 2023-04-16")
    frontMatter.push("date_updated: 2023-04-16")
    frontMatter.push("pinned: false")
    frontMatter.push("author: Brian Kernighan")

    const content : string[] = []
    
    const result = getMarkdownObject<BlogPost>(frontMatter, content, BlogFrontMatterSchema);    

    expect(result.success).toBe(true)
})

test('missing tags property', () => {
    const frontMatter = []
    frontMatter.push("title: Demo page for css")
    frontMatter.push("description: Astro notes")
    frontMatter.push("date_published: 2023-04-16")
    frontMatter.push("date_added: 2023-04-16")
    frontMatter.push("date_updated: 2023-04-16")
    frontMatter.push("pinned: false")
    
    const content : string[] = []
    
    const result = getMarkdownObject<BlogPost>(frontMatter, content, BlogFrontMatterSchema);    
    expect(result.success).toBe(false)
    console.log(result.error)
})

test('wrong tags type', () => {
    const frontMatter = []
    frontMatter.push("title: 34")
    frontMatter.push("description: Astro notes")
    frontMatter.push("tags: astro")
    frontMatter.push("date_published: 2023-04-16")
    frontMatter.push("date_added: 2023-04-16")
    frontMatter.push("date_updated: 2023-04-16")
    frontMatter.push("pinned: true")

    const content : string[] = []
    
    const result = getMarkdownObject<BlogPost>(frontMatter, content, BlogFrontMatterSchema);    
    expect(result.success).toBe(false)
    if (result.errorType === 'Parsing error' && result.issues) {
        for (const issue of result.issues) {
            console.log(`Field: ${issue.path[0]} - ${issue.message}`)
        }
    }
})

test('extra field (extra_value) and missing field (pinned)', () => {
    const frontMatter = []
    frontMatter.push("title: Demo page for css")
    frontMatter.push("description: Astro notes")
    frontMatter.push("tags:")
    frontMatter.push("  - astro")
    frontMatter.push("  - powershell")
    frontMatter.push("  - cs")
    frontMatter.push("date_published: 2023-04-16")
    frontMatter.push("date_added: 2023-04-16")
    frontMatter.push("date_updated: 2023-04-16")
    frontMatter.push("extra_value: hello")

    const content : string[] = []
    
    const result = getMarkdownObject<BlogPost>(frontMatter, content, BlogFrontMatterSchema);    
    expect(result.success).toBe(false)
    if (result.errorType?.startsWith('Missing/extra')) {
        expect(result.errorType).toMatch(/^Missing/)
        console.log(result.error)
    }
})


