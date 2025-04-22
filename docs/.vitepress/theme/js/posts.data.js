import { createContentLoader } from 'vitepress'

export default createContentLoader('**/!(index).md', /* options */)