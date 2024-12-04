import {parseMarkdownFile, getMarkdownObject} from './markdown-parse.ts';
import { z } from 'zod';

// Example schema with validation
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
  
  const { frontMatter, content } = parseMarkdownFile('./demo.md');
  
  const result = getMarkdownObject<BlogPost>(frontMatter, content, BlogFrontMatterSchema);
  
  if (result.success && result.data) {
    console.log(result.data.frontMatter);  
    //console.log(result.data.content);  
  } else {
    console.error(result.error);
  }
  