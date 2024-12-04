// sum.test.js
import { expect, test } from 'vitest'
import {parseMarkdownFile, getMarkdownObject} from './markdown-parse.ts';
import { z } from 'zod';
import { BlogFrontMatterSchema, type BlogPost } from './BlogInfo.ts';

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

test('all values with optional value', () => {
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

    // console.log(result.errorType)
    // console.log(result.error)
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
    //console.log('missing tags property test-->', result.error)
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
    // if (result.errorType === 'Parsing error' && result.issues) {
    //     for (const issue of result.issues) {
    //         console.log(`Field: ${issue.path[0]} - ${issue.message}`)
    //     }
    // }
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
    // if (result.errorType?.startsWith('Missing/extra')) {
    //     expect(result.errorType).toMatch(/^Missing/)
    //     console.log(result.error)
    // }
})


