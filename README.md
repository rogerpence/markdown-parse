# Validate Markdown frontmatter with Zod. 

This code provides two functions:

## 1. parseMarkdownFile 

```
parseMarkdownFile = (filename: string): { frontMatter: string[], content: string[] }
```

This function only argument is a markdown file name that should end in `.md`. It parses that markdown file, return an object with two arrays:

- frontMatter is a string array of frontmatter variable declarations.
- content is a string array of each line of the content of the markdown content. 

## 2. getMarkdownObject

```
getMarkdownObject = <T>(frontMatter: string[], content: string[], schema: z.ZodType<T>): MarkdownResult<T>
```

```
type ArticleObject<T> = {
  frontMatter: T;
  content: string;
};

type MarkdownResult<T> = {
  success: boolean;
  errorType?: string;
  data?: ArticleObject<T>;
  error?: string;
  issues?: string[];
};
```

This generic function returns an instance of MarkdownResult. If `success` value is true then the `frontMatter` value returns a `MarkdownResult` typed to value of `T` passed to `getMarkdownObject`. Otherwise `success` is false and the `MarkdownResult` object's `errorType` and `error` values show error information. 

The markdown frontmatter is defined with a Zod object. For example, given this markdown document:

```
---
title: PowerShell is cool
description: Powershell interesting thing
tags:
  - powershell
  - cs
date_published: 2023-04-16
date_added: 2023-04-16
date_updated: 2023-04-16
pinned: false
---

This is the first line of text in the demo page used to tweak CSS for markdown documents. 
```

The following Zod object defines its frontmatter and the code that follows show how to call `getMarkdownObject`:

```
const BlogFrontMatterSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  date_published: z.coerce.date().max(new Date(), 'Date cannot be in the future'),
  date_added: z.coerce.date(),
  date_updated: z.coerce.date(),
  pinned: z.boolean(),
}).strict();

type BlogPost = z.infer<typeof BlogFrontMatterSchema>;

const markdownObject = parseMarkdownFile('demo.md');
const result = getMarkdownObject<BlogPost>(markdownObject.frontMatter, markdownObject.content, BlogFrontMatterSchema);
```

Generally, the `BlogFrontMatterSchema`  and `BlogPost` values would be exported from a single file. 

```
import { BlogFrontMatterSchema, type BlogPost } from '.../BlogPostInfo.ts';

const markdownObject = parseMarkdownFile('demo.md');
// Test for error here.
const result = getMarkdownObject<BlogPost>(markdownObject.frontMatter, markdownObject.content, 
BlogFrontMatterSchema);
// Test for error here.
```
