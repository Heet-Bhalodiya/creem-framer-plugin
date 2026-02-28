/**
 * Framer Code File Utilities
 * Functions for managing Framer code files
 */

import { framer } from 'framer-plugin'

/**
 * Ensures a code file exists in the Framer project, creating it if necessary
 * @param filename - Name of the code file to ensure exists
 * @param source - Source code content for the file
 * @returns The code file object
 * @throws Error if user lacks permission to create code files
 */
export async function ensureCodeFileExists(filename: string, source: string) {
  const codeFiles = await framer.getCodeFiles()
  const existingFile = codeFiles.find(f => f.name === filename)

  if (existingFile) {
    return existingFile
  }

  // Check permissions before creating code file
  const canCreate = await framer.isAllowedTo('createCodeFile')

  if (!canCreate) {
    throw new Error("You don't have permission to create code files in this project")
  }

  // Create the code file if it doesn't exist
  const newFile = await framer.createCodeFile(filename, source)

  return newFile
}
