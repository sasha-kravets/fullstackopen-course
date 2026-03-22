const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Sasha Kravets',
        username: 'skravets',
        password: '1234'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: '1234'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'skravets', '1234')
      await expect(page.getByText('Sasha Kravets logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'skravets', 'wrong')

      const errorDiv = page.locator('.notification.error')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Sasha Kravets logged in')).not.toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'skravets', '1234')
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'New blog', 'Playwright', 'https://playwright.dev/')
        await expect(page.getByText('New blog Playwright')).toBeVisible()
      })

      describe('and a blog exists', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'New blog', 'Playwright', 'https://playwright.dev/')
        })

        test('the blog can be liked', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByText('likes 0')).toBeVisible()
          await page.getByRole('button', { name: 'like' }).click()
          await expect(page.getByText('likes 1')).toBeVisible()
        })

        test('the user who added the blog can delete it', async ({ page }) => {
          page.on('dialog', async dialog => {
            await dialog.accept()
          })

          await page.getByRole('button', { name: 'view' }).click()
          await page.getByRole('button', { name: 'remove' }).click()
          await expect(page.getByText('New blog Playwright')).not.toBeVisible()
        })

        test('only the user who added the blog sees the blog\'s delete button', async ({ page }) => {
          await page.getByRole('button', { name: 'logout' }).click()
          await loginWith(page, 'root', '1234')

          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })
      })

      describe('and several blog exists', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'New Blog 1', 'Playwright', 'https://playwright.dev/')
          await createBlog(page, 'New Blog 2', 'Playwright', 'https://playwright.dev/')
        })

        test('the blogs are arranged in the order according to the likes', async ({ page }) => {
          await expect(page.locator('.blog')).toHaveCount(2);

          const secondBlog = page.locator('.blog').nth(1)
          await secondBlog.getByRole('button', { name: 'view' }).click()
          await secondBlog.getByRole('button', { name: 'like' }).click()

          await expect(page.getByText('likes 1')).toBeVisible()

          const titles = await page.locator('.blog .blog__title').allTextContents()

          expect(titles[0]).toEqual('New Blog 2')
          expect(titles[1]).toEqual('New Blog 1')
        })
      })
    })
  })
})