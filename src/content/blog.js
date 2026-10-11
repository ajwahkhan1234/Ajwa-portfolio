// Blog posts. scripts/build-pages.mjs turns each one into a static HTML page under /blog/.
// Body is trusted HTML written here; keep claims to things Ajwa has built or measured.

export const posts = [
  {
    slug: 'ai-agents-in-production',
    title: 'AI agents in production: let code measure and the model judge',
    description:
      'What actually breaks when an LLM agent leaves the demo and meets real users, and the architecture rule that fixes most of it.',
    date: '2026-10-11',
    readTime: '7 min read',
    tags: ['AI agents', 'LLMs', 'Architecture'],
    takeaways: [
      'Every number, score and fact should come from deterministic, tested code. The model plans, reads, classifies and writes.',
      'Put every model call behind a timeout, validation and a fallback, so a bad output can never reach a user unchecked.',
      'Rate limits, deprecated models and silent upstream changes are architecture problems, not prompt problems.',
    ],
    body: `
<p>Agents are the most important shift in software this year. Instead of answering one prompt, a model now plans a task, calls tools, reads the results and decides what to do next. The demos are impressive. Production is a different story, and most of the trouble has nothing to do with how clever the model is.</p>
<p>I build agents that run every day for real businesses: an SEO teardown agent that audits law-firm websites, a job-discovery pipeline, a multi-agent SEO monitoring system and a local voice assistant. Each one broke in production in a way the demo never showed. The fixes all pointed to the same rule.</p>

<h2>The rule: code measures, the model judges</h2>
<p>Language models are excellent at reading messy input, classifying it and writing clear text. They are unreliable at producing the same number twice. So I split every system along that line:</p>
<ul>
  <li><strong>Deterministic code</strong> crawls pages, counts things, runs checks and computes every score.</li>
  <li><strong>The model</strong> plans which checks to run, interprets what they found and writes the explanation.</li>
</ul>
<p>When an early version of my SEO agent told a firm it had no attorney biographies, the firm had 47 of them. The model had sampled a handful of pages and drawn a confident conclusion. The fix was not a better prompt. I split "does it exist" checks, where every URL is classified by code, from "how good is it" checks, where the model reads a sample. The scoring itself moved entirely into code that the model cannot nudge.</p>

<h2>What breaks first</h2>
<h3>1. Quotas and rate limits</h3>
<p>One agent run can make 15 to 20 model calls. On a free or low tier, the second run of the day dies halfway through. Treat the model like any other rate-limited API: a shared token bucket across all workers, exponential backoff on 429 responses, and a cheaper model alias for the steps that do not need the strongest one.</p>
<h3>2. Models disappear</h3>
<p>Providers retire model versions, sometimes only for new API keys. If the model name is hard-coded in five places, you find out from a user. Keep the model name in one config value, version your prompts alongside it, and have a fallback model ready.</p>
<h3>3. Upstream data changes silently</h3>
<p>My rank-tracking tool once reported that every site had dropped out of Google. Nothing had dropped. Google had changed its result links to opaque redirects, and the parser quietly found nothing. Now a run with zero organic results raises a hard error. If the outside world changes, the tool fails loudly instead of lying quietly.</p>
<h3>4. Runaway tool calls and invented tools</h3>
<p>Agents sometimes call tools that do not exist or loop on the same call. Validate every tool name against the real spec, cap the number of steps per run, and fall back to a plain chat answer when the plan goes off the rails.</p>

<h2>Guard rails that pay for themselves</h2>
<ul>
  <li><strong>Timeouts with a null fallback.</strong> If the model is slow, the report ships without the advisory paragraph instead of blocking.</li>
  <li><strong>Structured output, validated.</strong> Parse the model's JSON against a schema and reject anything that does not fit.</li>
  <li><strong>Bounded writing.</strong> For anything sent to a person, such as a cover letter or an outreach email, use a template and let the model fill specific slots. It cannot invent a job history it was never given.</li>
  <li><strong>Binary questions instead of free scores.</strong> A small local model gave a perfect-match job 20 out of 100. Five yes-or-no questions mapped to fixed points gave identical results across repeated trials.</li>
  <li><strong>Dry-run by default, daily caps and a kill switch</strong> for anything that acts in the outside world.</li>
</ul>

<h2>The takeaway</h2>
<p>The teams getting real value from agents are not the ones with the cleverest prompts. They are the ones who decided early which parts of the system must be exact and kept the model away from those parts. Let the model do what it is good at, judgement and language, and let code do the rest.</p>
`,
  },
  {
    slug: 'seo-for-ai-search',
    title: 'SEO for AI search: how to get cited in AI Overviews and answer engines',
    description:
      'Search is turning into answers. What changes for websites when Google, ChatGPT and Perplexity summarise the web, and what still matters.',
    date: '2026-10-08',
    readTime: '8 min read',
    tags: ['SEO', 'AI search', 'Content'],
    takeaways: [
      'AI answers are built from pages that are crawlable, clearly structured and specific. Classic technical SEO is the entry ticket.',
      'Write passages that answer one question completely, so a model can lift them as a citation.',
      'Measure impressions as well as clicks: visibility in AI answers often shows up before traffic does.',
    ],
    body: `
<p>For twenty years, search meant ten blue links. Now a growing share of searches end with an answer written by a model: Google's AI Overviews, ChatGPT search, Perplexity and Copilot. The question every site owner asks me is whether SEO still matters. It matters more, but the target has moved from ranking a page to being the source an answer is built from.</p>

<h2>What AI answers are built from</h2>
<p>Answer engines still start with retrieval. They search an index, pull the most relevant passages and then write a summary that cites some of them. That means the old foundations decide whether you are even in the pool:</p>
<ul>
  <li><strong>Crawlable and indexed.</strong> If Google has not indexed the page, no AI feature built on Google's index can cite it. I have diagnosed stores where only one page in a hundred was indexed; no amount of content fixes that.</li>
  <li><strong>Fast and rendered.</strong> Content that only appears after heavy JavaScript is easier to miss. Server-render or pre-render anything you want quoted.</li>
  <li><strong>Correct canonicals and clean pagination,</strong> so the engine knows which version of a page is the real one.</li>
</ul>

<h2>Write passages, not just pages</h2>
<p>Models quote passages. A page that wanders for 2,000 words before answering is hard to cite. A page where each section answers one question in its first two sentences is easy. In practice:</p>
<ul>
  <li>Use headings that match how people actually ask, such as "How long does a DUI case take in Tennessee?"</li>
  <li>Answer directly under the heading, then add the detail, the exceptions and the evidence.</li>
  <li>Add a short FAQ block for the follow-up questions people ask next.</li>
  <li>Use specific numbers, places and names. Vague copy gives a model nothing worth citing.</li>
</ul>

<h2>Prove you are the right source</h2>
<p>Answer engines favour sources that look trustworthy, which in practice means the same E-E-A-T signals Google has rewarded for years:</p>
<ul>
  <li>Real author and staff pages with credentials.</li>
  <li>Organization or LocalBusiness schema, with consistent name, address and phone everywhere.</li>
  <li>Original material: your own photos, data, case results and process, which nobody else can supply.</li>
</ul>
<p>For a Tennessee law firm, this looked like 26 city pages, practice-area hubs, attorney profiles and a library of more than 120 articles answering the urgent questions people search after an arrest or an accident. Impressions roughly doubled across three months.</p>

<h2>Measure the right thing</h2>
<p>When answers appear on the results page, some searchers never click. So clicks alone undercount your visibility. Watch these in Search Console:</p>
<ul>
  <li><strong>Impressions:</strong> are you being shown for more queries?</li>
  <li><strong>Average position</strong> for the questions you wrote passages for.</li>
  <li><strong>Query mix:</strong> longer, question-style queries usually mean you are being matched to intent, not just keywords.</li>
</ul>
<p>Across the sites I manage, impressions have moved first and clicks have followed. A vape wholesaler reached 161K impressions in three months; an automotive manufacturer reached 930K at an average position of 5.2.</p>

<h2>What not to do</h2>
<ul>
  <li>Do not mass-produce thin AI-written pages. They are easy to detect and add nothing a model cannot already write itself.</li>
  <li>Do not block the crawlers you want citations from in robots.txt by accident.</li>
  <li>Do not chase a single "AI ranking factor". The fundamentals compound; the tricks expire.</li>
</ul>

<h2>The takeaway</h2>
<p>AI search rewards the sites that were doing SEO properly all along: indexable, fast, structured and specific. The difference now is that each section of your page has to stand on its own as the answer to a question.</p>
`,
  },
  {
    slug: 'fake-captcha-attacks-wordpress',
    title: 'The fake CAPTCHA attacks hitting WordPress sites, and how to stop them',
    description:
      'ClickFix and blockchain-hosted loaders turned hacked WordPress sites into malware traps. How the attack works, how to find it and how to harden a site.',
    date: '2026-10-04',
    readTime: '8 min read',
    tags: ['Security', 'WordPress', 'Malware'],
    takeaways: [
      'The fake "verify you are human" box asks visitors to paste a command. The site is the bait; the visitor is the target.',
      'Payloads now hide in the database, in mu-plugins, in fake plugins and even on public blockchains, so file scanning alone misses them.',
      'Reset every admin password, audit users, remove what you do not recognise and lock file permissions after any clean-up.',
    ],
    body: `
<p>The most damaging attack I have cleaned up this year does not deface a website or steal its database. It turns the site into a trap for its own visitors. A fake CAPTCHA appears, says "verify you are human", and tells the visitor to press a key combination and paste a command. That command installs malware on their computer. Security researchers call this pattern ClickFix.</p>
<p>I have removed versions of it from law-firm, finance and small-business WordPress sites on four different hosts. Here is how it works and how to stop it.</p>

<h2>How the attack works</h2>
<ol>
  <li><strong>Access.</strong> Attackers get in through a stolen admin password, a vulnerable plugin or a weak hosting account.</li>
  <li><strong>Persistence.</strong> They plant several ways back in: a hidden admin user, a backdoor file in uploads, a fake plugin with a believable name, or a drop-in such as <code>wp-content/db.php</code> that loads before WordPress itself.</li>
  <li><strong>Injection.</strong> A small loader script is added to pages, often stored in the database rather than in a file.</li>
  <li><strong>The trap.</strong> The loader fetches the fake CAPTCHA and the command it asks visitors to run.</li>
</ol>

<h2>Why it is hard to find</h2>
<p>Older malware lived in files, so a file scanner could find it. These campaigns spread out:</p>
<ul>
  <li><strong>Database options and post meta</strong> hold the payload, sometimes with innocent-looking names.</li>
  <li><strong>Must-use plugins</strong> load automatically and do not appear in the normal plugin list.</li>
  <li><strong>Blockchain hosting.</strong> Some loaders fetch their next stage from a smart contract on a public blockchain. There is no server to take down, and the attacker can change the payload whenever they like. This technique is known as EtherHiding.</li>
  <li><strong>Visitor targeting.</strong> The trap may only show to first-time visitors or to Windows users, so the owner logged in on a Mac never sees it.</li>
</ul>

<h2>How to check your site</h2>
<ul>
  <li>Open the site in a private window on a different device, and look for any "verify you are human" prompt you did not add.</li>
  <li>List every administrator account and remove the ones nobody recognises.</li>
  <li>Look in <code>wp-content/mu-plugins</code> and for a <code>db.php</code> or <code>object-cache.php</code> you did not install.</li>
  <li>Compare WordPress core files with the official release; any difference is suspicious.</li>
  <li>Search the database options table for long encoded strings and unfamiliar script URLs.</li>
</ul>

<h2>Cleaning up properly</h2>
<p>Removing the visible script is not a clean-up. If the backdoor stays, the site is reinfected within days. I have seen it happen. A real clean-up:</p>
<ol>
  <li>Takes a full backup first, then works from a copy.</li>
  <li>Removes every persistence point: users, files, drop-ins, mu-plugins and database payloads.</li>
  <li>Replaces core files with clean copies and reinstalls plugins from official sources.</li>
  <li>Resets every password: WordPress admins, hosting, FTP, database and email.</li>
  <li>Deletes any public backup or database dump left in the web root.</li>
</ol>

<h2>Hardening that actually helps</h2>
<ul>
  <li>Two-factor authentication for every admin account.</li>
  <li>Disable file editing in the dashboard and lock permissions on custom code.</li>
  <li>Remove abandoned plugins. Most infections I see start with one nobody remembered was installed.</li>
  <li>Block username enumeration and limit login attempts.</li>
  <li>Monitor: a scheduled check that alerts on new admin users, changed core files and new scripts in the page source.</li>
</ul>
<p>I packaged these checks into a WordPress plugin, Inovista Shield, after the same malware families kept coming back across client sites. Whatever tool you use, the principle is the same: assume the attacker left more than one door open, and close them all.</p>
`,
  },
  {
    slug: 'local-ai-models',
    title: 'Running AI on your own machine: when a local model beats the cloud',
    description:
      'Small open models now run well on a laptop. Where they shine, where they fail, and how to design around their limits.',
    date: '2026-09-30',
    readTime: '6 min read',
    tags: ['AI', 'Local LLMs', 'Privacy'],
    takeaways: [
      'Local models are great for private, repetitive, bounded tasks: classification, extraction, summaries and voice.',
      'Small models are poor judges. Give them yes-or-no questions and templates, not open-ended scoring.',
      'Check that the model is really running on the GPU; under memory pressure it can silently fall back to the CPU.',
    ],
    body: `
<p>A year ago, running a language model meant sending data to someone else's server. Today a small open model runs comfortably on a laptop, with no API bill, no rate limit and nothing leaving the machine. I run a voice assistant, an SEO monitoring system and a job-search pipeline on local models. Here is what I have learned about when that is the right choice.</p>

<h2>Where local models shine</h2>
<ul>
  <li><strong>Privacy.</strong> Client documents, inboxes and voice never leave the device. For some clients this is the whole reason to use AI at all.</li>
  <li><strong>Cost at volume.</strong> A job that runs every hour over thousands of items costs nothing extra.</li>
  <li><strong>No quotas.</strong> No free-tier wall halfway through a run.</li>
  <li><strong>Latency for voice.</strong> Wake word, speech-to-text, a small model and text-to-speech can all run on-device, quickly enough for a natural conversation.</li>
</ul>

<h2>Where they fail</h2>
<p>Small models are confident and wrong in ways larger models usually are not. In my own tests, a three-billion-parameter model:</p>
<ul>
  <li>scored a perfect-match job 20 out of 100, with reasoning that contradicted itself;</li>
  <li>invented employment history when asked to write a cover letter;</li>
  <li>labelled bank promotions as job offers.</li>
</ul>
<p>None of this means local models are useless. It means you should not ask them for open-ended judgement.</p>

<h2>Design around the limits</h2>
<ul>
  <li><strong>Ask binary questions.</strong> Replace "score this from 0 to 100" with five yes-or-no questions mapped to fixed points. Results became identical across repeated runs.</li>
  <li><strong>Use templates.</strong> Let the model fill bounded slots in a fixed structure instead of writing freely.</li>
  <li><strong>Gate before you ask.</strong> A cheap relevance filter in code stops irrelevant input from ever reaching the model.</li>
  <li><strong>Keep maths in code.</strong> Anomaly detection, trends and scores are pure arithmetic; the model only writes the explanation.</li>
  <li><strong>Retrieve, do not memorise.</strong> A small model plus a local vector store of the right documents beats a bigger model guessing from memory.</li>
</ul>

<h2>The hardware gotcha</h2>
<p>On Apple silicon, local models run on the GPU and are fast. But when memory is tight, a model can quietly spill onto the CPU and become many times slower, with no error. Check what the runtime reports about where the model is loaded before you blame the model for being slow.</p>

<h2>Choosing local or cloud</h2>
<p>My rule of thumb: use a local model for private, repetitive and bounded work, and a frontier cloud model for hard reasoning, long documents and anything a customer reads directly. Many of my systems use both: local for the high-volume classification, cloud for the final write-up, each behind the same timeout and fallback.</p>
`,
  },
  {
    slug: 'core-web-vitals-inp',
    title: 'Core Web Vitals in 2026: why INP is the metric to fix first',
    description:
      'Interaction to Next Paint replaced First Input Delay and catches the slowness users actually feel. What causes poor INP and how to fix it.',
    date: '2026-09-26',
    readTime: '6 min read',
    tags: ['Performance', 'Core Web Vitals', 'SEO'],
    takeaways: [
      'INP measures how quickly the page responds to every interaction, not just the first one. Aim for 200 ms or less.',
      'Long JavaScript tasks are the main cause: heavy plugins, chat widgets, trackers and animation libraries running on the main thread.',
      'Fix it by doing less work on interaction, breaking up long tasks and loading third-party scripts later.',
    ],
    body: `
<p>Core Web Vitals are Google's measures of how a page feels to real visitors: how fast the main content appears (LCP), how much the layout jumps around (CLS) and how quickly the page responds when you interact with it (INP). In March 2024, Interaction to Next Paint replaced First Input Delay, and it is the one most sites now fail.</p>

<h2>Why INP is harder than FID</h2>
<p>First Input Delay only measured the delay before the browser started handling the first tap or click. A page could pass while every later interaction felt sluggish. INP looks at interactions across the whole visit and reports one of the slowest, from the click until the next frame is painted. It measures the slowness people actually notice: a menu that takes half a second to open, a filter that freezes the page, an "add to cart" that seems to do nothing.</p>
<p>Google's thresholds: <strong>200 ms or less is good</strong>, up to 500 ms needs improvement, and anything slower is poor.</p>

<h2>What usually causes poor INP</h2>
<ul>
  <li><strong>Long tasks on the main thread.</strong> Any JavaScript that runs for more than about 50 ms blocks the browser from responding.</li>
  <li><strong>Third-party scripts.</strong> Chat widgets, heat maps, ad and tracking tags often run work on every interaction.</li>
  <li><strong>Page builders and plugin stacks</strong> that attach many listeners and re-render large parts of the page.</li>
  <li><strong>Heavy visual effects</strong> such as large blur filters or animating box shadows, which make every frame expensive to paint.</li>
</ul>

<h2>How I fix it</h2>
<ol>
  <li><strong>Measure field data first.</strong> Search Console's Core Web Vitals report and PageSpeed Insights show real-user INP. Lab tests alone miss it.</li>
  <li><strong>Find the slow interaction.</strong> Record a performance trace in Chrome DevTools while clicking the slow element, and look for long tasks.</li>
  <li><strong>Do less on interaction.</strong> Update the visible state first, then defer the expensive work.</li>
  <li><strong>Break up long tasks</strong> so the browser can paint in between, and move heavy work off the main thread where you can.</li>
  <li><strong>Load third parties later.</strong> Delay chat and tracking scripts until after the first interaction or when the browser is idle.</li>
  <li><strong>Make effects cheap.</strong> Animate transforms and opacity, avoid repainting large blurred or shadowed areas on every frame, and pause animations that are off screen.</li>
</ol>

<h2>Do not forget LCP and CLS</h2>
<ul>
  <li><strong>LCP:</strong> serve the hero image in a modern format at the right size, preload it, and do not lazy-load what is above the fold.</li>
  <li><strong>CLS:</strong> give images and embeds explicit width and height, and reserve space for banners before they load.</li>
</ul>
<p>On one clinic landing page, compressing images, deferring third-party scripts and trimming unused CSS took the desktop PageSpeed score to 97. On a surgeon's site, before-and-after galleries that were blank on phones came back after the sliders were initialised at the right moment and 3 MB images were compressed.</p>

<h2>The takeaway</h2>
<p>Good INP is mostly about restraint: less JavaScript running when people interact. Every script, widget and effect has a cost, and visitors pay it on every tap.</p>
`,
  },
];
