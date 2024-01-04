import { expect, test, galata } from '@jupyterlab/galata';
import path from 'path';

test.use({ autoGoto: false });

test.describe('UI Test', () => {
  test.describe('Extension activation test', () => {
    test('should emit an activation console message', async ({
      page,
      request
    }) => {
      const logs: string[] = [];

      page.on('console', message => {
        logs.push(message.text());
      });

      await page.goto();

      expect(
        logs.filter(s => s === 'jupytercad:salome is activated!')
      ).toHaveLength(1);
    });
  });

  test.describe('Mesh generation test', () => {
    let errors = 0;
    test.beforeEach(async ({ page }) => {
      page.setViewportSize({ width: 1920, height: 1080 });
      page.on('console', message => {
        if (message.type() === 'error') {
          errors += 1;
        }
      });
    });

    test.afterEach(async ({ page }) => {
      errors = 0;
    });

    test(`Should be able to create mesh without error`, async ({ page }) => {
      await page.goto();
      await page.locator('div.jpcad-Spinner').waitFor({ state: 'hidden' });

      await page
        .getByLabel('notebook content')
        .getByText('New JCAD File')
        .click();
      await page.getByRole('button', { name: 'New Box' }).click();
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.getByRole('button', { name: 'Mesh creation' }).click();
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(1000);
      await page
        .getByRole('tablist', { name: 'main sidebar' })
        .getByRole('tab', { name: 'JupyterCad Control Panel' })
        .click();
      await page
        .getByRole('tablist', { name: 'alternate sidebar' })
        .getByRole('tab', { name: 'JupyterCad Control Panel' })
        .click();
      await page.waitForTimeout(500);
      const main = await page.$('#jp-main-split-panel');
      expect(errors).toBe(0);
      if (main) {
        expect(await main.screenshot()).toMatchSnapshot();
      }
    });
  });
});
