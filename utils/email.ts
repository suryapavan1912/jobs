// utils/email.ts
import fs from 'fs/promises';
import path from 'path';

export async function getEmailTemplate(templateName: string): Promise<string> {
  const templatePath = path.join(process.cwd(), 'components', 'emails', `${templateName}.html`);
  const template = await fs.readFile(templatePath, 'utf-8');
  return template;
}

export function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
  return Object.entries(variables).reduce((result, [key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    return result.replace(regex, value);
  }, template);
}