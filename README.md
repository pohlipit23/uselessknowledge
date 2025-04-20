# Useless Knowledge Project

**Celebrating the weird, wonderful, and utterly 'useless' expertise within everyone.**

## The Idea

I believe everyone's an expert at *something* completely random and fascinating, often entirely unrelated to their day job. From the history of breakfast cereal mascots to the migratory patterns of European birds, or a completely rare handicraft – these deep dives make us unique.

This project is a simple, fun experiment: a place to anonymously (or not!) share that specific domain of knowledge you've cultivated, simply because it interests you. It's about revealing the hidden, passionate experts behind the professional titles and sparking unexpected connections.

As the homepage says: "We all have that one weird, wonderful, completely useless domain of knowledge that has nothing to do with our day job. Here's where we celebrate it."

## My Tech Journey

Here are some details of how I developed [uselessknowledge.me](https://www.uselessknowledge.me)

* **Homepage:** Displays a random selection of 4 'useless knowledge' entries on every visit.
* **Submission Page (`/share.html`):** A form for users to submit their own expertise.
    * Required fields: Knowledge Domain, Details, Day Job.
    * Optional fields: Name, Social Handle, Headline (for display).
* **Secure Submissions:** Uses Google reCAPTCHA v3 with server-side validation (via Cloudflare Functions) to protect against spam.
* **Serverless Backend:** Leverages Cloudflare Functions to securely interact with the database.
* **Data Storage:** Uses Supabase (PostgreSQL) to store submissions.

## Tech Stack

* **Frontend:** HTML, Tailwind CSS (via CDN), Vanilla JavaScript
* **Backend:** Cloudflare Functions (running on Cloudflare Pages)
* **Database:** Supabase (PostgreSQL)
    * Includes a table (`knowledge_entries`) and a custom SQL function (`get_random_knowledge_entries`) for random selection.
* **Hosting:** Cloudflare Pages
* **Spam Protection:** Google reCAPTCHA v3

## Setup Highlights

* Requires a Supabase project setup with the specified table and SQL function.
* Requires a Cloudflare Pages project with the following Environment Variables configured as **Secrets**:
* Requires `package.json` with `@supabase/supabase-js` dependency.
* Requires the Build command in Cloudflare Pages set to `npm install`.

## Contact

For questions, feedback, or just to share your own useless knowledge directly, feel free to reach out:

pete@08-08-08.com

---