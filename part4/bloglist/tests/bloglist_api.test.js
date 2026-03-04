const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('blogs api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('GET /api/blogs', () => {
    test('blog posts are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blog posts are returned', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('unique identifier property of the blog posts is named "id"', async () => {
      const response = await api.get('/api/blogs')
      const blog = response.body[0]
      assert.ok(blog.id)
      assert.ok(!blog._id)
    })
  })

  describe('POST /api/blogs', () => {
    test('a valid blog post can be added', async () => {
      const newBlog = {
        title: 'Full Stack open course is awesome',
        author: 'Sasha Kravets',
        url: 'https://example.com/full-stack-open-course-is-awesome.html',
        likes: 30,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes('Full Stack open course is awesome'))
    })

    test('if the likes property is missing from the request, it will default to the value 0', async () => {
      const newBlog = {
        title: 'Full Stack open course is awesome',
        author: 'Sasha Kravets',
        url: 'https://example.com/full-stack-open-course-is-awesome.html',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      const addedBlogPost = blogsAtEnd.find(blogPost => blogPost.title === newBlog.title)

      assert(addedBlogPost.likes === 0)
    })

    describe('when title or url is missing', () => {
      test('if the title is missing → status 400', async () => {
        const blogWithoutTitle = {
          author: 'Sasha Kravets',
          url: 'https://example.com/full-stack-open-course-is-awesome.html',
          likes: 30,
        }

        await api
          .post('/api/blogs')
          .send(blogWithoutTitle)
          .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      })

      test('if the url is missing → status 400', async () => {
        const blogWithoutUrl = {
          title: 'Full Stack open course is awesome',
          author: 'Sasha Kravets',
          likes: 30,
        }

        await api
          .post('/api/blogs')
          .send(blogWithoutUrl)
          .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      })
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})