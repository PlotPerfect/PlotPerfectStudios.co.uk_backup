# Plot Perfect Studios Website

This is the official website for Plot Perfect Studios Ltd, a creative digital agency based in Epping, UK. The site showcases our services, portfolio, and expertise in:

- Custom Web Development
- 3D Architectural Rendering
- SEO Services
- UI/UX Design
- Digital Marketing

## Features
- Modern, responsive design
- Service and portfolio showcase
- SEO-optimized content and structure
- Newsletter signup
- Contact form with reCAPTCHA
- Blog section with industry insights and project case studies
- Custom HTML, CSS, and JavaScript (no templates or CMS)

## Live Site
[https://plotperfectstudios.co.uk/](https://plotperfectstudios.co.uk/)

## About
Plot Perfect Studios delivers bespoke digital solutions for architects, developers, and businesses. We combine technical expertise with creative vision to help clients grow online.

---

This project is hand-coded and maintained by Adam Chapman. For business inquiries, visit the [Contact](https://plotperfectstudios.co.uk/index.html#contact) section of the website.

---

## Testing for Canonical Links

To ensure all HTML files contain a valid `<link rel="canonical">` tag, automated tests are provided in the `tests/` directory.

### Running the Test

1. Make sure you have Python installed (version 3.6+ recommended).
2. Install `pytest` if you haven't already:
   ```powershell
   pip install pytest
   ```
3. Run the test from the project root:
   ```powershell
   pytest tests/test_canonical_links.py
   ```

The test will scan all `.html` files in the project root (except `admin.html`) and report any missing canonical link tags.