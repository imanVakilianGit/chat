import { SLUGIFY_REPLACE_REGEX } from "../regex/slugify.regex";

export function slugifyStrings(input: string): string {
    return input.trim().replace(SLUGIFY_REPLACE_REGEX, "_");
}
