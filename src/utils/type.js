/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {"multiple-choice" | "essay" | "fill-blank" | "drag-drop"} type
 * @property {string} content
 * @property {string[]=} options
 * @property {string|string[]=} [correctAnswer]
 */

/**
 * @typedef {Object} Test
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {Question[]} questions
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {boolean} published
 * @property {string} createdBy
 */

/**
 * @typedef {Object} TestResult
 * @property {string} id
 * @property {string} testId
 * @property {string} userId
 * @property {number} score
 * @property {number} maxScore
 * @property {Object.<string, any>} answers
 * @property {string} startedAt
 * @property {string} submittedAt
 */

/**
 * @typedef {Object} UserAnswer
 * @property {string} questionId
 * @property {string|string[]} answer
*/