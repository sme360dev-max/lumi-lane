import { expect, test } from '@playwright/test';

const REQUIRED_MESSAGES = [
  'Please tell us your name.',
  'Enter a valid email address.',
  'Enter a contact number.',
  'How many are joining us?',
  'Add a date, for example 24/08/2026.',
  'Let us know a time.',
];

test('booking: validation errors, API submission, and request summary', async ({ page }) => {
  await page.goto('/book/');
  await page.getByRole('button', { name: 'Request a Table' }).click();
  await expect(page.getByLabel('Name')).toBeFocused();
  await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true');
  for (const msg of REQUIRED_MESSAGES) await expect(page.getByText(msg)).toBeVisible();

  await page.getByLabel('Name').fill('Sam Lee');
  await expect(page.getByText('Please tell us your name.')).toBeHidden();
  await page.getByLabel('Email').fill('sam@example');
  await page.getByLabel('Phone').fill('0400 000 000');
  await page.getByLabel('Guests').fill('4');
  await page.getByLabel('Date').fill('01/01/2020');
  await page.getByLabel('Time').fill('lunch');
  await page.getByRole('button', { name: 'Request a Table' }).click();
  await expect(page.getByLabel('Email')).toBeFocused();
  await expect(page.getByText('Choose today or a later date.')).toBeVisible();
  await expect(page.getByText('Enter a time such as 10:30 AM.')).toBeVisible();

  const requests: Record<string, string>[] = [];
  await page.route('**/api/bookings/', async (route) => {
    const submitted = route.request().postDataJSON() as Record<string, string>;
    requests.push(submitted);
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Request received', requestId: submitted.requestId }),
    });
  });
  await page.getByLabel('Email').fill('sam@example.com');
  await page.getByLabel('Date').fill(`24/08/${new Date().getFullYear() + 1}`);
  await page.getByLabel('Time').fill('10.30am');
  await page.getByLabel('Special Requests').fill('High chair please');
  await page.getByRole('button', { name: 'Request a Table' }).click();

  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    await expect(page.getByText('Online booking is not configured yet. Please call us to book.')).toBeVisible();
    expect(requests).toHaveLength(0);
    return;
  }

  const summary = page.getByTestId('booking-summary');
  await expect(summary.getByRole('heading', { name: 'We have your request.' })).toBeFocused();
  await expect(summary.getByText('Your request has been sent to Lumi Lane. The team will contact you to confirm your table.')).toBeVisible();
  await expect(summary).toContainText('10:30 AM');
  await expect(summary).toContainText('High chair please');
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatchObject({
    name: 'Sam Lee',
    email: 'sam@example.com',
    guests: '4',
    time: '10:30',
    notes: 'High chair please',
  });

  await summary.getByRole('button', { name: 'Edit details' }).click();
  await expect(page.getByLabel('Name')).toHaveValue('Sam Lee');
});
