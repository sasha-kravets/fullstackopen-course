const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  const blogs = listHelper.initialBlogs

  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, returns that author with 1 blog', () => {
    const singleBlogList = [blogs[0]]
    const result = listHelper.mostBlogs(singleBlogList)
    assert.deepStrictEqual(result, { author: 'Michael Chan', blogs: 1 })
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(
      result,
      {
        author: 'Robert C. Martin',
        blogs: 3
      }
    )
  })
})