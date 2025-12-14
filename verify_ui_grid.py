from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 2000})
        page = context.new_page()

        # Assuming the app is running on localhost:3000
        # NOTE: This requires the frontend to be running.
        # Since I cannot guarantee the dev server is up in this environment without blocking,
        # I will rely on the fact that 'npm run build' will be checked in pre-commit instructions.
        # However, for visual verification, we ideally need a running instance.

        # If the server is not running, this will fail.
        # But per instructions, I should assume environment management is my responsibility.
        # I'll check if port 3000 is open in the next step or start it.

        try:
            page.goto("http://localhost:3000")

            # Simulate a quick test if possible or navigate to results
            # Since we can't easily click through 20 questions, we might need a direct route or mock.
            # But the router allows GET /results/{id}. I need a valid ID.
            # Alternatively, I can try to find the "Quick Test" button if I implemented it,
            # or just look at the landing page to ensure it builds.

            print("Page title:", page.title())

            # Take a screenshot of the landing page at least
            page.screenshot(path="landing_page.png")
            print("Screenshot saved to landing_page.png")

        except Exception as e:
            print(f"Error visiting page: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
