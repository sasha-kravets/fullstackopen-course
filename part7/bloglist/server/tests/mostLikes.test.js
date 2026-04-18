const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most likes', () => {
  const blogs = listHelper.initialBlogs

  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, returns that author with number of likes', () => {
    const singleBlogList = [blogs[0]]
    const result = listHelper.mostLikes(singleBlogList)
    assert.deepStrictEqual(result, { author: 'Michael Chan', likes: 7 })
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})
