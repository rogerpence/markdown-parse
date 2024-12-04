import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { z } from 'zod';

// Types
export type ArticleObject<T> = {
  frontMatter: T;
  content: string;
};

export type MarkdownResult<T> = {
  success: boolean;
  errorType?: string;
  data?: ArticleObject<T>;
  error?: string;
  issues?: string[];
};

// Parse markdown file
export const parseMarkdownFile = (filename: string): { frontMatter: string[], content: string[] } => {
  if (!filename.endsWith('.md')) {
    throw new Error('File must be a markdown file');
  }

  const frontMatter: string[] = [];
  const content: string[] = [];
  let frontMatterDelimiterCount = 0;
  const FRONT_MATTER_DELIMITER = /^---\s*$/;

  const allFileContents = fs.readFileSync(filename, 'utf-8');
  const lines = allFileContents.split(/\r?\n/);

  for (const line of lines) {
    if (line.match(FRONT_MATTER_DELIMITER)) {
      frontMatterDelimiterCount++;
      continue;
    }

    if (frontMatterDelimiterCount <= 1) {
      frontMatter.push(line);
    } else {
      content.push(line);
    }
  }

  return { frontMatter, content };
};

// Generic markdown parser
export const getMarkdownObject = <T>(frontMatter: string[], content: string[], schema: z.ZodType<T>): MarkdownResult<T> => {
  try {    
    const parsed: any = yaml.load(frontMatter.join('\n'));
    const objectFields = Object.keys(parsed);

    const schemaShape = schema.shape as { [k: string]: z.ZodTypeAny };
    const requiredFields = Object.entries(schemaShape)
        .filter(([_, type]) => !type.isOptional())
         .map(([field]) => field);
    
    // checking array for presence of required fields. (uses includes method)     
    const missingFields = requiredFields.filter(field => !objectFields.includes(field));
    
    // checking schema object for presence of extra fields. (uses in operator)
    const extraFields = objectFields.filter(field => !(field in schemaShape));
    
    if (missingFields.length > 0 || extraFields.length > 0) {
      const errors = [];
      if (missingFields.length) errors.push(`Missing required field(s): ${missingFields.join(', ')}`);
      if (extraFields.length) errors.push(`Extra field(s): ${extraFields.join(', ')}`);
      return { success: false, errorType: 'Missing/extra field(s)', error: errors.join(';') };
    }

    const fm = schema.parse(parsed);
    return {
      success: true,
      data: {
        frontMatter: fm,
        content: content.join('\n'),
      }
    };

  } catch (error: any) {
    return {
      success: false,
      errorType: "Parsing error",
      error: `Error parsing markdown: ${error.message} ${error.path}`,
      issues: error.issues ?? ''
    };
  }
};

// -----------------------------------------------------------------

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

//console.log(markdownObject);
console.log(result);